import os
from datetime import datetime, timedelta
import time

from flask import jsonify
from app import app
from utils import _log
import traceback
from flask_jwt_extended import (
    JWTManager,
    get_jwt_identity,
)

from db.controller import controller
from functools import wraps
from flask import g


jwt = JWTManager(app)


def store_jti(auth_id: int, jti: str, expires_at_str: str) -> int:
    # function to store the refresh token jti in the mysql database 
    # usually used in the auth.py resource when issuing a new refresh token
    return controller.create('refresh_tokens', {
        'auth_id': auth_id,
        'refresh_token': jti,
        'expires_at': expires_at_str,
    })


def revoke_jti(jti: str) -> int:
    # function to revoke the refresh token within mysql database
    # v1 had a dedicated controller method for this 
    # v2 logs the case where 2 or more tokens are revoked at once
    affected = controller.revoke_refresh_token(jti) 
    if affected > 1:
        try: 
            _log(f"[auth][warning] revoked {affected} refresh tokens with jti={jti}")
        except Exception:
            pass
    return affected


def find_by_jti(jti: str):
    _log(f"[auth] FIND jti={jti}")
    return controller.find_one_by('refresh_tokens', 'refresh_token', jti)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload) -> bool:
    # Only check refresh tokens against DB blocklist
    token_type = jwt_payload.get('type')
    jti = jwt_payload.get('jti')
    if token_type != 'refresh' or not jti:
        return False

    # look up jti in refresh_tokens table
    row = find_by_jti(jti)
    if not row:
        # token not found -> treat as revoked/invalid
        return True
    return bool(row.get('revoked'))


def roles_required(*roles):
    """Decorator that ensures the current JWT identity belongs to a user with one of the given roles.

    Use as `@roles_required('admin')` or `@roles_required('doctor','nurse')`.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            identity = get_jwt_identity()
            try:
                auth_id = int(identity)
            except Exception:
                return jsonify({'error': 'invalid identity in token'}), 401

            user = controller.get_by_id('auth_users', auth_id)
            if not user:
                return jsonify({'error': 'user not found'}), 401
            if user.get('role') not in roles:
                # Log role mismatch for debugging: current role vs required minimum roles
                try:
                    cur_role = user.get('role')
                except Exception:
                    cur_role = 'UNKNOWN'
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] FORBIDDEN roles_required: user_id={auth_id} role={cur_role} required={roles}")
                return jsonify({'error': 'forbidden'}), 403

            g.current_user = user
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def minimum_role_for_table_action(table: str, action: str, data: dict, item_id: int, current_user: dict) -> str:
    """Return a short, human-readable description of the minimum role(s) required
    to perform `action` on `table` for the given request context.

    This mirrors the logic used by `authorize_table_action` but returns a
    description instead of a boolean. The description is intended for debug
    logging only — it's not used for enforcement.
    """
    role = (current_user or {}).get('role')
    uid = (current_user or {}).get('auth_id')

    # Admins always allowed
    if role == 'admin':
        return 'admin'

    if table == 'auth_users':
        if action == 'delete':
            return 'admin'
        if action == 'update':
            return "admin OR doctor/nurse (doctors/nurses cannot set role='admin' or promote patients to doctor/nurse; cannot self-promote to admin)"
        return 'admin'

    if table == 'user_profiles':
        if action == 'create':
            return 'owner (auth_id must match payload auth_id)'
        return 'owner (profile owner only)'

    if table == 'appointments':
        if action == 'create':
            return 'patient (own appointment) OR staff OR doctor/nurse'
        return 'doctor OR nurse'

    if table == 'medical_records':
        if action in ('create', 'update', 'delete'):
            return 'doctor OR nurse'
        return 'doctor OR nurse'

    return 'admin'


def authorize_table_action(table: str, action: str, data: dict, item_id: int, current_user: dict) -> bool:
    """Basic authorization rules for table-level actions.

    - `action` is one of: 'create', 'update', 'delete'
    - returns True if allowed, False otherwise
    """
    role = current_user.get('role')
    uid = current_user.get('auth_id')

    # Admins can always act
    if role == 'admin':
        return True

    if table == 'auth_users':
        # Non-admins have limited update permissions; deletes remain admin-only
        if action == 'delete':
            return False
        if action == 'update':
            # doctors and nurses may update users, but with constraints:
            # - they cannot set role to 'admin'
            # - they cannot change their own role to become admin (self-promotion to admin)
            # - they cannot promote a 'patient' to 'doctor' or 'nurse'
            if role in ('doctor', 'nurse'):
                if not data:
                    return True
                # prevent setting role to admin
                if data.get('role') == 'admin':
                    return False
                # fetch target user's current role to enforce promotion constraints
                try:
                    target = controller.get_by_id('auth_users', item_id)
                    target_role = target.get('role') if target else None
                except Exception:
                    target_role = None

                # prevent promoting a patient to doctor/nurse
                if target_role == 'patient' and data.get('role') in ('doctor', 'nurse'):
                    return False

                # prevent self-promotion to admin (if user attempts to set their own role to admin)
                if uid == item_id and data.get('role') == 'admin':
                    return False

                # otherwise allow editing non-role fields or role changes that are permitted
                return True
            return False
        # create and other actions remain admin-only
        return False

    if table == 'user_profiles':
        if action == 'create':
            # allow user to create their own profile
            return data.get('auth_id') == uid
        # update/delete: allow owner
        profile = controller.get_by_id('user_profiles', item_id)
        return bool(profile and profile.get('auth_id') == uid)

    if table == 'appointments':
        if action == 'create':
            # allow patient to create their own appointment or staff to create
            return data.get('patient_id') == uid or data.get('staff_id') == uid or role in ('doctor', 'nurse')
        # update/delete: staff or admin only
        return role in ('doctor', 'nurse')

    if table == 'medical_records':
        # doctors and nurses can create/update/delete medical records
        if action in ('create', 'update', 'delete'):
            return role in ('doctor', 'nurse')
        return False

    # default: deny for non-admins
    return False
