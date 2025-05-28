import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const currency = "VND";
  const navigate = useNavigate();

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className="mb-2">Danh Sách Tất Cả Sản Phẩm</p>
      <div className="flex flex-col gap-2">
        {/* ------- List Table Title ---------- */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Hình Ảnh</b>
          <b>Tên</b>
          <b>Danh Mục</b>
          <b>Giá</b>
          <b className="text-center">Hành Động</b>
        </div>

        {/* ------ Product List ------ */}

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {item.price.toLocaleString()} {currency}
            </p>
            <div className="flex justify-end md:justify-center items-center gap-2">
              <p
                onClick={() => removeProduct(item._id)}
                className="cursor-pointer text-lg text-red-600"
                title="Xóa sản phẩm"
              >
                X
              </p>
              <button
                onClick={() => navigate(`/admin/edit/${item._id}`)}
                className="cursor-pointer text-blue-600"
                type="button"
                title="Sửa sản phẩm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default List