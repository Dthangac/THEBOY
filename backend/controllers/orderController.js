import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from 'crypto';

// global variables
const currency = 'vnd';
const deliveryCharge = 100000000;

// VNPay configuration
const vnp_TmnCode = 'TREDTIVC';
const vnp_HashSecret = 'PNWSEINQN5239WKH4CEE4CF51XDPAYMI';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = 'http://localhost:5173/orders';

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing orders using VNPay Method
const placeOrderVNPay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "VNPay",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        const orderId = newOrder._id.toString();
        const amountVND = amount * 100;
        const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
        const createDate = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode,
            vnp_Amount: amountVND,
            vnp_CreateDate: createDate,
            vnp_CurrCode: currency.toUpperCase(),
            vnp_IpAddr: ipAddr,
            vnp_Locale: 'vn',
            vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
            vnp_OrderType: '250000',
            vnp_ReturnUrl,
            vnp_TxnRef: orderId
        };
        const sortedParams = Object.keys(vnpParams).sort().reduce((obj, key) => {
            obj[key] = vnpParams[key];
            return obj;
        }, {});
        const querystring = new URLSearchParams(sortedParams).toString();
        const signData = querystring.replace(/%20/g, '+');
        const hmac = crypto.createHmac('sha512', vnp_HashSecret);
        const vnp_SecureHash = hmac.update(signData).digest('hex');
        const vnpUrl = `${vnp_Url}?${querystring}&vnp_SecureHash=${vnp_SecureHash}`;
        res.json({ success: true, vnpUrl });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify VNPay
const verifyVNPay = async (req, res) => {
    try {
        const vnpParams = req.query;
        const secureHash = vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];
        const sortedParams = Object.keys(vnpParams).sort().reduce((obj, key) => {
            obj[key] = vnpParams[key];
            return obj;
        }, {});
        const querystring = new URLSearchParams(sortedParams).toString();
        const signData = querystring.replace(/%20/g, '+');
        const hmac = crypto.createHmac('sha512', vnp_HashSecret);
        const calculatedHash = hmac.update(signData).digest('hex');
        const orderId = vnpParams['vnp_TxnRef'];
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.redirect('/verify?success=false');
        }
        const userId = order.userId;
        if (secureHash === calculatedHash && vnpParams['vnp_ResponseCode'] === '00') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.redirect('/verify?success=true');
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.redirect('/verify?success=false');
        }
    } catch (error) {
        console.log(error);
        res.redirect('/verify?success=false');
    }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        // Lấy tham số page và limit từ body của request POST
        // Frontend của bạn đang gửi { page, limit } trong body.
        // Chuyển đổi sang số nguyên, cung cấp giá trị mặc định nếu không có
        const page = parseInt(req.body.page) || 1; // Mặc định trang 1
        const limit = parseInt(req.body.limit) || 5; // Mặc định 10 đơn hàng/trang (theo code frontend trước đó)

        // Tính toán số lượng đơn hàng cần bỏ qua (skip)
        const skipCount = (page - 1) * limit;

        // Lấy danh sách đơn hàng cho trang hiện tại
        // Sử dụng .skip() và .limit() của Mongoose
        // .sort({ date: -1 }) để danh sách đơn hàng mới nhất hiển thị trước
        const orders = await orderModel.find({})
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
            .skip(skipCount)
            .limit(limit);

        // Đếm tổng số lượng đơn hàng trong toàn bộ collection (không phân trang)
        const totalOrdersCount = await orderModel.countDocuments({});

        // Trả về cả danh sách đơn hàng của trang hiện tại và tổng số lượng
        res.json({
            success: true,
            orders: orders, // Danh sách đơn hàng của trang hiện tại
            totalOrdersCount: totalOrdersCount // Tổng số đơn hàng
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error); // Log lỗi chi tiết hơn
        res.json({ success: false, message: "Lỗi khi lấy danh sách đơn hàng" }); // Thông báo lỗi chung
    }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Đã cập nhật trạng thái' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderVNPay, verifyVNPay, allOrders, userOrders, updateStatus };