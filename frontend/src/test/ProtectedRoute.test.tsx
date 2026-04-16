import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { vi } from "vitest";

const mockUseAuthContext = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <div>Secret Cart Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <div>Secret Cart Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Secret Cart Page")).toBeInTheDocument();
  });
});