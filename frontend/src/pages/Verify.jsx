import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const success = query.get('success') === 'true';

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {success ? (
                <>
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công</h2>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Xem đơn hàng
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại</h2>
                    <p className="text-gray-600 mb-4">Vui lòng thử lại.</p>
                    <button
                        onClick={() => navigate('/cart')}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Quay lại giỏ hàng
                    </button>
                </>
            )}
        </div>
    );
};

export default Verify;