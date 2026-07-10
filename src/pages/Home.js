import React, { useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config";
import { CartContext } from "./context/CartContext.js";

function Home () {
  
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { cart } = useContext(CartContext);

  //Title
  useEffect(() => {
    document.title = "Indoor Plants Shop";
  }, []);


  //Fetching plants
  useEffect(() => {

    const controller = new AbortController();

    async function fetchPlants() {

        setLoading(true);

        try{
            const res = await fetch(`${API_BASE_URL}/get-products.php`,
              {signal: controller.signal,}
            );
            
            if(!res.ok) { throw new Error("Failed to fetch plants"); }

            const data = await res.json();

            if(!Array.isArray(data)) { throw new Error("Invalid API response"); }
            setPlants(data);

        } catch (err) { 

            if(err.name !== "AbortError") {
              console.log(err);
            }

        } finally { 
            if(!controller.signal.aborted) {
              setLoading(false); 
            }
        }
        
    }

    fetchPlants();

    return () => controller.abort();

  }, []);

  // race-unmounting before fetch is completed  - taken in account





  const categories = ["All", ...new Set(plants.map((p) => p.category))];
  

  const filteredPlants =
    selectedCategory === "All" ? plants
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
        <h2>Bring Nature Into Your Home 🌿</h2>
        <p>Beautiful indoor plants delivered to your door</p>
      </div>


      {/* PRODUCTS */}
      <div className="products">

        {loading ? (  
          <div className="loader"></div>
        ) : filteredPlants.length > 0 ? (
          filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))
        ) : (
          <p>No products available</p>
        )}

      </div>


    </div>
  );
}

export default Home;