import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.log(error);
      console.error("Error loading products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      if (!token) {
        alert("Please login to place an order.");
        return;
      }

      await axios.post(
        "http://localhost:8080/user/place-order",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter">
            Nykaa <span className="text-nykaa">Exclusives</span>
          </h1>
          <p className="text-gray-500 mt-2 italic text-sm">
            Luxury beauty at your fingertips
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nykaa"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onPlaceOrder={handleBuyNow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
