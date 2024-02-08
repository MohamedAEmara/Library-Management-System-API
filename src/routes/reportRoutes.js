import { Router } from "express";
import { getCSVReport, getLastMonthOverdue, getLastMonthBorrowings } from "../controllers/reportControllers.js";
const router = Router();


router.get('/overdue', getLastMonthOverdue);
router.get('/borrowing', getLastMonthBorrowings);
router.get('/', getCSVReport);
export default router;