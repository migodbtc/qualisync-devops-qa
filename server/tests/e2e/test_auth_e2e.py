import requests
import pytest

BASE_URL = 'http://localhost:5000'

def register_user(email, password):
    return requests.post(f'{BASE_URL}/auth/register', json={'email': email, 'password': password})

def login_user(email, password):
    return requests.post(f'{BASE_URL}/auth/login', json={'email': email, 'password': password})

def get_token(email, password):
    resp = login_user(email, password)
    return resp.json().get('token') if resp.status_code == 200 else None

# SE-01: Register → Login → Dashboard
def test_register_login_dashboard():
    reg = register_user('e2euser@example.com', 'validpassword')
    assert reg.status_code == 201
    token = get_token('e2euser@example.com', 'validpassword')
    assert token
    resp = requests.get(f'{BASE_URL}/dashboard', headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200

# SE-02: Login → Protected Route
def test_login_protected_route():
    token = get_token('user@example.com', 'correctpassword')
    assert token
    resp = requests.get(f'{BASE_URL}/protected', headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200

# SE-03: Invalid Login Attempt
def test_invalid_login_attempt():
    resp = login_user('user@example.com', 'wrong')
    assert resp.status_code == 401

# SE-04: Token Expiry Flow
def test_token_expiry_flow():
    expired_token = 'expiredtoken'  # Replace with actual expired token
    resp = requests.get(f'{BASE_URL}/dashboard', headers={'Authorization': f'Bearer {expired_token}'})
    assert resp.status_code == 401

# SE-05: Logout Flow
def test_logout_flow():
    token = get_token('user@example.com', 'correctpassword')
    assert token
    resp = requests.post(f'{BASE_URL}/auth/logout', headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200
    # Try to access protected route after logout
    resp2 = requests.get(f'{BASE_URL}/dashboard', headers={'Authorization': f'Bearer {token}'})
    assert resp2.status_code == 401

# SE-06: Password Reset Flow
def test_password_reset_flow():
    resp = requests.post(f'{BASE_URL}/auth/reset-password', json={'email': 'user@example.com'})
    assert resp.status_code in (200, 404)
    # Simulate reset completion if possible

# SE-07: Register Duplicate Email
def test_register_duplicate_email():
    register_user('dupe@example.com', 'validpassword')
    resp = register_user('dupe@example.com', 'validpassword')
    assert resp.status_code == 400

# SE-08: Auth Error Handling
def test_auth_error_handling():
    resp = login_user('user@example.com', 'wrong')
    assert resp.status_code == 401
    assert 'error' in resp.json()
