import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'VND';
    const delivery_fee = 0;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();

    const addToCart = async (itemId, size, color) => {
        if (!size || !color) {
            toast.error('Vui lòng chọn kích thước và màu sắc');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][`${size}_${color}`]) {
                cartData[itemId][`${size}_${color}`].quantity += 1;
            } else {
                cartData[itemId][`${size}_${color}`] = { size, color, quantity: 1 };
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][`${size}_${color}`] = { size, color, quantity: 1 };
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size, color }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item].quantity > 0) {
                        totalCount += cartItems[items][item].quantity;
                    }
                } catch (error) {}
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, color, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][`${size}_${color}`].quantity = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, color, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item].quantity > 0) {
                        const priceAdjustments = {
                            'Xanh': { 'S': -20000, 'M': -10000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
                            'Đỏ': { 'S': -10000, 'M': -20000, 'L': 10000, 'XL': 20000, 'XXL': 10000 },
                            'Đen': { 'S': -30000, 'M': -40000, 'L': 10000, 'XL': 20000, 'XXL': 40000 },
                            'Lục': { 'S': -40000, 'M': -30000, 'L': 10000, 'XL': 20000, 'XXL': 30000 },
                            'Trắng': { 'S': -50000, 'M': -50000, 'L': 10000, 'XL': 20000, 'XXL': 50000 },
                        };
                        const basePrice = itemInfo.price;
                        const adjustment = priceAdjustments[cartItems[items][item].color][cartItems[items][item].size] || 0;
                        totalAmount += (basePrice + adjustment) * cartItems[items][item].quantity;
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            if (!backendUrl) {
                throw new Error("Biến môi trường VITE_BACKEND_URL không được định nghĩa.");
            }
            const response = await axios.get(backendUrl + '/api/product/list', {
                params: { page: 1, limit: 100 }
            });
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            toast.error("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối API.");
            setProducts([]);
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;