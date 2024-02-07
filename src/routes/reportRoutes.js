import { Router } from "express";
import { getCSVReport } from "../controllers/reportControllers.js";
const router = Router();


router.get('/csv', getCSVReport);

export default router;