import { Router } from "express";
import { checkoutBook, getAllBorrowings, returnBook } from "../controllers/borrowingControllers.js";
const router = Router();



// Route for checking out a book
router.post('/:bookISBN', checkoutBook);

// Route for returning a book
router.post('/return/:bookISBN', returnBook);

// Router for getting all borrower books
router.get('/borrowings', getAllBorrowings);



export default router;