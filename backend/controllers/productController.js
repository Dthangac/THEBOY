import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product

const addProduct = async (req, res) => {
    try {
      const { name, description, price, category, subCategory, sizes, bestseller, colors } = req.body;
  
      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 && req.files.image2[0];
      const image3 = req.files.image3 && req.files.image3[0];
      const image4 = req.files.image4 && req.files.image4[0];
  
      const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
  
      let imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
  
      const productData = {
        name,
        description,
        category,
        price: Number(price), // Giá mặc định
        subCategory,
        bestseller: bestseller === "true" ? true : false,
        sizes: JSON.parse(sizes),
        colors: colors ? JSON.parse(colors) : ['Đỏ', 'Xanh', 'Đen', 'Lục', 'Trắng'], // Mặc định các màu
        image: imagesUrl,
        date: Date.now(),
      };
  
      const product = new productModel(productData);
      await product.save();
  
      res.json({ success: true, message: "Đã thêm sản phẩm" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
// function for list product
const listProducts = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 8; 
      const skipCount = (page - 1) * limit;
      const products = await productModel.find({})
          .sort({ date: -1 }) 
          .skip(skipCount)
          .limit(limit);
      const totalProductsCount = await productModel.countDocuments({});

      res.json({
          success: true,
          products: products, 
          totalProductsCount: totalProductsCount, 
          message: "Products listed successfully"
      });

  } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.json({ success: false, message: "Lỗi khi lấy danh sách sản phẩm" });
  }
}
// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: "Lỗi server", error: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct, getProductById }