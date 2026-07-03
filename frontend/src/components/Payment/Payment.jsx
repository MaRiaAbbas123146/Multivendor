import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutSteps from "../Checkout/CheckoutSteps";
import { ui } from "../../styles/theme";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedOrderData = localStorage.getItem("latestOrder");
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  const paymentData = { amount: Math.round(orderData?.totalPrice * 100) };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    if (isProcessing) return; // guard against double-submit
    if (!stripe || !elements) {
      toast.error("Stripe is not initialized");
      return;
    }

    setIsProcessing(true);
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(`${server}/payment/process`, paymentData, config);
      const client_secret = data?.client_secret;

      if (!client_secret) {
        toast.error("Couldn't start payment. Please try again.");
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: user?.name },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const orderWithPayment = {
          ...order,
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          },
        };
        await axios.post(`${server}/order/create-order`, orderWithPayment, config);
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        navigate("/order/success");
        toast.success("Order placed successfully!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    const config = { headers: { "Content-Type": "application/json" } };
    const orderWithPayment = { ...order, paymentInfo: { type: "Cash On Delivery" } };
    try {
      await axios.post(`${server}/order/create-order`, orderWithPayment, config);
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      navigate("/order/success");
      toast.success("Order placed successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <CheckoutSteps active={2} />
      <div className={`${ui.containerWide} mt-8`}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <PaymentInfo
              user={user}
              paymentHandler={paymentHandler}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
              isProcessing={isProcessing}
              stripe={stripe}
              elements={elements}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <OrderSummary orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const stripeInputStyle = {
  base: { fontSize: "16px", color: "#1f2937", "::placeholder": { color: "#9ca3af" } },
  invalid: { color: "#dc2626" },
};

const PaymentInfo = ({
  user,
  paymentHandler,
  cashOnDeliveryHandler,
  isProcessing,
  stripe,
  elements,
}) => {
  const [method, setMethod] = useState("card");

  return (
    <div className={`${ui.card} ${ui.cardPadding}`}>
      <h2 className={ui.titleSm}>Payment method</h2>
      <p className={ui.subtitle}>Choose how you want to pay for this order.</p>

      <div className="mt-6 space-y-4">
        <label
          className={`block p-4 rounded-xl border-2 cursor-pointer transition ${method === "card" ? "border-teal-600 bg-teal-50/50" : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="pay"
              checked={method === "card"}
              onChange={() => setMethod("card")}
              className="text-teal-700"
            />
            <span className="font-medium text-gray-900">Debit or credit card</span>
          </div>
          {method === "card" && (
            <div className="mt-6 space-y-4 pl-7">
              <div>
                <label className={ui.label}>Name on card</label>
                <input readOnly value={user?.name || ""} className={`${ui.input} bg-gray-50`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ui.label}>Expiry</label>
                  <div className={ui.input}>
                    <CardExpiryElement options={{ style: stripeInputStyle }} />
                  </div>
                </div>
                <div>
                  <label className={ui.label}>CVC</label>
                  <div className={ui.input}>
                    <CardCvcElement options={{ style: stripeInputStyle }} />
                  </div>
                </div>
              </div>
              <div>
                <label className={ui.label}>Card number</label>
                <div className={ui.input}>
                  <CardNumberElement options={{ style: stripeInputStyle }} />
                </div>
              </div>
              <button
                type="button"
                onClick={paymentHandler}
                disabled={!stripe || !elements || isProcessing}
                className={`${ui.btnPrimary} w-full disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isProcessing ? "Processing..." : "Pay now"}
              </button>
            </div>
          )}
        </label>

        <label
          className={`block p-4 rounded-xl border-2 cursor-pointer transition ${method === "cod" ? "border-teal-600 bg-teal-50/50" : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="pay"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
              className="text-teal-700"
            />
            <span className="font-medium text-gray-900">Cash on delivery</span>
          </div>
          {method === "cod" && (
            <div className="mt-4 pl-7">
              <p className="text-sm text-gray-600 mb-4">Pay when your order arrives at your door.</p>
              <button
                type="button"
                onClick={cashOnDeliveryHandler}
                disabled={isProcessing}
                className={`${ui.btnPrimary} w-full disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isProcessing ? "Placing order..." : "Place order"}
              </button>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

const OrderSummary = ({ orderData }) => (
  <div className={`${ui.card} ${ui.cardPadding} sticky top-24`}>
    <h3 className={ui.sectionTitle}>Order summary</h3>
    <dl className="mt-4 space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-gray-600">Subtotal</dt>
        <dd className="font-medium">${orderData?.subTotalPrice?.toFixed(2)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-gray-600">Shipping</dt>
        <dd className="font-medium">${orderData?.shipping?.toFixed(2)}</dd>
      </div>
      {orderData?.discountPrice > 0 && (
        <div className="flex justify-between text-green-700">
          <dt>Discount</dt>
          <dd className="font-medium">-${orderData.discountPrice.toFixed(2)}</dd>
        </div>
      )}
      <div className="flex justify-between pt-3 border-t border-gray-200 text-base">
        <dt className="font-semibold text-gray-900">Total</dt>
        <dd className="font-semibold text-teal-800">${orderData?.totalPrice}</dd>
      </div>
    </dl>
    <p className={`${ui.hint} text-center mt-6`}>Payments secured by Stripe</p>
  </div>
);

export default Payment;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { server } from "../../server";
// import { toast } from "react-toastify";
// import {
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import CheckoutSteps from "../Checkout/CheckoutSteps";
// import { ui } from "../../styles/theme";

// const Payment = () => {
//   const [orderData, setOrderData] = useState(null);
//   const { user } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const storedOrderData = localStorage.getItem("latestOrder");
//     if (storedOrderData) {
//       setOrderData(JSON.parse(storedOrderData));
//     } else {
//       navigate("/cart");
//     }
//   }, [navigate]);

//   const paymentData = { amount: Math.round(orderData?.totalPrice * 100) };

//   const order = {
//     cart: orderData?.cart,
//     shippingAddress: orderData?.shippingAddress,
//     user: user,
//     totalPrice: orderData?.totalPrice,
//   };

//   const paymentHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const config = { headers: { "Content-Type": "application/json" } };
//       const { data } = await axios.post(`${server}/payment/process`, paymentData, config);
//       const client_secret = data?.client_secret;

//       if (!stripe || !elements) {
//         toast.error("Stripe is not initialized");
//         return;
//       }

//       const result = await stripe.confirmCardPayment(client_secret, {
//         payment_method: { card: elements.getElement(CardNumberElement) },
//       });

//       if (result.error) {
//         toast.error(result.error.message);
//       } else if (result.paymentIntent.status === "succeeded") {
//         const orderWithPayment = {
//           ...order,
//           paymentInfo: { id: result.paymentIntent.id, status: result.paymentIntent.status, type: "Credit Card" },
//         };
//         await axios.post(`${server}/order/create-order`, orderWithPayment, config);
//         localStorage.setItem("cartItems", JSON.stringify([]));
//         localStorage.setItem("latestOrder", JSON.stringify([]));
//         navigate("/order/success");
//         toast.success("Order placed successfully!");
//         setTimeout(() => window.location.reload(), 1000);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   const cashOnDeliveryHandler = async (e) => {
//     e.preventDefault();
//     const config = { headers: { "Content-Type": "application/json" } };
//     const orderWithPayment = { ...order, paymentInfo: { type: "Cash On Delivery" } };
//     try {
//       await axios.post(`${server}/order/create-order`, orderWithPayment, config);
//       localStorage.setItem("cartItems", JSON.stringify([]));
//       localStorage.setItem("latestOrder", JSON.stringify([]));
//       navigate("/order/success");
//       toast.success("Order placed successfully!");
//       setTimeout(() => window.location.reload(), 1000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Order failed");
//     }
//   };

//   if (!orderData) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 pb-16">
//       <CheckoutSteps active={2} />
//       <div className={`${ui.containerWide} mt-8`}>
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="w-full lg:w-2/3">
//             <PaymentInfo user={user} paymentHandler={paymentHandler} cashOnDeliveryHandler={cashOnDeliveryHandler} />
//           </div>
//           <div className="w-full lg:w-1/3">
//             <OrderSummary orderData={orderData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const stripeInputStyle = {
//   base: { fontSize: "16px", color: "#1f2937", "::placeholder": { color: "#9ca3af" } },
//   invalid: { color: "#dc2626" },
// };

// const PaymentInfo = ({ user, paymentHandler, cashOnDeliveryHandler }) => {
//   const [method, setMethod] = useState("card");

//   return (
//     <div className={`${ui.card} ${ui.cardPadding}`}>
//       <h2 className={ui.titleSm}>Payment method</h2>
//       <p className={ui.subtitle}>Choose how you want to pay for this order.</p>

//       <div className="mt-6 space-y-4">
//         <label
//           className={`block p-4 rounded-xl border-2 cursor-pointer transition ${method === "card" ? "border-teal-600 bg-teal-50/50" : "border-gray-200 hover:border-gray-300"
//             }`}
//         >
//           <div className="flex items-center gap-3">
//             <input type="radio" name="pay" checked={method === "card"} onChange={() => setMethod("card")} className="text-teal-700" />
//             <span className="font-medium text-gray-900">Debit or credit card</span>
//           </div>
//           {method === "card" && (
//             <div className="mt-6 space-y-4 pl-7">
//               <div>
//                 <label className={ui.label}>Name on card</label>
//                 <input readOnly value={user?.name || ""} className={`${ui.input} bg-gray-50`} />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className={ui.label}>Expiry</label>
//                   <div className={ui.input}>
//                     <CardExpiryElement options={{ style: stripeInputStyle }} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={ui.label}>CVC</label>
//                   <div className={ui.input}>
//                     <CardCvcElement options={{ style: stripeInputStyle }} />
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <label className={ui.label}>Card number</label>
//                 <div className={ui.input}>
//                   <CardNumberElement options={{ style: stripeInputStyle }} />
//                 </div>
//               </div>
//               <button type="button" onClick={paymentHandler} className={`${ui.btnPrimary} w-full`}>
//                 Pay now
//               </button>
//             </div>
//           )}
//         </label>

//         <label
//           className={`block p-4 rounded-xl border-2 cursor-pointer transition ${method === "cod" ? "border-teal-600 bg-teal-50/50" : "border-gray-200 hover:border-gray-300"
//             }`}
//         >
//           <div className="flex items-center gap-3">
//             <input type="radio" name="pay" checked={method === "cod"} onChange={() => setMethod("cod")} className="text-teal-700" />
//             <span className="font-medium text-gray-900">Cash on delivery</span>
//           </div>
//           {method === "cod" && (
//             <div className="mt-4 pl-7">
//               <p className="text-sm text-gray-600 mb-4">Pay when your order arrives at your door.</p>
//               <button type="button" onClick={cashOnDeliveryHandler} className={`${ui.btnPrimary} w-full`}>
//                 Place order
//               </button>
//             </div>
//           )}
//         </label>
//       </div>
//     </div>
//   );
// };

// const OrderSummary = ({ orderData }) => (
//   <div className={`${ui.card} ${ui.cardPadding} sticky top-24`}>
//     <h3 className={ui.sectionTitle}>Order summary</h3>
//     <dl className="mt-4 space-y-3 text-sm">
//       <div className="flex justify-between">
//         <dt className="text-gray-600">Subtotal</dt>
//         <dd className="font-medium">${orderData?.subTotalPrice?.toFixed(2)}</dd>
//       </div>
//       <div className="flex justify-between">
//         <dt className="text-gray-600">Shipping</dt>
//         <dd className="font-medium">${orderData?.shipping?.toFixed(2)}</dd>
//       </div>
//       {orderData?.discountPrice > 0 && (
//         <div className="flex justify-between text-green-700">
//           <dt>Discount</dt>
//           <dd className="font-medium">-${orderData.discountPrice.toFixed(2)}</dd>
//         </div>
//       )}
//       <div className="flex justify-between pt-3 border-t border-gray-200 text-base">
//         <dt className="font-semibold text-gray-900">Total</dt>
//         <dd className="font-semibold text-teal-800">${orderData?.totalPrice}</dd>
//       </div>
//     </dl>
//     <p className={`${ui.hint} text-center mt-6`}>Payments secured by Stripe</p>
//   </div>
// );

// export default Payment;