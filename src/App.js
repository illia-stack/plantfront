import React, { useState, useEffect, useContext, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { API_BASE_URL } from "./config";

import { LanguageContext } from "./context/LanguageContext";
import { translations } from "./translations";

import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
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
  const t = translations[language];

  const [plants, setPlants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Titel setzen
  useEffect(() => {
    document.title =
      language === "de"
        ? "Zimmerpflanzen Shop"
        : language === "es"
        ? "Tienda de Plantas"
        : "Indoor Plants Shop";
  }, [language]);

  // Fetch mit AbortController (gut!)
  useEffect(() => {
    const controller = new AbortController();

    const fetchPlants = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/get-products.php?lang=${language}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setPlants(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();

    return () => controller.abort();
  }, [language]);

  // Kategorien
  const categories = useMemo(() => {
    return [
      language === "es" ? "Todas" : language === "de" ? "Alle" : "All",
      ...Array.from(new Set(plants.map((p) => p.category))),
    ];
  }, [plants, language]);

  // Filter
  const filteredPlants = useMemo(() => {
    if (["All", "Todas", "Alle"].includes(selectedCategory)) {
      return plants;
    }
    return plants.filter((p) => p.category === selectedCategory);
  }, [plants, selectedCategory]);

  return (
    <div style={{ padding: "20px" }}>

      {/* CATEGORY FILTER */}
      <div style={{ marginBottom: "20px" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{ marginRight: "10px" }}
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
        {loading ? (
          <p>Loading...</p> // 👉 später durch Skeleton ersetzbar
        ) : filteredPlants.length > 0 ? (
          filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))
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
  return (
    <>
      <Navbar />

      {/* Floating Cart (global sichtbar) */}
      <FloatingCart />

      <div className="layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </>
  );
}

export default App;