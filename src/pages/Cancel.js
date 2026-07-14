import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";


function Cancel() {

  const navigate = useNavigate();

  return (

    <div className="cancel-page-wrapper">

      <div className="cancel-card">

        <h1 className="title-style">
          ❌ Payment Canceled
        </h1>

        <p className="message-style">
          Your payment was cancelled. You can try again
        </p>

        <button
          className="button-style"
          onClick={() => navigate("/")}
        >
          Back to Homepage
        </button>

      </div>

    </div>

  );
}


export default Cancel;