import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = ({setToken}) => {

    const navigate = useNavigate();

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!email || !password) {
             toast.error("Vui lòng nhập đầy đủ Email và Mật khẩu.");
             return;
        }

        try {
            const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
            if (response.data.success) {
                setToken(response.data.token)
                toast.success("Đăng nhập thành công!")
                navigate('/admin/stats')
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response ? error.response.data : error.message);
            toast.error("Lỗi đăng nhập: " + (error.response?.data?.message || error.message));
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-gradient-to-r from-blue-100 to-purple-100 p-6'>
        <div className='bg-white shadow-xl rounded-xl px-8 py-8 w-full max-w-sm'>
            <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Admin Login</h1>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-4'>
                    <p className='block text-sm font-semibold text-gray-700 mb-2'>Email</p>
                    <input
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
                        type="email"
                        placeholder='abcabc@email.com'
                        required
                    />
                </div>
                <div className='mb-6'>
                    <p className='block text-sm font-semibold text-gray-700 mb-2'>Mật khẩu</p>
                    <input
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
                        type="password"
                        placeholder='Mật khẩu'
                        required
                    />
                </div>
                <button
                    className='w-full py-3 px-4 rounded-lg text-white bg-blue-600 font-semibold shadow-md hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    type="submit"
                >
                     Đăng nhập
                </button>
            </form>
        </div>
    </div>
  )
}

export default Login