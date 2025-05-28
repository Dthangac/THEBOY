// import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { assets } from '../assets/assets';
// import RelatedProducts from '../components/RelatedProducts';

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(ShopContext);
//   const [productData, setProductData] = useState(null);
//   const [image, setImage] = useState('');
//   const [size, setSize] = useState('');
//   const [color, setColor] = useState('Đỏ'); // Mặc định màu đầu tiên
//   const [price, setPrice] = useState(0);

//   const fetchProductData = async () => {
//     const foundProduct = products.find((item) => item._id === productId);
//     if (foundProduct) {
//       setProductData(foundProduct);
//       setImage(foundProduct.image[0]);
//       setPrice(foundProduct.price.toLocaleString()); 
//     }
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, [productId, products]);

//   useEffect(() => {
//     if (productData && size && color) {
//       const basePrice = productData.price;
//       const priceAdjustments = {
//         'Xanh': { 'S': -20000, 'M': -10000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
//         'Đỏ': { 'S': -10000, 'M': -20000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
//         'Đen': { 'S': -30000, 'M': -40000, 'L': 10000, 'XL': 20000, 'XXL': 40000 },
//         'Lục': { 'S': -40000, 'M': -30000, 'L': 10000, 'XL': 20000, 'XXL': 30000 },
//         'Trắng': { 'S': -50000, 'M': -50000, 'L': 10000, 'XL': 20000, 'XXL': 50000 },
//       };
//       const adjustment = priceAdjustments[color][size] || 0;
//       setPrice(basePrice + adjustment);
//     }
//   }, [size, color, productData]);

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       {/*----------- Product Data-------------- */}
//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         {/*---------- Product Images------------- */}
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 src={item}
//                 key={index}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                 alt=""
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img className="w-full h-auto" src={image} alt="" />
//           </div>
//         </div>

//         {/* -------- Product Info ---------- */}
//         <div className="flex-1">
//           <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
//           <div className="flex items-center gap-1 mt-2">
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_dull_icon} alt="" className="w-3.5" />
//             <p className="pl-2">(122)</p>
//           </div>
//           <p className="mt-5 text-3xl font-medium">
//             {price.toLocaleString()} {currency}
//           </p>
//           <p className="mt-5 text-gray-500 md:w-4/5">
//             {productData.description}
//           </p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Select Size</p>
//             <div className="flex gap-2">
//               {productData.sizes.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${
//                     item === size ? 'border-orange-500' : ''
//                   }`}
//                   key={index}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Chọn màu</p>
//             <div className="flex gap-2">
//               {['Đỏ', 'Xanh', 'Đen', 'Lục', 'Trắng'].map((item, index) => (
//                 <button
//                   onClick={() => setColor(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${
//                     item === color ? 'border-orange-500' : ''
//                   }`}
//                   key={index}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <button
//             onClick={() => addToCart(productData._id, size, color)} // Thêm color vào giỏ hàng
//             className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
//             disabled={!size || !color} 
//           >
//             THÊM VÀO GIỎ HÀNG
//           </button>
//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>Sản phẩm 100% chính hãng</p>
//             <p>Thanh toán khi giao hàng cho sản phẩm này.</p>
//             <p>Chính sách trả lại và đổi hàng dễ dàng trong vòng 7 ngày</p>
//           </div>
//         </div>
//       </div>

//       {/* ---------- Description & Review Section ------------- */}
//       <div className="mt-20">
//         <div className="flex">
//           <b className="border px-5 py-3 text-sm">Mô tả</b>
//           <p className="border px-5 py-3 text-sm">Đánh giá (122)</p>
//         </div>
//         <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
//           <p>
//             Trang web thương mại điện tử là một nền tảng trực tuyến giúp cho
//             việc mua và bán sản phẩm hoặc dịch vụ trên internet. Nó hoạt động
//             như một thị trường ảo nơi các doanh nghiệp và cá nhân có thể trưng
//             bày sản phẩm của họ, tương tác với khách hàng, và thực hiện các giao
//             dịch mà không cần có mặt trực tiếp. Các trang web thương mại điện tử
//             đã trở nên rất phổ biến do sự tiện lợi, khả năng tiếp cận, và phạm
//             vi toàn cầu mà chúng mang lại.
//           </p>
//           <p>
//             Thông thường, các trang web thương mại điện tử sẽ hiển thị sản phẩm
//             hoặc dịch vụ kèm theo các mô tả chi tiết, hình ảnh, giá cả, và bất
//             kỳ biến thể có sẵn nào (ví dụ, kích thước, màu sắc). Mỗi sản phẩm
//             thường có một trang riêng biệt với thông tin liên quan.
//           </p>
//         </div>
//       </div>
//       <RelatedProducts
//         category={productData.category}
//         subCategory={productData.subCategory}
//       />
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;


import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('Đỏ'); // Mặc định màu đầu tiên
  const [price, setPrice] = useState(0);

  const fetchProductData = async () => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
      setPrice(foundProduct.price.toLocaleString()); 
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (productData && size && color) {
      const basePrice = productData.price;
      const priceAdjustments = {
        'Xanh': { 'S': -20000, 'M': -10000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
        'Đỏ': { 'S': -10000, 'M': -20000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
        'Đen': { 'S': -30000, 'M': -40000, 'L': 10000, 'XL': 20000, 'XXL': 40000 },
        'Lục': { 'S': -40000, 'M': -30000, 'L': 10000, 'XL': 20000, 'XXL': 30000 },
        'Trắng': { 'S': -50000, 'M': -50000, 'L': 10000, 'XL': 20000, 'XXL': 50000 },
      };
      const adjustment = priceAdjustments[color][size] || 0;
      setPrice(basePrice + adjustment);
    }
  }, [size, color, productData]);

  // Hàm xử lý "MUA NGAY"
  const handleBuyNow = () => {
    if (!size || !color) {
      alert('Vui lòng chọn kích thước và màu sắc!');
      return;
    }
    // Thêm sản phẩm vào giỏ hàng
    addToCart(productData._id, size, color);
    // Điều hướng đến trang giỏ hàng
    navigate('/cart');
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*----------- Product Data-------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*---------- Product Images------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {price.toLocaleString()} {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? 'border-orange-500' : ''
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 my-8">
            <p>Chọn màu</p>
            <div className="flex gap-2">
              {['Đỏ', 'Xanh', 'Đen', 'Lục', 'Trắng'].map((item, index) => (
                <button
                  onClick={() => setColor(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === color ? 'border-orange-500' : ''
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => addToCart(productData._id, size, color)} // Thêm color vào giỏ hàng
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              disabled={!size || !color}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-black text-white px-8 py-3 text-sm active:bg-blue-700"
              disabled={!size || !color}
            >
              MUA NGAY
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Sản phẩm 100% chính hãng</p>
            <p>Thanh toán khi giao hàng cho sản phẩm này.</p>
            <p>Chính sách trả lại và đổi hàng dễ dàng trong vòng 7 ngày</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Mô tả</b>
          <p className="border px-5 py-3 text-sm">Đánh giá (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Trang web thương mại điện tử là một nền tảng trực tuyến giúp cho
            việc mua và bán sản phẩm hoặc dịch vụ trên internet. Nó hoạt động
            như một thị trường ảo nơi các doanh nghiệp và cá nhân có thể trưng
            bày sản phẩm của họ, tương tác với khách hàng, và thực hiện các giao
            dịch mà không cần có mặt trực tiếp. Các trang web thương mại điện tử
            đã trở nên rất phổ biến do sự tiện lợi, khả năng tiếp cận, và phạm
            vi toàn cầu mà chúng mang lại.
          </p>
          <p>
            Thông thường, các trang web thương mại điện tử sẽ hiển thị sản phẩm
            hoặc dịch vụ kèm theo các mô tả chi tiết, hình ảnh, giá cả, và bất
            kỳ biến thể có sẵn nào (ví dụ, kích thước, màu sắc). Mỗi sản phẩm
            thường có một trang riêng biệt với thông tin liên quan.
          </p>
        </div>
      </div>
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;