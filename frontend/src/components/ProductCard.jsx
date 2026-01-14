import React from "react";
import { ShoppingBag } from "lucide-react";

const ProductCard = ({ product, onPlaceOrder }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative `aspect-4/5` bg-gray-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
          <img
            src={`https://placehold.co/400x500?text=${
              product.name.split(" ")[0]
            }`}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col grow text-center">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-nykaa transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-base font-bold text-gray-900">
            ₹{product.price}
          </span>
        </div>

        <button
          onClick={() => onPlaceOrder(product.product_id)}
          className="mt-4 flex items-center justify-center gap-2 w-full bg-nykaa text-white py-2.5 text-xs font-bold uppercase tracking-wider bg-black transition-all hover:bg-gray-700"
        >
          <ShoppingBag size={14} />
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
