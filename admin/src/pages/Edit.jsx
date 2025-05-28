import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Nam");
  const [subCategory, setSubCategory] = useState("Áo trên");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(true);

  // Lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log("ID truyền vào:", id);
        const res = await axios.get(`${backendUrl}/api/product/edit/${id}`);
        console.log("Kết quả trả về:", res.data);
        if (res.data.success) {
          const p = res.data.product;
          setName(p.name);
          setDescription(p.description);
          setPrice(p.price);
          setCategory(p.category);
          setSubCategory(p.subCategory);
          setBestseller(p.bestseller);
          setSizes(p.sizes || []);
          setImage1(p.image[0] || false);
          setImage2(p.image[1] || false);
          setImage3(p.image[2] || false);
          setImage4(p.image[3] || false);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.log("Lỗi lấy sản phẩm:", err.response ? err.response.data : err.message);
        toast.error("Không lấy được thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, backendUrl, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !description || price === "" || !category || !subCategory || sizes.length === 0 || (!image1 && !image2 && !image3 && !image4)) {
        toast.error("Vui lòng điền đầy đủ thông tin và tải lên ít nhất một ảnh.");
        return;
    }

    try {
      const formData = new FormData()
      formData.append("id", id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      const imagesToUpload = [image1, image2, image3, image4];
      imagesToUpload.forEach((img, index) => {
          if (img && typeof img !== "string") {
             formData.append(`image${index + 1}`, img);
          } else if (img && typeof img === "string") {
             formData.append(`existingImage${index + 1}`, img);
          }
      });

      const response = await axios.post(backendUrl + "/api/product/edit", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate(-1);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
       console.error("Lỗi khi cập nhật sản phẩm:", error.response ? error.response.data : error.message);
       toast.error("Lỗi khi cập nhật sản phẩm: " + (error.response?.data?.message || error.message));
    }
  }

  const getImageSrc = (img) => {
    if (!img) return assets.upload_area;
    if (typeof img === "string") return img;
    if (img instanceof File) return URL.createObjectURL(img);
    return assets.upload_area;
  }

  if (loading) {
      return (
          <div className="p-6 w-full flex justify-center items-center min-h-screen">
              <p className="text-xl text-gray-600">Đang tải thông tin sản phẩm...</p>
          </div>
      );
  }

  return (
    <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh Sửa Sản Phẩm</h2>
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 p-6 bg-white shadow-md rounded-lg'>
            <div>
              <p className='mb-2 text-gray-700 font-medium'>Hình ảnh sản phẩm (tối đa 4)</p>
              <div className='flex gap-4 flex-wrap'>
                <label htmlFor="image1" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={getImageSrc(image1)} alt="Product image 1 upload area" />
                  <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden accept="image/*"/>
                </label>
                 <label htmlFor="image2" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={getImageSrc(image2)} alt="Product image 2 upload area" />
                  <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden accept="image/*"/>
                </label>
                 <label htmlFor="image3" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={getImageSrc(image3)} alt="Product image 3 upload area" />
                  <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden accept="image/*"/>
                </label>
                 <label htmlFor="image4" className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                  <img className='w-24 h-24 object-cover' src={getImageSrc(image4)} alt="Product image 4 upload area" />
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

            <button type="submit" className='w-40 py-3 mt-4 bg-slate-700 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors self-center'>CẬP NHẬT SẢN PHẨM</button>

        </form>
    </div>
  )
}

export default Edit