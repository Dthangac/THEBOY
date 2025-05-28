
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA TÔI"} />
      </div>

      <div>
        {orderData.map((item, index) => {
          // Tính giá dựa trên size và color (nếu có)
          const priceAdjustments = {
            'Xanh': { 'S': -20000, 'M': -10000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
            'Đỏ': { 'S': -10000, 'M': -20000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
            'Đen': { 'S': -30000, 'M': -40000, 'L': 10000, 'XL': 20000, 'XXL': 40000 },
            'Lục': { 'S': -40000, 'M': -30000, 'L': 10000, 'XL': 20000, 'XXL': 30000 },
            'Trắng': { 'S': -50000, 'M': -50000, 'L': 10000, 'XL': 20000, 'XXL': 50000 },
          };
          const basePrice = item.price;
          const adjustment = item.color && item.size && priceAdjustments[item.color] ? priceAdjustments[item.color][item.size] || 0 : 0;
          const finalPrice = basePrice + adjustment;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {finalPrice.toLocaleString()} {currency}
                    </p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                    {item.color && <p>Màu: {item.color}</p>}
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Phương thức:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Trạng thái đơn hàng
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders