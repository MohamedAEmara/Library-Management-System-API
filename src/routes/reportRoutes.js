import { Router } from "express";
import { getCSVReport, getLastMonthOverdue } from "../controllers/reportControllers.js";
const router = Router();


router.get('/', getCSVReport);
router.get('/overdue', getLastMonthOverdue);
export default router;