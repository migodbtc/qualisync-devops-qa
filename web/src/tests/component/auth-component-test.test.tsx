import LoginPage from '@/app/(auth)/login/page';
import RegisterPage from '@/app/(auth)/register/page';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest'
// WC-01: Login Page Interaction
describe('Login Page', () => {
  it('renders the login form and displays all required input fields and submit button for user authentication', () => {
    render(<LoginPage />);
    // Check for unique email and password fields
    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
  });
});

// WC-02: Register Page Interaction
describe('Register Page', () => {
  it('renders the registration form and displays all required input fields, checkboxes, and submit button for new user sign-up', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-email')).toBeInTheDocument();
    expect(screen.getByTestId('register-password')).toBeInTheDocument();
    expect(screen.getByTestId('register-confirm-password')).toBeInTheDocument();
    expect(screen.getByTestId('register-tnc')).toBeInTheDocument();
    expect(screen.getByTestId('register-privacy')).toBeInTheDocument();
    expect(screen.getByTestId('register-submit')).toBeInTheDocument();
  });
});


