import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Nam");
   const [subCategory, setSubCategory] = useState("Áo");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Thêm kiểm tra cơ bản trước khi gửi
    if (!name || !description || price === "" || !category || !subCategory || sizes.length === 0 || (!image1 && !image2 && !image3 && !image4)) {
        toast.error("Vui lòng điền đầy đủ thông tin và tải lên ít nhất một ảnh.");
        return; // Ngăn form gửi đi
    }

    try {

      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form sau khi thêm thành công
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setCategory("Nam") // Reset về giá trị mặc định
        setSubCategory("Áo") // Reset về giá trị mặc định
        setSizes([]) // Reset kích thước
        setBestseller(false) // Reset bestseller
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thêm sản phẩm: " + error.message) // Thông báo lỗi chi tiết hơn
    }
   }

  return (
    <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm Sản Phẩm Mới</h2>
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 p-6 bg-white shadow-md rounded-lg'>
            <div>
              <p className='mb-2 text-gray-700 font-medium'>Tải lên hình ảnh (tối đa 4)</p>
              <div className='flex gap-4 flex-wrap'>
                <label htmlFor="image1" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="Product image 1 upload area" />
                  <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden accept="image/*"/>
                </label>
                 <label htmlFor="image2" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="Product image 2 upload area" />
                  <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden accept="image/*"/>
                </label>
                 <label htmlFor="image3" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="Product image 3 upload area" />
                  <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden accept="image/*"/>
                </label>
                 <label htmlFor="image4" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="Product image 4 upload area" />
                  <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden accept="image/*"/>
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2 text-gray-700 font-medium'>Tên sản phẩm</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out' type="text" placeholder='Nhập tên sản phẩm' required/>
            </div>

            <div className='w-full'>
              <p className='mb-2 text-gray-700 font-medium'>Mô tả sản phẩm</p>
              <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out h-32 resize-none' placeholder='Viết nội dung mô tả tại đây' required/>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full'>

                <div className='flex-1'>
                  <p className='mb-2 text-gray-700 font-medium'>Danh mục sản phẩm</p>
                  <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white appearance-none'>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Phụ kiện">Phụ kiện</option>
                  </select>
                </div>

                <div className='flex-1'>
                  <p className='mb-2 text-gray-700 font-medium'>Danh mục con</p>
                  <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white appearance-none'>
                      <option value="Áo trên">Áo</option>
                      <option value="Áo dưới">Quần</option>
                      <option value="Áo mùa đông">Áo khoác</option>
                  </select>
                </div>

                <div className='w-full sm:w-auto'>
                  <p className='mb-2 text-gray-700 font-medium'>Giá sản phẩm (VND)</p>
                  <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full sm:w-[150px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out' type="Number" placeholder='Ví dụ: 250000' required min="0" />
                </div>

            </div>

            <div>
              <p className='mb-2 text-gray-700 font-medium'>Kích thước sản phẩm</p>
              <div className='flex gap-3 flex-wrap'>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <div
                        key={size}
                        onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                        className={`px-4 py-2 border rounded-md cursor-pointer transition-colors
                                   ${sizes.includes(size)
                                       ? "bg-blue-500 text-white border-blue-500"
                                       : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"}
                                   select-none`}
                    >
                      <p className='font-medium'>{size}</p>
                    </div>
                ))}
              </div>
               {sizes.length === 0 && <p className="text-red-500 text-sm mt-1">Vui lòng chọn ít nhất một kích thước.</p>}
            </div>

            <div className='flex items-center gap-2 mt-2'>
              <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='form-checkbox h-5 w-5 text-blue-600 rounded'/>
              <label className='cursor-pointer text-gray-700' htmlFor="bestseller">Thêm vào danh sách bán chạy</label>
            </div>

            <button type="submit" className='w-40 py-3 mt-4 bg-zinc-800 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors self-center'>THÊM SẢN PHẨM</button>

        </form>
    </div>
  )
}

export default Add