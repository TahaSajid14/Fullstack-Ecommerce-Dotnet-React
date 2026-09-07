import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Products from './Pages/Products';
import ProductsDetail from './Pages/ProductsDetail';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import AddProduct from './Pages/AddProduct';
import AdminProducts from './Pages/AdminProductsList';
import EditProduct from './Pages/EditProducts';
import AddCategory from './Pages/AddCategory';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ProtectedRoute from './Components/ProtectedRoutes';
import Cart from './Pages/Cart';
import MyOrders from './Pages/MyOrder';
import AdminOrders from './Pages/AdminOrder';

const App = () => {
  return (
    <BrowserRouter>
      
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />

      <Navbar />

      
      <main style={{ paddingTop: '72px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductsDetail />} />

            <Route
              path="/admin/products/add"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/category/add"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AddCategory />
                </ProtectedRoute>
              }
            />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </main>
    </BrowserRouter>
  );
};

export default App;
