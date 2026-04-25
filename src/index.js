import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
           <App />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);