import express from 'express';
import { getBasicStats } from '../controllers/statsController.js';

const statsRouter = express.Router();

// Định nghĩa endpoint GET để lấy thống kê cơ bản
statsRouter.get('/basic', getBasicStats);

export default statsRouter;