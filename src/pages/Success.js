import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem("cart");
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Payment Successful 🎉</h2>
      <p>Thank you for your order!</p>

      <button onClick={() => navigate("/")}>
        Back to Shop
      </button>
    </div>
  );
}

export default Success;