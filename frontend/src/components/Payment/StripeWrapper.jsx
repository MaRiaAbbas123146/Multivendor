// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import axios from "axios";
// import { server } from "../../server";

// const StripeWrapper = ({ children }) => {
//   const [stripeApiKey, setStripeApiKey] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getStripeApiKey = async () => {
//       try {
//         const { data } = await axios.get(`${server}/payment/stripeapikey`);
//         setStripeApiKey(data.stripeApikey);
//       } catch (error) {
//         console.error("Error fetching Stripe API key:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getStripeApiKey();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-100">
//         <div className="text-lg">Loading payment options...</div>
//       </div>
//     );
//   }

//   if (!stripeApiKey) {
//     return (
//       <div className="flex items-center justify-center min-h-100">
//         <div className="text-lg text-red-500">Failed to load payment options. Please refresh the page.</div>
//       </div>
//     );
//   }

//   return (
//     <Elements stripe={loadStripe(stripeApiKey)}>
//       {children}
//     </Elements>
//   );
// };

// export default StripeWrapper;

import React, { useEffect, useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { server } from "../../server";

const StripeWrapper = ({ children }) => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const { data } = await axios.get(`${server}/payment/stripeapikey`);
        setStripeApiKey(data.stripeApikey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      } finally {
        setLoading(false);
      }
    };
    getStripeApiKey();
  }, []);

  // Memoized so a new Stripe instance is only created when the key actually changes,
  // not on every re-render of this component.
  const stripePromise = useMemo(
    () => (stripeApiKey ? loadStripe(stripeApiKey) : null),
    [stripeApiKey]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-lg">Loading payment options...</div>
      </div>
    );
  }

  if (!stripeApiKey || !stripePromise) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-lg text-red-500">
          Failed to load payment options. Please refresh the page.
        </div>
      </div>
    );
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;