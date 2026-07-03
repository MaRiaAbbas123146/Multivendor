/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activationToken } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("========== FRONTEND ACTIVATION ==========");
    console.log("1. Component mounted");
    console.log("2. Token from URL:", activationToken);
    console.log("3. Server URL:", server);
    console.log("4. Full API URL:", `${server}/user/activation`);

    if (activationToken) {
      const activationEmail = async () => {
        try {
          console.log("5. Sending request...");

          const res = await axios.post(`${server}/user/activation`, {
            activation_token: activationToken,
          });

          console.log("6. Success! Response:", res.data);
          setLoading(false);

        } catch (error) {
          console.error("7. Request failed!");
          console.error("Error object:", error);
          console.error("Response:", error.response);
          console.error("Message:", error.response?.data?.message);
          console.error("Status:", error.response?.status);
          setError(true);
          setLoading(false);
        }
      };
      activationEmail();
    } else {
      console.log("5. No token found in URL!");
      setError(true);
      setLoading(false);
    }
  }, [activationToken]);

  console.log("Render - Loading:", loading, "Error:", error);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <p>Activating your account...</p>
      ) : error ? (
        <p>Your token is expired or invalid</p>
      ) : (
        <p>Your account has been created successfully!</p>
      )}
    </div>
  );
};

export default SellerActivationPage;