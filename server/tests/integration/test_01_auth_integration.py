import pytest
from server.db.models import AuthUser
from server.main import app
from db.database import db


# --- PyTest Fixtures ---
@pytest.fixture
def client():
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def reset_db():
    yield
    try:
        db.rollback()
    except Exception:
        pass
    try:
        db.close()
    except Exception:
        pass


# --- Test Helpers ---
def get_next_user_number():
    # Query the current number of users in the database
    return db.query(AuthUser).count() + 1


def register_user(client, role="tenant", password="securepass"):
    count = get_next_user_number()
    email = f"{count}user@example.com"
    username = f"user{count}"
    payload = {"email": email, "password": password, "username": username, "role": role}
    print("User " + email + " created!!")
    return client.post("/auth/register", json=payload), email, username, password


def login_user(client, email, password):
    payload = {"email": email, "password": password}
    return client.post("/auth/login", json=payload)


# --- Test Endpoints ---
def test_index_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json == {"message": "API running"}


def test_register_endpoint(client):
    # --- Success: valid registration ---
    response, email, username, password = register_user(client)
    print("Register response:", response.status_code, response.json)
    assert response.status_code == 201
    assert "id" in response.json

    # --- Failure: duplicate email ---
    response_dup = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password,
            "username": username,
            "role": "tenant",
        },
    )
    print("Duplicate email:", response_dup.status_code, response_dup.json)
    assert response_dup.status_code == 400
    assert "error" in response_dup.json

    # --- Failure: missing email ---
    response_no_email = client.post(
        "/auth/register", json={"password": "pw", "username": "u", "role": "tenant"}
    )
    print("Missing email:", response_no_email.status_code, response_no_email.json)
    assert response_no_email.status_code == 400
    assert "error" in response_no_email.json

    # --- Failure: missing password ---
    response_no_pw = client.post(
        "/auth/register",
        json={"email": "reg2@example.com", "username": "u", "role": "tenant"},
    )
    print("Missing password:", response_no_pw.status_code, response_no_pw.json)
    assert response_no_pw.status_code == 400
    assert "error" in response_no_pw.json

    # --- Failure: invalid role ---
    response_bad_role = client.post(
        "/auth/register",
        json={
            "email": "reg3@example.com",
            "password": "pw",
            "username": "u",
            "role": "badrole",
        },
    )
    print("Invalid role:", response_bad_role.status_code, response_bad_role.json)
    assert response_bad_role.status_code == 400
    assert "error" in response_bad_role.json


def test_login_endpoint(client):
    _, email, username, password = register_user(client, password="pw123")
    # --- Success: correct credentials ---
    response = login_user(client, email, "pw123")
    assert response.status_code == 200
    assert "access_token" in response.json
    assert response.json["token_type"] == "bearer"

    # --- Failure: wrong password ---
    response_wrong_pw = login_user(client, email, "wrongpw")
    print("Wrong password:", response_wrong_pw.status_code, response_wrong_pw.json)
    assert response_wrong_pw.status_code == 401
    assert "error" in response_wrong_pw.json

    # --- Failure: non-existent user ---
    response_no_user = login_user(client, "nouser@example.com", "pw123")
    print("Non-existent user:", response_no_user.status_code, response_no_user.json)
    assert response_no_user.status_code == 401
    assert "error" in response_no_user.json

    # --- Failure: missing email ---
    response_no_email = client.post("/auth/login", json={"password": "pw123"})
    print("Missing email:", response_no_email.status_code, response_no_email.json)
    assert response_no_email.status_code == 400
    assert "error" in response_no_email.json

    # --- Failure: missing password ---
    response_no_pw = client.post("/auth/login", json={"email": email})
    print("Missing password:", response_no_pw.status_code, response_no_pw.json)
    assert response_no_pw.status_code == 400
    assert "error" in response_no_pw.json


def test_refresh_endpoint(client):
    _, email, username, password = register_user(client, password="pw123")
    login_resp = login_user(client, email, "pw123")
    assert login_resp.status_code == 200
    # Test client stores the refresh cookie from login automatically
    response = client.post("/auth/refresh")
    print("test_refresh_endpoint Response:", response.get_json())
    assert response.status_code == 200
    assert "access_token" in response.json

    # --- Failure: no refresh token ---
    client.delete_cookie("refresh_token_cookie")
    response_no_cookie = client.post("/auth/refresh")
    print(
        "No refresh token:",
        response_no_cookie.status_code,
        response_no_cookie.get_json(),
    )
    assert response_no_cookie.status_code in (401, 422)


def test_logout_endpoint(client):
    # Arrange: register and login — test client stores the refresh cookie automatically
    _, email, username, password = register_user(client, password="pw123")
    login_resp = login_user(client, email, "pw123")
    assert login_resp.status_code == 200
    response = client.post("/auth/logout")
    print("Logout response:", response.get_json())
    assert response.status_code == 200
    assert "revoked" in response.json and response.json["revoked"] is True

    # --- Failure: no refresh token ---
    client.delete_cookie("refresh_token_cookie")
    response_no_cookie = client.post("/auth/logout")
    print(
        "No refresh token (logout):",
        response_no_cookie.status_code,
        response_no_cookie.get_json(),
    )
    assert response_no_cookie.status_code in (400, 401, 422)


def test_session_endpoint(client):
    # Arrange: register and login — test client stores the refresh cookie automatically
    _, email, username, password = register_user(client, password="pw123")
    login_resp = login_user(client, email, "pw123")
    assert login_resp.status_code == 200
    response = client.get("/auth/session")
    print("Session response:", response.get_json())
    assert response.status_code == 200
    assert response.json["authenticated"] is True
    assert "user" in response.json
    assert response.json["user"]["email"] == email

    # --- Failure: no refresh token ---
    client.delete_cookie("refresh_token_cookie")
    response_no_cookie = client.get("/auth/session")
    print(
        "No refresh token (session):",
        response_no_cookie.status_code,
        response_no_cookie.get_json(),
    )
    assert response_no_cookie.status_code in (401, 422)
