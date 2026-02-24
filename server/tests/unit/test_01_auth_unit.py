import pytest
from unittest.mock import Mock, patch
from db.models import AuthUser, RefreshToken, Session
from resource.auth import (
    hash_password,
    verify_password,
    revoke_jti,
    find_by_jti,
    create_session,
    revoke_session,
    unpack_register_payload,
    unpack_login_payload,
    validate_register,
    validate_login,
    generate_tokens_and_claims,
)

# === Mock Layer ===
mock_user_payload = {
    "email": "test@example.com",
    "password": "securepass",
    "username": "testuser",
    "role": "tenant",
}
mock_login_payload = {"email": "test@example.com", "password": "securepass"}

mock_user = AuthUser(
    id=999,
    email="migueljustin.bunda@gmail.com",
    username="migueljustin",
    role_id=1,
    password_hash="hashedpassword",
)

mock_role_admin = Mock()
mock_role_admin.id = 1
mock_role_admin.name = "admin"

mock_role_tenant = Mock()
mock_role_tenant.id = 2
mock_role_tenant.name = "tenant"

mock_refresh_token = RefreshToken(
    user_id=1, token="mockjti", expires_at="2026-02-23 12:00:00"
)

mock_session = Session(
    user_id=1,
    session_id="mockjti",
    user_agent="Mozilla/5.0",
    ip_address="127.0.0.1",
    expires_at="2026-02-24 12:00:00",
)

mock_db = Mock()
mock_db.add = Mock()
mock_db.commit = Mock()
mock_db.query = Mock()

mock_query = Mock()
mock_query.filter_by.return_value.first.return_value = mock_refresh_token
mock_db.query.return_value = mock_query


# === Test Layer ===
def test_hash_password():
    # Arrange
    password = "averysecurepasswordngl6767"
    # Act
    hashed = hash_password(password)
    # Assert
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
    assert hashed != password


def test_verify_password():
    # Arrange
    password = "averysecurepasswordngl6767"
    wrong_password = "wrongpassword"
    hashed = hash_password(password)
    # Act & Assert
    assert verify_password(hashed, password)
    assert not verify_password(hashed, wrong_password)


@patch("resource.auth.db", mock_db)
def test_revoke_jti():
    # Arrange
    jti = "mockjti"
    token = mock_refresh_token
    token.revoked = 0
    mock_query.filter_by.return_value.first.return_value = token
    # Act & Assert: happy path
    result = revoke_jti(jti)
    assert result is True
    assert token.revoked == 1
    # Negative: token not found
    mock_query.filter_by.return_value.first.return_value = None
    result = revoke_jti(jti)
    assert not result


@patch("resource.auth.db", mock_db)
def test_find_by_jti():
    # Arrange
    jti = "mockjti"
    mock_query.filter_by.return_value.first.return_value = mock_refresh_token
    # Act & Assert: happy path
    token = find_by_jti(jti)
    assert token == mock_refresh_token
    # Negative: not found
    mock_query.filter_by.return_value.first.return_value = None
    token = find_by_jti(jti)
    assert token is None


@patch("resource.auth.db", mock_db)
def test_create_session():
    # Arrange
    user_id = 1
    session_id = "mockjti"
    user_agent = "Mozilla/5.0"
    ip_address = "127.0.0.1"
    expires_at = "2026-02-24 12:00:00"
    mock_db.add.reset_mock()
    mock_db.commit.reset_mock()
    # Act
    session = create_session(user_id, session_id, user_agent, ip_address, expires_at)
    # Assert
    assert isinstance(session, Session)
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    assert session.session_id == session_id
    # Negative: missing params
    with pytest.raises(ValueError):
        create_session(None, session_id, user_agent, ip_address, expires_at)


@patch("resource.auth.db", mock_db)
def test_revoke_session():
    # Arrange
    session_id = "mockjti"
    token = mock_session
    token.revoked = 0
    mock_query.filter_by.return_value.first.return_value = token
    # Act & Assert: happy path
    result = revoke_session(session_id)
    assert result is True
    assert token.revoked == 1
    mock_db.commit.assert_called()
    # Negative: session not found
    mock_query.filter_by.return_value.first.return_value = None
    result = revoke_session(session_id)
    assert result is False


def test_unpack_register_payload():
    # Arrange & happy path
    email, password, username, role = unpack_register_payload(mock_user_payload)
    assert email == mock_user_payload["email"]
    assert password == mock_user_payload["password"]
    assert username == mock_user_payload["username"]
    assert role == mock_user_payload["role"]
    assert all([email, password, username, role])
    # Username defaults to email if missing
    payload = {"email": "a@b.com", "password": "pw", "role": "tenant"}
    email, password, username, role = unpack_register_payload(payload)
    assert username == payload["email"]
    # Role defaults to tenant if missing
    payload = {"email": "a@b.com", "password": "pw", "username": "user"}
    email, password, username, role = unpack_register_payload(payload)
    assert role == "tenant"
    # Negative: Email missing
    payload = {"password": "pw", "username": "user", "role": "tenant"}
    with pytest.raises(ValueError, match="Email missing from payload"):
        unpack_register_payload(payload)
    # Negative: Password missing
    payload = {"email": "a@b.com", "username": "user", "role": "tenant"}
    with pytest.raises(ValueError, match="Password missing from payload"):
        unpack_register_payload(payload)
    # Negative: Tuple with None values
    payload = {"email": None, "password": None, "username": None, "role": None}
    with pytest.raises(ValueError):
        unpack_register_payload(payload)


def test_unpack_login_payload():
    # Arrange & happy path
    email, password = unpack_login_payload(mock_login_payload)
    assert email == mock_login_payload["email"]
    assert password == mock_login_payload["password"]
    assert all([email, password])
    # Negative: Email missing
    payload = {"password": "pw"}
    with pytest.raises(ValueError, match="Email missing from payload"):
        unpack_login_payload(payload)
    # Negative: Password missing
    payload = {"email": "a@b.com"}
    with pytest.raises(ValueError, match="Password missing from payload"):
        unpack_login_payload(payload)
    # Negative: Tuple with None values
    payload = {"email": None, "password": None}
    with pytest.raises(ValueError):
        unpack_login_payload(payload)


def test_validate_register():
    # Arrange & happy path
    errors = validate_register(
        mock_user_payload["email"],
        mock_user_payload["password"],
        mock_user_payload["role"],
    )
    assert errors == []
    # Role valid
    for role in ["tenant", "admin", "staff"]:
        errors = validate_register(
            mock_user_payload["email"], mock_user_payload["password"], role
        )
        assert errors == []
    # Negative: Email missing
    with pytest.raises(ValueError, match="email and password are required"):
        validate_register(None, "pw", "tenant")
    # Negative: Password missing
    with pytest.raises(ValueError, match="email and password are required"):
        validate_register("a@b.com", None, "tenant")
    # Negative: Role not valid
    with pytest.raises(ValueError, match="invalid role"):
        validate_register("a@b.com", "pw", "invalidrole")
    # Negative: All missing
    with pytest.raises(ValueError):
        validate_register(None, None, "invalidrole")


def test_validate_login():
    # Arrange & happy path
    errors = validate_login(mock_login_payload["email"], mock_login_payload["password"])
    assert errors == []
    # Negative: Email missing
    with pytest.raises(ValueError, match="email and password are required"):
        validate_login(None, "pw")
    # Negative: Password missing
    with pytest.raises(ValueError, match="email and password are required"):
        validate_login("a@b.com", None)
    # Negative: All missing
    with pytest.raises(ValueError):
        validate_login(None, None)


def test_generate_tokens_and_claims():
    # Arrange & happy path: valid user, valid role
    with patch("resource.auth.db", mock_db):
        with patch("resource.auth.create_access_token", return_value="access"), patch(
            "resource.auth.create_refresh_token", return_value="refresh"
        ), patch(
            "resource.auth.decode_token", return_value={"jti": "jti", "exp": 9999999999}
        ):
            mock_db.query.return_value.filter_by.return_value.first.return_value = (
                mock_role_admin
            )
            result = generate_tokens_and_claims(mock_user)
            access_token, refresh_token, jti, expires_at, expires_at_str = result
            assert access_token == "access"
            assert refresh_token == "refresh"
            assert jti == "jti"
            assert isinstance(expires_at_str, str)
            assert isinstance(result, tuple) and len(result) == 5
    # Happy path: valid user, role not found
    with patch("resource.auth.db", mock_db):
        with patch("resource.auth.create_access_token", return_value="access"), patch(
            "resource.auth.create_refresh_token", return_value="refresh"
        ), patch(
            "resource.auth.decode_token", return_value={"jti": "jti", "exp": 9999999999}
        ):
            mock_db.query.return_value.filter_by.return_value.first.return_value = None
            result = generate_tokens_and_claims(mock_user)
            access_token, refresh_token, jti, expires_at, expires_at_str = result
            assert access_token == "access"
            assert refresh_token == "refresh"
            assert jti == "jti"
            assert isinstance(expires_at_str, str)
            assert isinstance(result, tuple) and len(result) == 5
    # Negative: invalid user object
    with patch("resource.auth.db", mock_db):
        with pytest.raises(ValueError, match="Invalid user object"):
            generate_tokens_and_claims(None)
    # Negative: missing values in token generation
    with patch("resource.auth.db", mock_db):
        with patch("resource.auth.create_access_token", return_value=None), patch(
            "resource.auth.create_refresh_token", return_value=None
        ), patch("resource.auth.decode_token", return_value={"jti": None, "exp": None}):
            with pytest.raises(
                ValueError, match="Token generation failed: missing values"
            ):
                generate_tokens_and_claims(mock_user)
    # Negative: exception in token generation
    with patch("resource.auth.db", mock_db):
        with patch("resource.auth.create_access_token", side_effect=Exception("fail")):
            with pytest.raises(ValueError, match="Token generation failed: fail"):
                generate_tokens_and_claims(mock_user)
