import React from "react";
import ReactDOM from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";


const container = document.getElementById("root");

if(!container) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(container);


root.render(
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
           <App />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
);