import experss from 'express';
const router = experss.Router();
import { createBook, getSingleBook, getAllBooks, updateBook, deleteBook, searchBooks } from '../controllers/bookControllers.js';

router
    .route('/')
    .get(getAllBooks)
    .post(createBook);

router.get('/search', searchBooks);

router    
    .route('/:bookID')
    .get(getSingleBook)
    .patch(updateBook)
    .delete(deleteBook);


export default router;