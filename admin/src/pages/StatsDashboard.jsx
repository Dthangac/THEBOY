import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Cần cài đặt axios hoặc sử dụng fetch API
// Import các component cần thiết từ recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/stats/basic');
                // const response = await axios.get('/api/stats/basic', {
                //     headers: {
                //         'Cache-Control': 'no-cache' 
                //     }
                // });

                // Kiểm tra xem response.data có tồn tại và là một object không rỗng
                if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
                     setStats(response.data);
                } else {
                     // Xử lý trường hợp dữ liệu rỗng hoặc không đúng định dạng
                     setError("Dữ liệu thống kê nhận được không hợp lệ.");
                }

                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", err);
                setError("Không thể tải dữ liệu thống kê.");
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // Mảng rỗng đảm bảo effect chỉ chạy một lần sau khi mount

    if (loading) {
        return <div>Đang tải dữ liệu thống kê...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    if (!stats) {
        return <div>Không có dữ liệu thống kê.</div>;
    }

    // Chuẩn bị dữ liệu cho biểu đồ
    // Recharts thường dùng mảng các objects, mỗi object là 1 điểm dữ liệu
    const chartData = [
        { name: 'Người dùng', count: stats.totalUsers ?? 0 },
        { name: 'Sản phẩm', count: stats.totalProducts ?? 0 },
        { name: 'Đơn hàng', count: stats.totalOrders ?? 0 },
        // Doanh thu có giá trị lớn, không phù hợp hiển thị cùng biểu đồ cột này
    ];

    return (
        <div className="stats-dashboard p-6"> {/* Thêm padding */}
            <h2 className="text-2xl font-bold mb-6">Bảng Thống Kê</h2> {/* Thêm style cho tiêu đề */}

            {/* Khu vực hiển thị các số liệu dạng thẻ */}
            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Sử dụng grid và gap */}
                <div className="stat-item bg-white p-4 shadow rounded-lg text-center"> {/* Style cho thẻ */}
                    <h3 className="text-lg font-semibold text-gray-600">Tổng số người dùng</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers ?? 'N/A'}</p>
                </div>
                <div className="stat-item bg-white p-4 shadow rounded-lg text-center">
                    <h3>Tổng số sản phẩm</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalProducts ?? 'N/A'}</p>
                </div>
                <div className="stat-item bg-white p-4 shadow rounded-lg text-center">
                    <h3>Tổng số đơn hàng</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalOrders ?? 'N/A'}</p>
                </div>
                <div className="stat-item bg-white p-4 shadow rounded-lg text-center">
                    <h3>Tổng doanh thu</h3>
                    <p className="text-3xl font-bold text-yellow-600">{typeof stats.totalRevenue === 'number' ? stats.totalRevenue.toLocaleString('vi-VN') + ' VND' : 'N/A'}</p>
                </div>
            </div>

            {/* Khu vực hiển thị biểu đồ */}
            <div className="chart-container bg-white p-4 shadow rounded-lg">
                 <h3 className="text-lg font-semibold text-gray-600 mb-4">Thống kê số lượng</h3>
                 {/* ResponsiveContainer giúp biểu đồ tự điều chỉnh kích thước */}
                 <ResponsiveContainer width="100%" height={300}>
                     <BarChart
                        data={chartData} // Dữ liệu biểu đồ
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                     >
                        <CartesianGrid strokeDasharray="3 3" /> {/* Đường lưới */}
                        <XAxis dataKey="name" /> {/* Trục X hiển thị tên ('Người dùng', 'Sản phẩm',...) */}
                        <YAxis /> {/* Trục Y hiển thị giá trị (count) */}
                        <Tooltip /> {/* Hiển thị thông tin khi di chuột */}
                        <Legend /> {/* Chú giải */}
                        {/* Cột biểu đồ. dataKey="count" lấy giá trị từ trường 'count' trong chartData */}
                        <Bar dataKey="count" fill="#8884d8" name="Số lượng" />
                     </BarChart>
                 </ResponsiveContainer>
            </div>

        </div>
    );
};

export default StatsDashboard;