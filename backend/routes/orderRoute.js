import express from 'express';
import { placeOrder, placeOrderVNPay, verifyVNPay, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/vnpay', authUser, placeOrderVNPay);

// User Feature 
orderRouter.post('/userorders', authUser, userOrders);

// Verify payment
orderRouter.get('/verifyVNPay', verifyVNPay);

export default orderRouter;