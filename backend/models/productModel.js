import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  colors: { type: Array, default: ["Đỏ", "Xanh", "Đen", "Lục", "Trắng"] },
  bestseller: { type: Boolean },
  date: {type: Date,default: Date.now},
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
