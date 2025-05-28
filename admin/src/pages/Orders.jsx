import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(0)

  const currency = "VND"

  const fetchAllOrders = async (page, limit) => {
    setLoading(true)
    setError(null)

    if (!token) {
      setError("Không có token xác thực.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, { page, limit }, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
        setTotalItems(response.data.totalOrdersCount)
      } else {
        toast.error(response.data.message)
        setError(response.data.message)
        setOrders([])
        setTotalItems(0)
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error.response ? error.response.data : error.message)
      toast.error("Lỗi khi lấy danh sách đơn hàng.")
      setError("Không thể tải danh sách đơn hàng.")
      setOrders([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: newStatus }, { headers: { token } })
      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công!")
        await fetchAllOrders(currentPage, itemsPerPage)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error.response ? error.response.data : error.message)
      toast.error("Lỗi khi cập nhật trạng thái.")
    }
  }

  useEffect(() => {
    fetchAllOrders(currentPage, itemsPerPage)
  }, [token, backendUrl, currentPage, itemsPerPage])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const pageNumbers = []
  const maxPageButtons = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  if (loading) {
    return (
      <div className="p-6 w-full flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Đang tải danh sách đơn hàng...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 w-full flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-600">Lỗi: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh Sách Đơn Hàng</h2>

      {orders.length === 0 && totalItems === 0 ? (
        <div className="text-center text-gray-500 text-xl mt-8">Không có đơn hàng nào để hiển thị.</div>
      ) : (
        <div className='flex flex-col gap-6'>
          {orders.map((order) => (
            <div
              className='grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] lg:grid-cols-[0.5fr_2.5fr_1.5fr_1fr_1fr] gap-6 items-start
                         border border-gray-200 p-6 bg-white shadow-md rounded-lg text-gray-700'
              key={order._id}
            >
              <div className="flex justify-center md:justify-start">
                <img className='w-10 h-10 object-contain' src={assets.parcel_icon} alt="Parcel Icon" />
              </div>

              <div>
                <p className="font-semibold mb-2 text-gray-800">Sản phẩm:</p>
                <div>
                  {order.items.map((item, itemIndex) => (
                    <p className='py-0.5 text-sm' key={`${order._id}-${itemIndex}`}>
                      {item.name} x {item.quantity} {item.size ? `(${item.size})` : ''}
                    </p>
                  ))}
                </div>
                <p className='mt-4 mb-2 font-semibold text-gray-800'>Địa chỉ giao hàng:</p>
                <div>
                  <p>{order.address.street}, {order.address.city}</p>
                  <p>{order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className="mt-2 font-medium">SĐT: {order.address.phone}</p>
              </div>

              <div>
                <p className='text-base font-semibold text-gray-800 mb-2'>Tổng quan:</p>
                <p className='text-sm'>Số lượng mặt hàng: <span className="font-medium">{order.items.length}</span></p>
                <p className='mt-2 text-sm'>Phương thức thanh toán: <span className="font-medium">{order.paymentMethod}</span></p>
                <p className='mt-1 text-sm'>Thanh toán:
                  <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.payment ? ' Hoàn thành' : ' Đang chờ'}
                  </span>
                </p>
                <p className='mt-1 text-sm'>Ngày đặt: <span className="font-medium">{new Date(order.date).toLocaleDateString('vi-VN')}</span></p>
              </div>

              <div className="text-center md:text-left">
                <p className='text-lg font-bold text-green-700'>{typeof order.amount === 'number' ? order.amount.toLocaleString('vi-VN') : 'N/A'} {currency}</p>
              </div>

              <div className="flex items-center justify-center md:justify-start">
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className='p-2 border border-gray-300 rounded-md font-semibold text-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
                  aria-label={`Trạng thái đơn hàng ${order._id}`}
                >
                  <option value="Đã đặt hàng">Đơn hàng đã đặt</option>
                  <option value="Đang đóng gói">Đang đóng gói</option>
                  <option value="Đã gửi">Đã gửi</option>
                  <option value="Đang giao">Đang giao hàng</option>
                  <option value="Đã giao">Đã giao</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            type="button"
          >
            Trước
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 transition-colors'}`}
              type="button"
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            type="button"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}

export default Orders