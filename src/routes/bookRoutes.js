import experss from 'express';
const router = experss.Router();
import { createBook, getSingleBook, getAllBooks, updateBook, deleteBook } from '../controllers/bookControllers.js';

router
    .route('/')
    .get(getAllBooks)
    .post(createBook);

router    
    .route('/:bookID')
    .get(getSingleBook)
    .patch(updateBook)
    .delete(deleteBook);

export default router;