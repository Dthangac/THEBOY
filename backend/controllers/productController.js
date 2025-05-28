import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import fs from 'fs'; // Import fs to delete local temp files if needed

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

// NEW FUNCTION: function for update product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, bestseller, sizes, existingImage1, existingImage2, existingImage3, existingImage4 } = req.body;
        const newFiles = req.files; // Array of new image files uploaded by Multer

        // Find the product by ID
        let product = await productModel.findById(id);
        if (!product) {
             // Clean up newly uploaded files if product not found
            if (newFiles && newFiles.length > 0) {
                newFiles.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path); // Delete temp file
                    }
                });
            }
            return res.json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        // Update basic product fields
        product.name = name;
        product.description = description;
        product.price = Number(price); // Ensure price is a Number
        product.category = category;
        product.subCategory = subCategory;
        product.bestseller = bestseller === 'true' || bestseller === true; // Convert string to boolean
        product.sizes = JSON.parse(sizes); // Parse JSON string back to array

        // Handle images
        const existingImagesFromFrontend = [existingImage1, existingImage2, existingImage3, existingImage4].filter(url => url && url !== 'false');

        // Get current image URLs from the database
        const currentImagesInDB = product.image || [];

        // Determine which images to delete from Cloudinary
        const imagesToDelete = currentImagesInDB.filter(url => url && !existingImagesFromFrontend.includes(url));

        // Delete images from Cloudinary that are no longer linked
        if (imagesToDelete.length > 0) {
            for (const imageUrl of imagesToDelete) {
                try {
                    // Extract public ID from Cloudinary URL
                    const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
                    if (publicIdMatch && publicIdMatch[1]) {
                         const publicId = publicIdMatch[1];
                         await cloudinary.uploader.destroy(publicId);
                         console.log(`Deleted image from Cloudinary: ${publicId}`);
                    } else {
                         console.warn(`Could not extract public ID from URL: ${imageUrl}`);
                    }
                } catch (deleteError) {
                    console.error(`Error deleting image from Cloudinary (${imageUrl}):`, deleteError);
                    // Continue even if deletion fails for one image
                }
            }
        }

        // Upload new images to Cloudinary
        const newImageUrls = [];
        if (newFiles && newFiles.length > 0) {
            for (const file of newFiles) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                    newImageUrls.push(uploadResult.secure_url);
                     // Delete the temporary file after uploading to Cloudinary
                    if (fs.existsSync(file.path)) {
                         fs.unlinkSync(file.path);
                    }
                } catch (uploadError) {
                    console.error(`Error uploading image to Cloudinary (${file.originalname}):`, uploadError);
                     // Clean up any files uploaded so far in this request on error
                     newFiles.forEach(f => {
                         if (fs.existsSync(f.path)) {
                              fs.unlinkSync(f.path);
                         }
                     });
                     return res.json({ success: false, message: `Lỗi tải ảnh lên: ${uploadError.message}` });
                }
            }
        }

        // Combine remaining old images and new images
        product.image = existingImagesFromFrontend.concat(newImageUrls);

        // Save the updated product
        await product.save();

        res.json({ success: true, message: "Cập nhật sản phẩm thành công" });

    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
         // Clean up newly uploaded files if any error occurred
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.json({ success: false, message: "Lỗi khi cập nhật sản phẩm" });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, getProductById, updateProduct }