import { Router } from "express";
import { checkoutBook, returnBook } from "../controllers/borrowingControllers.js";
const router = Router();



// Route for checking out a book
router.post('/:bookISBN', checkoutBook);

// Route for returning a book
router.post('/return/:bookISBN', returnBook);



export default router;