import experss from 'express';
const router = experss.Router();
import { createBook, getSingleBook, getAllBooks, updateBook } from '../controllers/bookControllers.js';

router
    .route('/')
    .get(getAllBooks)
    .post(createBook);

router    
    .route('/:bookID')
    .get(getSingleBook)
    .patch(updateBook);
    
export default router;