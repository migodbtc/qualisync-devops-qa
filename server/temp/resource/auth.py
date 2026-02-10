from flask import Blueprint, current_app, make_response, request, jsonify
from datetime import datetime, timedelta, timezone
import traceback

import utils
from db.controller import controller
from middleware.auth import store_jti, revoke_jti
from services.audit import log_audit
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    decode_token,
)

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=['POST'])
def register():
    payload = request.get_json() or {}
    email = payload.get('email')
    password = payload.get('password')
    role = payload.get('role', 'patient') # expected to have no role anyways

    print("Payload details...")
    print(payload)

    # register to auth_users first
    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400
    if role not in ('patient', 'doctor', 'nurse', 'admin'):
        return jsonify({'error': 'invalid role'}), 400

    existing = controller.find_one_by('auth_users', 'email', email)
    if existing:
        return jsonify({'error': 'user already exists'}), 400

    pw_hash = utils._hash_password(password)
    user_id = controller.create('auth_users', {
        'email': email,
        'password_hash': pw_hash,
        'role': role,
    })

    # if successful, register to user_profiles

    full_name = f"{payload.get('firstName')} {payload.get('middleName')} {payload.get('lastName')}"

    profile_id = controller.create('user_profiles', {
        'auth_id': user_id,
        'full_name': full_name, 
        'birthdate': payload.get("birthdate"), 
        'sex': payload.get("sex"),
        'address': payload.get("address"),
        'contact_number': payload.get("contactNumber"),
        'specialization': "None",
    })

    # write audit record: self-registration -> actor is the new user
    try:
        new_row = controller.get_by_id('auth_users', user_id)
        log_audit(user_id, 'auth_users', user_id, 'INSERT', None, new_row)
    except Exception as e:
        utils._log("[auth][audit] failed to write audit for new user %s" % user_id)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

    return jsonify({'id': user_id}), 201


@bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json() or {}
    email = payload.get('email')
    password = payload.get('password')

    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400

    user = controller.find_one_by('auth_users', 'email', email)
    if not user or not utils._verify_password(user['password_hash'], password):
        return jsonify({'error': 'invalid credentials'}), 401

    identity = user['auth_id']
    # Bind the additional properties of the pinpointed user from the db
    # To the additional claims as to be used by the Nextjs app
    additional_claims = {'role': user.get('role'), 'email': user.get('email')}

    # Flask-JWT-Extended / PyJWT expect the subject (sub) to be a string.
    identity_str = str(identity)
    access_token = create_access_token(identity=identity_str, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=identity_str)

    # store the refresh token's jti in DB (do not store the raw token)
    decoded = decode_token(refresh_token)
    jti = decoded.get('jti') 
    exp = decoded.get('exp')
    expires_at = datetime.fromtimestamp(exp, timezone.utc) 
    # turns out timezone has a utc variable. could be useful in js/ts lol
    expires_at_str = expires_at.strftime('%Y-%m-%d %H:%M:%S')

    try:
        store_jti(auth_id=identity, jti=jti, expires_at_str=expires_at_str)
    except Exception:
        try:
            utils._log(f"[auth] failed to store jti for user {identity}")
        except Exception:
            pass

    # copilot told me to opt for make_response instead of standard json 
    # im assuming its because make_response allows for better config?
    resp = make_response(
        jsonify(
            {
                'access_token': access_token,
                'token_type': 'bearer',
            }
        )
    )
    # this is probably for returning the access token 

    # setting a cookie + config properties like secure flag and samesite
    # specifically for the refresh token
    cookie_name = current_app.config.get('JWT_REFRESH_COOKIE_NAME', 'refresh_token_cookie') # default name
    secure_flag = current_app.config.get('JWT_COOKIE_SECURE', False) # True or False
    samesite = current_app.config.get('JWT_COOKIE_SAMESITE', 'Lax') # Lax, Strict, None

    resp.set_cookie(
        cookie_name,
        refresh_token, 
        httponly=True,
        secure=secure_flag,
        samesite=samesite,
        expires=expires_at,
        path='/'
    )

    return resp


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True, locations=['cookies'])
def refresh():
    # basic endpoint for refresh: get jwt identity
    # then make a new access token for that identity
    # and return that easy
    identity = get_jwt_identity()
    new_access = create_access_token(identity=identity)
    return jsonify({'access_token': new_access})

@bp.route('/logout', methods=['POST'])
@jwt_required(refresh=True, locations=['cookies'])
def logout():
    print("Payload for /logout")
    print(request.data)
    jwt_payload = get_jwt()
    jti = jwt_payload.get('jti')

    current_app.logger.info(f"JWT_PAYLOAD & JTI")
    current_app.logger.info(jwt_payload)
    current_app.logger.info("\n" + jti)
    
    # check if its a valid token by checking JWT identity authenticity
    # or so i think
    if not jti:
        return jsonify({'error': 'Invalid token'}), 400


    affected = revoke_jti(jti)
    if affected:
        # case where there is 1 or more token revoked 
        return jsonify({'revoked': True})
    # case where there are no tokens revoked
    return jsonify({'revoked': False}), 400
