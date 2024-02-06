import prisma from '../DB/db.js';
import { lowerEmail } from '../utils/lowerEmail.js';

export const checkoutBook = async (req, res, next) => {
    try {
        // bookISBN               ===>        req.params
        // borrowerID & due data  ===>        req.body

        const bookISBN = req.params.bookISBN;
        const book = await prisma.book.findFirst({
            where: {
                ISBN: bookISBN
            }
        });

        if(!book) {
            const error = new Error('There is no book with this ISBN.');
            error.statusCode = 400;
            return next(error);
        }

        if(book.quantity === 0) {
            const error = new Error('Sorry, this book is currently unavailable!');
            error.statusCode = 500;
            return next(error);
        }

        let { borrowerID, dueDate } = req.body;
        if(!borrowerID || !dueDate) {
            const error = new Error('Missing one or more required fileds { borrowerID, dueDate }');
            error.statusCode = 400;
            return next(error);
        }

        // Convert the value of (dueDate) to "Date" to be match dueDate in (Borrowing Model)
        dueDate = new Date(dueDate);

        const borrower = await prisma.borrower.findFirst({
            where: {
                id: borrowerID
            },
            include: {
                Borrowing: true
            }
        });
        if(!borrower) {
            const error = new Error('There is no borrower with this id');
            error.statusCode = 400;
            return next(error);
        }


        // Check if this user has already a copy of this book:
        let hasCopy = 0;
        (borrower.Borrowing).forEach(borrowing => {
            if(borrowing.bookISBN === bookISBN)
                hasCopy = 1;
        });
        
        if(hasCopy === 1) {
            const error = new Error('You cannot borrow more than one copy of the same book.');
            error.statusCode = 400;
            return next(error);
        }


        // >>>>>>>>>>>>>>>> If there's no error, START checkout part <<<<<<<<<<<<<<
        console.log(typeof(dueDate));

        // 1- create a borrowing record.
        const borrowing = await prisma.borrowing.create({
            data: {
                book: {
                    connect: {
                        ISBN: book.ISBN
                    }
                },
                borrower: {
                    connect: {
                        id: borrower.id
                    }
                },
                dueDate: dueDate.toISOString()
            },
            // Include book_title & borrower_name in response...
            include: {
                borrower: {
                    select: {
                        name: true
                    }
                },
                book: {
                    select: {
                        title: true
                    }
                }
            }
        });

        // 2- decrement quantity of this book.
        await prisma.book.update({
            where: {
                id: book.id
            },
            data: {
                quantity: {
                    decrement: 1
                }
            }
        })

        res.status(200).json({
            status: 'success',
            borrowing
        });
    } catch (err) {
        next(err);
    }
}