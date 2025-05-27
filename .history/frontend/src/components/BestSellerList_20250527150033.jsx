import React from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSellerList = ({ title, products }) => (
  <div className="my-10">
    <div className="text-center text-3xl py-8">
      <Title text1={"NHỮNG SẢN PHẨM BÁN CHẠY"} text2={title} />
    </div>
    {products.length === 0 ? (
      <div className="text-center text-gray-500 py-10">
        Hiện chưa có sản phẩm bán chạy nào thuộc danh mục <b>{title}</b>.
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {products.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price.toLocaleString()}
            isHot={true}
          />
        ))}
      </div>
    )}
  </div>
);

export default BestSellerList;
