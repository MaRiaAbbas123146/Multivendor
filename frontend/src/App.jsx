import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductDetailsPage,
  PaymentPage,
  OrderSuccessPage,
  EventsPage,
  FAQPage,
  BestSellingPage,
  ProductsPage,
  CheckoutPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage
} from './routes/Routes.jsx'
import {
  ShopDaashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopAllOrders,
  ShopAllRefunds,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopPreviewPage,
  ShopOrderDetails,
  ShopSettingsPage
} from "./routes/ShopRoutes.jsx"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import store from '../src/redux/store.jsx';
import { loadSeller, loadUser } from '../src/redux/actions/user.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { ShopHomePage } from './ShopRoutes.jsx'
import SellerProtectedRoute from './routes/SellerProtectedRoute.jsx';
import { getAllProducts } from './redux/actions/product.jsx';
import { getAllEvents } from './redux/actions/events.jsx'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'
  ;

const App = () => {

  // // // const navigate = useNavigate()
  // const [stripeApiKey, setStripeApiKey] = useState("")

  // async function getStripeKey() {
  //   const { data } = await axios.get(`${server}/payment/stripeApiKey`)
  //   setStripeApiKey(data.stripeApiKey)
  // }

  // useEffect(() => {
  //   store.dispatch(loadUser());
  //   store.dispatch(loadSeller())
  //   store.dispatch(getAllProducts())
  //   store.dispatch(getAllEvents())
  //   getStripeKey()
  // }, [])
  return (
    <>
      <BrowserRouter>

        {
          stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Routes>
                <Route path='/payment' element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Elements>
          )
        }

        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SignupPage />} />
          <Route path='/activation/:activationToken' element={<ActivationPage />} />
          <Route path='/seller/activation/:activationToken' element={<SellerActivationPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/product/:id' element={<ProductDetailsPage />} />

          <Route path='/best-selling' element={<BestSellingPage />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/checkout' element={
            <ProtectedRoute >
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/order/success' element={<OrderSuccessPage />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/user/order/:id' element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
          <Route path='/user/track/order/:id' element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          } />
          {/* shop routes */}
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          <Route path='/shop-create' element={<ShopCreatePage />} />
          <Route path='/shop-login' element={<ShopLoginPage />} />
          <Route path='/shop/:id' element={
            <SellerProtectedRoute >
              <ShopHomePage />
            </SellerProtectedRoute>}
          />
          <Route path='/settings' element={
            <SellerProtectedRoute >
              <ShopSettingsPage />
            </SellerProtectedRoute>}
          />
          <Route path='/dashboard'
            element={
              <SellerProtectedRoute >
                <ShopDaashboardPage />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-create-product'
            element={
              <SellerProtectedRoute >
                <ShopCreateProduct />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-orders'
            element={
              <SellerProtectedRoute >
                <ShopAllOrders />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-refunds'
            element={
              <SellerProtectedRoute >
                <ShopAllRefunds />
              </SellerProtectedRoute>}
          />
          <Route path='/order/:id'
            element={
              <SellerProtectedRoute >
                <ShopOrderDetails />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-products'
            element={
              <SellerProtectedRoute >
                <ShopAllProducts />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-create-event'
            element={
              <SellerProtectedRoute >
                <ShopCreateEvents />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-events'
            element={
              <SellerProtectedRoute >
                <ShopAllEvents />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-coupouns'
            element={
              <SellerProtectedRoute >
                <ShopAllCoupouns />
              </SellerProtectedRoute>}
          />
          <Route path='/dashboard-preview'
            element={
              <SellerProtectedRoute >
                <ShopPreviewPage />
              </SellerProtectedRoute>}
          />

        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          pauseOnHover
          hideProgressBar={false} newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme='dark' />

      </BrowserRouter>
    </>

  )
}

export default App

