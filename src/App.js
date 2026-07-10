import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FloatingCart from "./components/FloatingCart";
import Cart from "./pages/Cart";
import Delivery from "./pages/Delivery";
import Cancel from "./pages/Cancel";
import Success from "./pages/Success";
import { CartContext } from "./context/CartContext";




// ---------------------------
// 1. APP ROUTER
// ---------------------------
function App() {

  // CART
  const { cart } = useContext(CartContext);


  return (
    <>

      {/* Always visible */}
      <Navbar />

      {/* Floating cart always visible */}
      { cart?.length > 0 && <FloatingCart />}
      
        <div className="layout">
         
            <Routes>

              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />

              {/* Authentification */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* Shopping */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/delivery" element={<Delivery />} />

              {/* Payment */}
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/success" element={<Success />} />

            </Routes>
            
        </div>


    </>

  );
}

export default App;