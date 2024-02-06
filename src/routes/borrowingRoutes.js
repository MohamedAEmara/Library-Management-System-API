import { Router } from "express";
import { checkoutBook } from "../controllers/borrowingControllers.js";
const router = Router();



router.post('/:bookISBN', checkoutBook);












export default router;