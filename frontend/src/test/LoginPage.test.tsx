import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { vi } from "vitest";

const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuthContext: () => ({
    login: mockLogin,
    loading: false,
    error: "",
    clearError: mockClearError,
  }),
}));

describe("LoginPage", () => {
  it("renders login form fields and button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("calls login when form is submitted", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(false);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "Password1");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockClearError).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith("user@test.com", "Password1");
  });
});