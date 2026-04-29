import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Header from './components/header'
import { ProductDetail } from './components/productDetail'
import { NotFound } from './components/NotFound'
import { CheckoutPage } from './components/CheckoutPage'
import IntranetLayout from './components/IntranetLayout'
import IntranetHome from './components/IntranetHome'
import ClockInPage from './components/ClockInPage'
import AdminUsers from './components/AdminUsers'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/intranet" element={<IntranetLayout />}>
        <Route index element={<IntranetHome />} />
        <Route path="fichajes" element={<ClockInPage />} />
      </Route>
      <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
  </BrowserRouter>
)