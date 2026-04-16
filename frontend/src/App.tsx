import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CartBadge from "./components/CartBadge/CartBadge";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import { useAuthContext } from "./contexts/AuthContext";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function AppLayout() {
  const { isAuthenticated, user, logout } = useAuthContext();

  return (
    <div>
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #ddd",
          marginBottom: "24px",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Buckeye Marketplace
          </Link>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Products
            </Link>

            <CartBadge />

            {isAuthenticated && (
              <Link to="/orders" style={{ textDecoration: "none", color: "inherit" }}>
                My Orders
              </Link>
            )}

            {user?.role === "Admin" && (
              <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                Admin
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                  Login
                </Link>
                <Link to="/register" style={{ textDecoration: "none", color: "inherit" }}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <span>{user?.email}</span>
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}