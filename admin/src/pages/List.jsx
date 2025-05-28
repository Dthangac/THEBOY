import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {

  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const currency = "VND";

  const fetchList = async (page, limit) => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list?page=${page}&limit=${limit}`);

      if (response.data.success) {
        setList(response.data.products);
        setTotalItems(response.data.totalProductsCount);
      }
      else {
        toast.error(response.data.message);
        setList([]);
        setTotalItems(0);
      }

    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải danh sách sản phẩm.");
      setList([]);
      setTotalItems(0);
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        if (list.length === 1 && currentPage > 1) {
          setCurrentPage(prevPage => prevPage - 1);
        } else {
          fetchList(currentPage, itemsPerPage);
        }
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi xóa sản phẩm.");
    }
  }

  useEffect(() => {
    fetchList(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-4 flex-1">
      <p className="mb-4 text-xl font-semibold">Danh Sách Tất Cả Sản Phẩm</p>
      <div className="flex flex-col gap-4">

        <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-bold rounded">
          <b>Hình Ảnh</b>
          <b>Tên</b>
          <b>Danh Mục</b>
          <b>Giá</b>
          <b className="text-center">Hành Động</b>
        </div>

        {list.length > 0 ? (
          list.map((item) => (
            <div
              className="grid grid-cols-[0.5fr_2fr_1fr] md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-sm rounded"
              key={item._id}
            >
              <img className="w-12 h-12 object-cover rounded" src={item.image && item.image.length > 0 ? item.image[0] : 'placeholder_image_url'} alt={item.name || 'Product image'} />
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-700">{item.category}</p>
              <p className="text-green-600 font-semibold">
                {typeof item.price === 'number' ? item.price.toLocaleString() : 'N/A'} {currency}
              </p>
              <div className="flex justify-end md:justify-center items-center gap-3">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Xóa sản phẩm"
                  type="button"
                >
                  X
                </button>
                <button
                  onClick={() => navigate(`/admin/edit/${item._id}`)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  type="button"
                  title="Sửa sản phẩm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">{!list.length && totalItems > 0 ? 'Đang tải sản phẩm...' : 'Không tìm thấy sản phẩm nào.'}</p>
        )}
      </div>

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
  );
}

export default List;