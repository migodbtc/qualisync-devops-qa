import LoginPage from "@/app/(auth)/login/page";
import RegisterPage from "@/app/(auth)/register/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
// WC-01: Login Page Interaction
describe("Login Page", () => {
  it("renders the login form and displays all required input fields and submit button for user authentication", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("login-email")).toBeInTheDocument();
    expect(screen.getByTestId("login-password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });

  it("stores access token in localStorage on successful login", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "mock-access-token" }),
    }) as unknown as typeof fetch;

    render(<LoginPage />);
    fireEvent.change(screen.getByTestId("login-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "correctpassword" },
    });
    fireEvent.submit(screen.getByTestId("login-form"));

    await waitFor(() => {
      expect(localStorage.getItem("access_token")).toBe("mock-access-token");
    });
  });

  it("displays an error message returned by the API when submitting empty credentials", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Email and password are required" }),
    }) as unknown as typeof fetch;

    render(<LoginPage />);
    fireEvent.submit(screen.getByTestId("login-form"));

    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Email and password are required",
      );
    });
  });

  it("displays an error message when login is attempted with invalid credentials", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    }) as unknown as typeof fetch;

    render(<LoginPage />);
    fireEvent.change(screen.getByTestId("login-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.submit(screen.getByTestId("login-form"));

    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Invalid credentials",
      );
    });
  });

  it("register link navigates to the register page", () => {
    render(<LoginPage />);
    const link = screen.getByTestId("login-register-link");
    expect(link).toHaveAttribute("href", "/register");
  });
});

// WC-02: Register Page Interaction
describe("Register Page", () => {
  it("renders the registration form and displays all required input fields, checkboxes, and submit button for new user sign-up", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("register-email")).toBeInTheDocument();
    expect(screen.getByTestId("register-password")).toBeInTheDocument();
    expect(screen.getByTestId("register-confirm-password")).toBeInTheDocument();
    expect(screen.getByTestId("register-tnc")).toBeInTheDocument();
    expect(screen.getByTestId("register-privacy")).toBeInTheDocument();
    expect(screen.getByTestId("register-submit")).toBeInTheDocument();
  });

  it("stores access token in localStorage after successful registration and auto-login", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "mock-access-token" }),
      }) as unknown as typeof fetch;

    render(<RegisterPage />);
    fireEvent.change(screen.getByTestId("register-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("register-confirm-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("register-tnc"));
    fireEvent.click(screen.getByTestId("register-privacy"));
    fireEvent.submit(screen.getByTestId("register-form"));

    await waitFor(() => {
      expect(localStorage.getItem("access_token")).toBe("mock-access-token");
    });
  });

  it("displays an error message returned by the API when required fields are missing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "All fields are required" }),
    }) as unknown as typeof fetch;

    render(<RegisterPage />);
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("register-confirm-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("register-tnc"));
    fireEvent.click(screen.getByTestId("register-privacy"));
    fireEvent.submit(screen.getByTestId("register-form"));

    await waitFor(() => {
      expect(screen.getByTestId("register-error")).toHaveTextContent(
        "All fields are required",
      );
    });
  });

  it("displays an error message when form is submitted without agreeing to compliance checkboxes", async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("register-confirm-password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByTestId("register-form"));

    await waitFor(() => {
      expect(screen.getByTestId("register-error")).toHaveTextContent(
        "You must agree to all compliance checkboxes.",
      );
    });
  });

  it("displays an error message when submitted passwords do not match", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("register-confirm-password"), {
      target: { value: "differentpassword" },
    });

    // bypass native HTML required validation and fire handleSubmit directly
    fireEvent.submit(screen.getByTestId("register-form"));

    await waitFor(() => {
      expect(screen.getByTestId("register-error")).toHaveTextContent(
        "Passwords do not match",
      );
    });
  });

  it("login link navigates to the login page", () => {
    render(<RegisterPage />);
    const link = screen.getByTestId("register-login-link");
    expect(link).toHaveAttribute("href", "/login");
  });
});
