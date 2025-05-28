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

  // Lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
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
      }
    };
    fetchProduct();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

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

      // Nếu là file mới thì gửi file, nếu là link cũ thì gửi link
      if (image1 && typeof image1 !== "string") formData.append("image1", image1)
      if (image2 && typeof image2 !== "string") formData.append("image2", image2)
      if (image3 && typeof image3 !== "string") formData.append("image3", image3)
      if (image4 && typeof image4 !== "string") formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/edit", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate(-1); // Quay lại trang trước
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getImageSrc = (img) => {
    if (!img) return assets.upload_area;
    if (typeof img === "string") return img;
    return URL.createObjectURL(img);
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Tải lên hình ảnh</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={getImageSrc(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={getImageSrc(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={getImageSrc(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={getImageSrc(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Tên sản phẩm</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập tại đây' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Mô tả sản phẩm</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Viết nội dung tại đây' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Danh mục sản phẩm</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Danh mục con</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
            <option value="Áo trên">Áo</option>
            <option value="Áo dưới">Quần</option>
            <option value="Áo mùa đông">Áo khoác</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Giá sản phẩm</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='250.000' />
        </div>
      </div>

      <div>
        <p className='mb-2'>Kích thước sản phẩm</p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map(size => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Thêm vào danh sách bán chạy</label>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>LƯU</button>
    </form>
  )
}

export default Edit