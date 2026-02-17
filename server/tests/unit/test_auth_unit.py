import pytest
from server.main import login, register, hash_password, verify_password, generate_token, validate_token, validate_input, handle_auth_error, auth_state_transition

# SU-01: Login Logic Function
def test_login_logic_function_valid_invalid():
    # Valid credentials
    token = login('user@example.com', 'correctpassword')
    assert token is not None
    # Invalid credentials
    with pytest.raises(Exception):
        login('user@example.com', 'wrongpassword')

# SU-02: Register Logic Function
def test_register_logic_function_valid_invalid():
    # Valid input
    user = register('newuser@example.com', 'validpassword')
    assert user is not None
    # Invalid input
    with pytest.raises(Exception):
        register('bademail', 'short')

# SU-03: Password Hash Function
def test_password_hash_function():
    pw = 'securepassword'
    hashed = hash_password(pw)
    assert verify_password(pw, hashed)
    assert not verify_password('wrong', hashed)

# SU-04: Token Generation Function
def test_token_generation_function():
    token = generate_token('user_id')
    assert isinstance(token, str)
    assert len(token) > 0

# SU-05: Token Validation Function
def test_token_validation_function():
    token = generate_token('user_id')
    assert validate_token(token)
    assert not validate_token('invalidtoken')

# SU-06: Input Validation Function
def test_input_validation_function():
    assert validate_input('user@example.com', 'password')
    assert not validate_input('bademail', 'short')

# SU-07: Error Handling Function
def test_error_handling_function():
    error = handle_auth_error('Invalid credentials')
    assert 'error' in error
    assert error['error'] == 'Invalid credentials'

# SU-08: Auth State Transition Function
def test_auth_state_transition_function():
    state = auth_state_transition('login', None)
    assert state == 'authenticated'
    state = auth_state_transition('logout', 'authenticated')
    assert state == 'unauthenticated'
