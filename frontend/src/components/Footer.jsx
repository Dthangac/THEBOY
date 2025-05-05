import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            THEBOY là một website thời trang mang phong cách hiện đại, trẻ
            trung, được thiết kế để phục vụ nhu cầu mua sắm trực tuyến các sản
            phẩm quần áo dành cho cả nam và nữ. Với tiêu chí “Đẳng cấp – Phong
            cách – Cá tính”, THEBOY hướng tới việc trở thành điểm đến đáng tin
            cậy cho các tín đồ thời trang.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">MỤC LỤC</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Giao hàng</li>
            <li>Chính sách riêng tư</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>0364 515 118</li>
            <li>Xdrake2710.siu@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">Xdrake2710.siu@gmail.com</p>
      </div>
    </div>
  );
}

export default Footer
