import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, isNew, isHot }) => {
  const { currency } = useContext(ShopContext);

  return (
    <div className="text-gray-700 cursor-pointer">
      <div className="relative group overflow-hidden">
        <Link onClick={() => scrollTo(0, 0)} to={`/product/${id}`}>
          <img
            className="hover:scale-110 transition ease-in-out"
            src={image[0]}
            alt=""
          />
          {isNew && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
              NEW
            </span>
          )}
          {isHot && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
              HOT
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Xem chi tiết
          </span>
        </Link>
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {price} {currency}
      </p>
    </div>
  );
};

export default ProductItem;
