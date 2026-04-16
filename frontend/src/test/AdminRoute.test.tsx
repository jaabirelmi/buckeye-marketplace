import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "../components/auth/AdminRoute";
import { vi } from "vitest";

const mockUseAuthContext = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

describe("AdminRoute", () => {
  it("redirects non-admin users away from admin page", () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: "user@test.com", role: "User" },
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin Dashboard</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders children for admin users", () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: "admin@test.com", role: "Admin" },
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin Dashboard</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });
});