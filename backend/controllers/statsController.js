import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';

const getBasicStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({});
        const totalProducts = await productModel.countDocuments({});
        const totalOrders = await orderModel.countDocuments({});
        const totalRevenueResult = await orderModel.aggregate([
            {
                $match: { payment: true }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};

export { getBasicStats };