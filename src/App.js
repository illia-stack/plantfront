import React, { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { API_BASE_URL } from "./config";
import { LanguageContext } from "./context/LanguageContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import { CartContext } from "./context/CartContext";
import { translations } from "./translations";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PlantCard from "./components/PlantCard";
import FloatingCart from "./components/FloatingCart";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Delivery from "./pages/Delivery";




// ---------------------------
// HOME COMPONENT
// ---------------------------
function Home() {

  const { language } = useContext(LanguageContext);
  const { clearCart } = useContext(CartContext);
  const t = translations[language];

  const [plants, setPlants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

        useEffect(() => {
        document.title =
          language === "de"
            ? "Zimmerpflanzen Shop"
            : language === "es"
            ? "Tienda de Plantas"
            : "Indoor Plants Shop";
      }, [language]);


  useEffect(() => {

    const fetchPlants = async () => {
      try {

        const response = await fetch(
          `${API_BASE_URL}/get-products.php?lang=${language}`
        );

        if (!response.ok) throw new Error("Failed to fetch plants");

        const data = await response.json();

        setPlants(data);

      } catch (error) {

        console.error("Error fetching plants:", error);

      }
    };

    fetchPlants();

  }, [language]);



  useEffect(() => {
    clearCart();
  }, []); //Warenkorb beim Erkunden leer lassen


  const categories = [
    language === "es" ? "Todas" : language === "de" ? "Alle" : "All",
    ...Array.from(new Set(plants.map((p) => p.category))),
  ];


  const filteredPlants =
    selectedCategory === "All" ||
    selectedCategory === "Todas" ||
    selectedCategory === "Alle"
      ? plants
      : plants.filter((p) => p.category === selectedCategory);


  return (

    <div style={{ padding: "20px" }}>

      {/* CATEGORY FILTER */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>


      {/* HERO */}
      <div className="hero-banner">
        <h2>{t.heroTitle} 🌿</h2>
        <p>{t.heroSubtitle}</p>
      </div>


      {/* PRODUCTS */}
      <div className="products">

        {filteredPlants.length > 0 ? (
          filteredPlants.map((plant) => <PlantCard key={plant.id} plant={plant} />)
        ) : (
          <p>{t.noProducts}</p>
        )}

      </div>

    </div>
  );
}



// ---------------------------
// APP ROUTER
// ---------------------------
function App() {

  const { user } = useContext(AuthContext);
  return (
    <>

      {/* Always visible */}
      <Navbar />

       <FloatingCart />
      {/* Floating cart always visible */}
        <div className="layout">
         
            <Routes>
                  <Route path="/" element={<Home />} />

                  <Route path="/contact" element={<Contact />} />

                  <Route path="/login" element={<Login />} />

                  <Route path="/register" element={<Register />} />

                  <Route path="/cart" element={<Cart />} />

                  <Route path="/cancel" element={<Cancel />} />

                  <Route path="/delivery" element={<Delivery />} />

                  <Route path="/success" element={<Success />} />

                   <Route
                      path="/admin"
                      element={
                        user?.role === "admin"
                            ? <AdminDashboard />
                            : <Login />
                      }
                  />

              
            </Routes>
            
        </div>


    </>

  );
}

export default App;