import { Router } from "express";
import { checkoutBook, getAllBorrowings, returnBook, getOverdue } from "../controllers/borrowingControllers.js";
const router = Router();



// Route for checking out a book
router.post('/checkout/:bookISBN', checkoutBook);

// Route for returning a book
router.post('/return/:bookISBN', returnBook);

// Router for getting all borrower books
router.get('/borrowings', getAllBorrowings);

// Router for getting books that are overdue & by whom
router.get('/overdue', getOverdue);



export default router;