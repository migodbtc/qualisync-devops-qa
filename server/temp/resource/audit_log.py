from flask import Blueprint, jsonify, request, g, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.controller import controller
from utils import _log
import middleware.auth as auth, traceback

TABLE = 'audit_log'

bp = Blueprint(TABLE, __name__, url_prefix='/api/audit_log')


@bp.route('', methods=['GET'])
@jwt_required()
def list_audit_log():
    _log(f"ENTER list: table={TABLE} {request.method} {request.path}")
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', current_app.config.get('DEFAULT_PER_PAGE', 20)))
    except Exception:
        _log("ERROR list: invalid pagination params")
        return jsonify({'error': 'invalid pagination parameters'}), 400

    # Strict validation: enforce positive page and per_page and a sensible maximum
    MAX_PER_PAGE = int(current_app.config.get('MAX_PER_PAGE', 100))
    if page < 1 or per_page < 1 or per_page > MAX_PER_PAGE:
        _log(f"ERROR list: page={page} per_page={per_page} out of range (max={MAX_PER_PAGE})")
        return jsonify({'error': 'pagination parameters out of range'}), 400
    try:
        # only privileged users should read audit; check authorization
        identity = get_jwt_identity()
        try:
            auth_id = int(identity)
        except Exception:
            _log(f"ERROR list: invalid identity in token: {identity}")
            return jsonify({'error': 'invalid identity in token'}), 401
        g.current_user = controller.get_by_id('auth_users', auth_id)

        allowed = auth.authorize_table_action(TABLE, 'read', None, None, g.current_user)
        if not allowed:
            try:
                min_role = auth.minimum_role_for_table_action(TABLE, 'read', None, None, g.current_user)
            except Exception:
                min_role = 'unknown'
            cur_role = g.current_user.get('role') if g.current_user else 'UNKNOWN'
            _log(f"FORBIDDEN list: table={TABLE} user_role={cur_role} required={min_role}")
            return jsonify({'error': 'forbidden'}), 403

        result = controller.list(TABLE, page=page, per_page=per_page)
        _log(f"OK list: table={TABLE} page={page} per_page={per_page} returned {len(result.get('items', []))} items")
        return jsonify(result)
    except Exception as e:
        _log(f"EXCEPTION list: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@bp.route('/<int:item_id>', methods=['GET'])
@jwt_required()
def get_audit_entry(item_id: int):
    _log(f"ENTER get: table={TABLE} id={item_id}")
    if item_id <= 0:
        _log(f"ERROR get: invalid id {item_id}")
        return jsonify({'error': 'invalid id'}), 400
    try:
        identity = get_jwt_identity()
        try:
            auth_id = int(identity)
        except Exception:
            _log(f"ERROR get: invalid identity in token: {identity}")
            return jsonify({'error': 'invalid identity in token'}), 401
        g.current_user = controller.get_by_id('auth_users', auth_id)

        allowed = auth.authorize_table_action(TABLE, 'read', None, item_id, g.current_user)
        if not allowed:
            try:
                min_role = auth.minimum_role_for_table_action(TABLE, 'read', None, item_id, g.current_user)
            except Exception:
                min_role = 'unknown'
            cur_role = g.current_user.get('role') if g.current_user else 'UNKNOWN'
            _log(f"FORBIDDEN get: table={TABLE} id={item_id} user_role={cur_role} required={min_role}")
            return jsonify({'error': 'forbidden'}), 403

        row = controller.get_by_id(TABLE, item_id)
        if not row:
            _log(f"NOTFOUND get: table={TABLE} id={item_id}")
            return jsonify({'error': 'Not found'}), 404
        _log(f"OK get: table={TABLE} id={item_id}")
        return jsonify(row)
    except Exception as e:
        _log(f"EXCEPTION get: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
