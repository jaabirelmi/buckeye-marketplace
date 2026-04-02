import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CartBadge from "./components/CartBadge/CartBadge";

export default function App() {
  return (
    <BrowserRouter>
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
            </div>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}