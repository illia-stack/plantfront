import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem("cart");
  }, []);

  return (
    
    <div className="cancel-page-wrapper">
      <div className="cancel-card">

        <h1 style={{ color: "green" }}> Payment Successful! 🎉 </h1>

        <p className="message-style">
          Thank you for your order!
        </p>

        <button 
          className="button-style"
          onClick={() => navigate("/")}>
          Back to Shop
        </button>

      </div>
    </div>
  );
}

export default Success;