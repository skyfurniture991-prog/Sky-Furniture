import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { AdminProvider } from "./contexts/AdminContext";
import SmoothScroll from "./components/layout/SmoothScroll";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { DEFAULT_PRODUCT } from "./data/products";
import Icon from "./components/ui/Icon";

// Halaman selain beranda dimuat saat dibutuhkan agar bundel awal lebih ringan.
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));

// Panel Admin (CMS & Pemesanan)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminTaxonomyPage = lazy(() => import("./pages/admin/AdminTaxonomyPage"));
const AdminContentPage = lazy(() => import("./pages/admin/AdminContentPage"));
const AdminReviewsPage = lazy(() => import("./pages/admin/AdminReviewsPage"));
const AdminPromosPage = lazy(() => import("./pages/admin/AdminPromosPage"));

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
      <Icon name="progress_activity" className="animate-spin text-4xl text-primary" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <UIProvider>
              <WishlistProvider>
                <CartProvider>
                  <OrdersProvider>
                    <AdminProvider>
                      <SmoothScroll>
                        <Routes>
                        {/* Toko / Storefront */}
                        <Route element={<Layout />}>
                          <Route index element={<HomePage />} />
                          <Route path="katalog" element={<CatalogPage />} />
                          <Route path="produk/:slug" element={<ProductDetailPage />} />
                          <Route
                            path="detail-produk"
                            element={<Navigate to={`/produk/${DEFAULT_PRODUCT.slug}`} replace />}
                          />
                          <Route path="wishlist" element={<WishlistPage />} />
                          <Route path="keranjang" element={<CartPage />} />
                          <Route path="checkout" element={<CheckoutPage />} />
                          <Route path="pesanan" element={<OrdersPage />} />
                          <Route path="pesanan/:orderId" element={<OrderDetailPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>

                        {/* Laporan Proyek */}
                        <Route
                          path="laporan"
                          element={
                            <Suspense fallback={null}>
                              <ReportPage />
                            </Suspense>
                          }
                        />

                        {/* Admin Panel (CMS & Pemesanan) */}
                        <Route
                          path="admin/login"
                          element={
                            <Suspense fallback={<AdminLoading />}>
                              <AdminLoginPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="admin"
                          element={
                            <Suspense fallback={<AdminLoading />}>
                              <AdminLayout />
                            </Suspense>
                          }
                        >
                          <Route index element={<AdminDashboard />} />
                          <Route path="pesanan" element={<AdminOrdersPage />} />
                          <Route path="produk" element={<AdminProductsPage />} />
                          <Route path="kategori" element={<AdminTaxonomyPage />} />
                          <Route path="konten" element={<AdminContentPage />} />
                          <Route path="ulasan" element={<AdminReviewsPage />} />
                          <Route path="promo" element={<AdminPromosPage />} />
                          <Route path="database" element={<Navigate to="/admin" replace />} />
                        </Route>
                      </Routes>
                    </SmoothScroll>
                  </AdminProvider>
                </OrdersProvider>
              </CartProvider>
            </WishlistProvider>
          </UIProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);
}
