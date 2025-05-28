import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import fs from 'fs';

// Hàm để thêm sản phẩm
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
        price: Number(price), // Giá sản phẩm
        subCategory,
        bestseller: bestseller === "true" ? true : false,
        sizes: JSON.parse(sizes),
        colors: colors ? JSON.parse(colors) : ['Đỏ', 'Xanh', 'Đen', 'Lục', 'Trắng'], // Màu sắc mặc định
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
// Hàm để liệt kê sản phẩm
const listProducts = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
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
          message: "Products listed successfully" // Sản phẩm được liệt kê thành công
      });

  } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.json({ success: false, message: "Lỗi khi lấy danh sách sản phẩm" });
  }
}
// Hàm để xóa sản phẩm
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"}) // Sản phẩm đã được xóa

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Hàm để lấy thông tin một sản phẩm
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

// HÀM MỚI: Hàm để cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, bestseller, sizes, existingImage1, existingImage2, existingImage3, existingImage4 } = req.body;
        const newFiles = req.files; // Mảng các tệp ảnh mới được tải lên bởi Multer

        // Tìm sản phẩm theo ID
        let product = await productModel.findById(id);
        if (!product) {
             // Dọn dẹp các tệp mới tải lên nếu không tìm thấy sản phẩm
            if (newFiles && newFiles.length > 0) {
                newFiles.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path); // Xóa tệp tạm thời
                    }
                });
            }
            return res.json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        // Cập nhật các trường thông tin cơ bản của sản phẩm
        product.name = name;
        product.description = description;
        product.price = Number(price); // Đảm bảo giá là kiểu Number
        product.category = category;
        product.subCategory = subCategory;
        product.bestseller = bestseller === 'true' || bestseller === true; // Chuyển đổi chuỗi sang boolean
        product.sizes = JSON.parse(sizes); // Phân tích chuỗi JSON thành mảng

        // Xử lý ảnh
        const existingImagesFromFrontend = [existingImage1, existingImage2, existingImage3, existingImage4].filter(url => url && url !== 'false');

        // Lấy các URL ảnh hiện tại từ cơ sở dữ liệu
        const currentImagesInDB = product.image || [];

        // Xác định những ảnh cần xóa khỏi Cloudinary
        const imagesToDelete = currentImagesInDB.filter(url => url && !existingImagesFromFrontend.includes(url));

        // Xóa những ảnh khỏi Cloudinary không còn được liên kết
        if (imagesToDelete.length > 0) {
            for (const imageUrl of imagesToDelete) {
                try {
                    // Trích xuất public ID từ URL Cloudinary
                    const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
                    if (publicIdMatch && publicIdMatch[1]) {
                         const publicId = publicIdMatch[1];
                         await cloudinary.uploader.destroy(publicId);
                         console.log(`Deleted image from Cloudinary: ${publicId}`); // Đã xóa ảnh khỏi Cloudinary
                    } else {
                         console.warn(`Could not extract public ID from URL: ${imageUrl}`); // Không thể trích xuất public ID từ URL
                    }
                } catch (deleteError) {
                    console.error(`Error deleting image from Cloudinary (${imageUrl}):`, deleteError); // Lỗi khi xóa ảnh khỏi Cloudinary
                    // Tiếp tục ngay cả khi xóa một ảnh thất bại
                }
            }
        }

        // Tải các ảnh mới lên Cloudinary
        const newImageUrls = [];
        if (newFiles && newFiles.length > 0) {
            for (const file of newFiles) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                    newImageUrls.push(uploadResult.secure_url);
                     // Xóa tệp tạm thời sau khi tải lên Cloudinary
                    if (fs.existsSync(file.path)) {
                         fs.unlinkSync(file.path);
                    }
                } catch (uploadError) {
                    console.error(`Error uploading image to Cloudinary (${file.originalname}):`, uploadError); // Lỗi khi tải ảnh lên Cloudinary
                     // Dọn dẹp bất kỳ tệp nào đã tải lên trong yêu cầu này nếu có lỗi
                     newFiles.forEach(f => {
                         if (fs.existsSync(f.path)) {
                              fs.unlinkSync(f.path);
                         }
                     });
                     return res.json({ success: false, message: `Lỗi tải ảnh lên: ${uploadError.message}` });
                }
            }
        }

        // Kết hợp các ảnh cũ còn lại và các ảnh mới
        product.image = existingImagesFromFrontend.concat(newImageUrls);

        // Lưu sản phẩm đã cập nhật
        await product.save();

        res.json({ success: true, message: "Cập nhật sản phẩm thành công" });

    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error); // Lỗi khi cập nhật sản phẩm
         // Dọn dẹp các tệp mới tải lên nếu có bất kỳ lỗi nào xảy ra
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.json({ success: false, message: "Lỗi khi cập nhật sản phẩm" }); // Lỗi khi cập nhật sản phẩm
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, getProductById, updateProduct }