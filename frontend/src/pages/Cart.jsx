import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item].quantity > 0) {
            tempData.push({
              _id: items,
              size: cartItems[items][item].size,
              color: cartItems[items][item].color,
              quantity: cartItems[items][item].quantity
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'GIỎ HÀNG'} text2={'CỦA BẠN'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          const priceAdjustments = {
            'Xanh': { 'S': -20000, 'M': -10000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
            'Đỏ': { 'S': -10000, 'M': -20000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
            'Đen': { 'S': -30000, 'M': -40000, 'L': 10000, 'XL': 20000, 'XXL': 40000 },
            'Lục': { 'S': -40000, 'M': -30000, 'L': 10000, 'XL': 20000, 'XXL': 30000 },
            'Trắng': { 'S': -50000, 'M': -50000, 'L': 10000, 'XL': 20000, 'XXL': 50000 },
          };
          const basePrice = productData.price;
          const adjustment = priceAdjustments[item.color][item.size] || 0;
          const finalPrice = basePrice + adjustment;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {finalPrice.toLocaleString()} {currency}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      Kích thước: {item.size}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      Màu: {item.color}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        item.color,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, item.color, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart