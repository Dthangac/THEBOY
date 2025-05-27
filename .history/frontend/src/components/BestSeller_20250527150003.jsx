import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import BestSellerList from "./BestSellerList";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  // Sản phẩm bán chạy nhất (không phân biệt danh mục)
  const bestSeller = useMemo(
    () => products.filter((item) => item.bestseller).slice(0, 5),
    [products]
  );

  // Sản phẩm bán chạy của nữ
  const bestSellerFemale = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.bestseller &&
            item.category &&
            item.category.toLowerCase() === "nữ"
        )
        .slice(0, 5),
    [products]
  );

  // Sản phẩm bán chạy của nam
  const bestSellerMale = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.bestseller &&
            item.category &&
            item.category.toLowerCase() === "nam"
        )
        .slice(0, 5),
    [products]
  );

  return (
    <div>
      {/* Khu vực bán chạy tổng hợp */}
      <div className="my-10">
        <div className="text-center text-3xl py-8">
          <Title text1={"NHỮNG SẢN PHẨM BÁN CHẠY"} text2={"NHẤT"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Những sản phẩm bán chạy nhất của cửa hàng
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price.toLocaleString()}
              isHot={true}
            />
          ))}
        </div>
      </div>

      {/* Khu vực bán chạy nữ */}
      <BestSellerList title="NỮ" products={bestSellerFemale} />

      {/* Khu vực bán chạy nam */}
      <BestSellerList title="NAM" products={bestSellerMale} />
    </div>
  );
};

export default BestSeller;
