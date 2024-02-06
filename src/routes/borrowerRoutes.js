import experss from 'express';
const router = experss.Router();
import { createBorrower, deleteBorrower, getAllBorrowers, getSingleBorrorwer, updateBorrower } from '../controllers/borrowerController.js';


router
    .route('/')
    .get(getAllBorrowers)
    .post(createBorrower);

router    
    .route('/:borrowerID')
    .get(getSingleBorrorwer)
    .patch(updateBorrower)
    .delete(deleteBorrower);

export default router;