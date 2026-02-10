from flask import Blueprint, jsonify, request, g, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.controller import controller
from services.audit import log_audit
import middleware.auth as auth, time, traceback

TABLE = 'user_profiles'

bp = Blueprint(TABLE, __name__, url_prefix='/api/user_profiles')

def _log(msg: str):
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}")

@bp.route('', methods=['POST'])
@jwt_required()
def create_user_profile():
    data = request.get_json(silent=True) or {}
    _log(f"ENTER create: table={TABLE} method={request.method} path={request.path}")
    if not isinstance(data, dict):
        _log("ERROR create: invalid JSON payload")
        return jsonify({'error': 'invalid JSON payload'}), 400
    try:
        identity = get_jwt_identity()
        try:
            auth_id = int(identity)
        except Exception:
            _log(f"ERROR create: invalid identity in token: {identity}")
            return jsonify({'error': 'invalid identity in token'}), 401
        g.current_user = controller.get_by_id('auth_users', auth_id)

        allowed = auth.authorize_table_action(TABLE, 'create', data, None, g.current_user)
        if not allowed:
            try:
                min_role = auth.minimum_role_for_table_action(TABLE, 'create', data, None, g.current_user)
            except Exception:
                min_role = 'unknown'
            cur_role = g.current_user.get('role') if g.current_user else 'UNKNOWN'
            _log(f"FORBIDDEN create: table={TABLE} user_role={cur_role} required={min_role}")
            return jsonify({'error': 'forbidden'}), 403

        new_id = controller.create(TABLE, data)
        try:
            new_row = controller.get_by_id(TABLE, new_id)
            actor = g.current_user.get('auth_id') if g.current_user else None
            log_audit(actor, TABLE, new_id, 'INSERT', None, new_row or data)
        except Exception:
            pass

        _log(f"OK create: table={TABLE} id={new_id} status=201")
        return jsonify({'id': new_id}), 201
    except Exception as e:
        _log(f"EXCEPTION create: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@bp.route('', methods=['GET'])
def list_user_profiles():
    _log(f"ENTER list: table={TABLE} {request.method} {request.path}")
    try:
        page = int(request.args.get('page', 1))
        per_page = int(current_app.config.get('DEFAULT_PER_PAGE', 20))
    except Exception:
        _log("ERROR list: invalid pagination params")
        return jsonify({'error': 'invalid pagination parameters'}), 400
    if page < 1 or per_page < 1:
        _log(f"ERROR list: page={page} per_page={per_page} out of range")
        return jsonify({'error': 'pagination parameters out of range'}), 400
    try:
        result = controller.list(TABLE, page=page, per_page=per_page)
        _log(f"OK list: table={TABLE} page={page} per_page={per_page} returned {len(result.get('items', []))} items")
        return jsonify(result)
    except Exception as e:
        _log(f"EXCEPTION list: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@bp.route('/<int:item_id>', methods=['GET'])
def get_user_profile(item_id: int):
    _log(f"ENTER get: table={TABLE} id={item_id}")
    if item_id <= 0:
        _log(f"ERROR get: invalid id {item_id}")
        return jsonify({'error': 'invalid id'}), 400
    try:
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


@bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(item_id: int):
    data = request.get_json() or {}
    _log(f"ENTER update: table={TABLE} id={item_id} payload_keys={list(data.keys())}")
    if item_id <= 0:
        _log(f"ERROR update: invalid id {item_id}")
        return jsonify({'error': 'invalid id'}), 400
    try:
        identity = get_jwt_identity()
        try:
            auth_id = int(identity)
        except Exception:
            _log(f"ERROR update: invalid identity in token: {identity}")
            return jsonify({'error': 'invalid identity in token'}), 401
        g.current_user = controller.get_by_id('auth_users', auth_id)

        allowed = auth.authorize_table_action(TABLE, 'update', data, item_id, g.current_user)
        if not allowed:
            try:
                min_role = auth.minimum_role_for_table_action(TABLE, 'update', data, item_id, g.current_user)
            except Exception:
                min_role = 'unknown'
            cur_role = g.current_user.get('role') if g.current_user else 'UNKNOWN'
            _log(f"FORBIDDEN update: table={TABLE} id={item_id} user_role={cur_role} required={min_role}")
            return jsonify({'error': 'forbidden'}), 403

        pk = controller._get_primary_key(TABLE)
        if not pk:
            _log(f"ERROR update: primary key not found for table {TABLE}")
            return jsonify({'error': 'Primary key not found for table'}), 400
        old_row = controller.get_by_id(TABLE, item_id)
        data[pk] = item_id
        affected = controller.update(TABLE, data)
        try:
            new_row = controller.get_by_id(TABLE, item_id)
            actor = g.current_user.get('auth_id') if g.current_user else None
            log_audit(actor, TABLE, item_id, 'UPDATE', old_row, new_row)
        except Exception:
            pass

        _log(f"OK update: table={TABLE} id={item_id} affected={affected}")
        return jsonify({'affected': affected})
    except Exception as e:
        _log(f"EXCEPTION update: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_user_profile(item_id: int):
    _log(f"ENTER delete: table={TABLE} id={item_id}")
    if item_id <= 0:
        _log(f"ERROR delete: invalid id {item_id}")
        return jsonify({'error': 'invalid id'}), 400
    try:
        identity = get_jwt_identity()
        try:
            auth_id = int(identity)
        except Exception:
            _log(f"ERROR delete: invalid identity in token: {identity}")
            return jsonify({'error': 'invalid identity in token'}), 401
        g.current_user = controller.get_by_id('auth_users', auth_id)

        allowed = auth.authorize_table_action(TABLE, 'delete', None, item_id, g.current_user)
        if not allowed:
            try:
                min_role = auth.minimum_role_for_table_action(TABLE, 'delete', None, item_id, g.current_user)
            except Exception:
                min_role = 'unknown'
            cur_role = g.current_user.get('role') if g.current_user else 'UNKNOWN'
            _log(f"FORBIDDEN delete: table={TABLE} id={item_id} user_role={cur_role} required={min_role}")
            return jsonify({'error': 'forbidden'}), 403

        old_row = controller.get_by_id(TABLE, item_id)
        affected = controller.delete(TABLE, item_id)
        try:
            actor = g.current_user.get('auth_id') if g.current_user else None
            log_audit(actor, TABLE, item_id, 'DELETE', old_row, None)
        except Exception:
            pass

        _log(f"OK delete: table={TABLE} id={item_id} affected={affected}")
        return jsonify({'affected': affected})
    except Exception as e:
        _log(f"EXCEPTION delete: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
