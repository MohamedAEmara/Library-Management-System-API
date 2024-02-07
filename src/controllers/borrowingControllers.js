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
                Borrowing: {
                    where: {
                        returnDate: null
                    }
                }
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
            if(borrowing.bookISBN === bookISBN && !borrowing.returnDate)
                hasCopy = 1;
        });
        
        if(hasCopy === 1) {
            const error = new Error('You cannot borrow more than one copy of the same book.');
            error.statusCode = 400;
            return next(error);
        }


        // >>>>>>>>>>>>>>>> If there's no error, START checkout part <<<<<<<<<<<<<<

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
                    increment: -1
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



export const returnBook = async (req, res, next) => {
    try {
        // bookISBN                 ===>        req.params
        // borrowerID               ===>        req.body
        const ISBN = req.params.bookISBN;
        const { borrowerID } = req.body;

        const book = await prisma.book.findFirst({
            where: {
                ISBN
            }
        });

        // Validate ISBN..
        if(!book) {
            const error = new Error('There is no book with this ISBN.');
            error.statusCode = 400;
            return next(error);
        }

        // Check if this user owns this book
        const borrower = await prisma.borrower.findFirst({
            where: {
                id: borrowerID
            },
            include: {
                Borrowing: true
            }
        });

        let hasCopy = 0;
        (borrower.Borrowing).forEach(borrowing => {
            if(borrowing.bookISBN === ISBN && borrowing.returnDate === null) {
                hasCopy = 1;
            }
        })

        if(!hasCopy) {
            const error = new Error("You cannot return a book you don't have.");
            error.statusCode = 400;
            return next(error);
        }

    
        // If this book is present in borrowings  &&  this book doesn't have a returnDate yet
        // Borrower can return this book
        // Otherwise, return error msg... 
        
        // Get the borrowingID of the owned book to update returnDate..
        let borrowingID;
        borrower.Borrowing.forEach(borrowing => {
            if(ISBN === borrowing.bookISBN && !borrowing.returnDate) {
                borrowingID = borrowing.id;
            }
        });
        
        
        // 1- Update the returnDate in borrowing table with Date.now()..
        const borrowing = await prisma.borrowing.update({
            where: {
                id: borrowingID
            },
            data: {
                returnDate: new Date(Date.now())
            }
        });

        // 2- Increment the remaining quantity of this book

        await prisma.book.update({
            where: {
                ISBN
            },
            data: {
                quantity: {
                    increment: 1
                }
            }
        })

        return res.status(200).json({
            status: 'success',
            borrowing
        });
    } catch (err) {
        next(err);
    }    
}


// Get all borrowed books the user still have.
export const getAllBorrowings = async (req, res, next) => {
    try {
        const { borrowerID } = req.body;

        if(!borrowerID) {
            const error = new Error('Please enter your ID to get all your borrowings.');
            error.statusCode = 400;
            return next(error);
        }
        const borrower = await prisma.borrower.findFirst({
            where: {
                id: borrowerID
            }
        });
 
        if(!borrower) {
            const error = new Error('There is no borrower with this ID.');
            error.statusCode = 400;
            return next(error);
        }

        // All things are good ==> return all borrowings..
        const borrowings = await prisma.borrowing.findMany({
            where: {
                AND: {
                    borrowerID,
                    returnDate: null
                }
            }
        });

        res.status(200).json({
            status: 'success',
            borrowings
        })
    } catch (err) {
        next(err);
    }
}



export const getOverdue = async (req, res, next) => {
    try {
        const dueBorrowings = await prisma.borrowing.findMany({
            where: {
                AND: {
                    returnDate: null,
                    // and dueDate is less than Date.now()
                    dueDate: {
                        lt: new Date(Date.now())
                    }
                }
            },
            // Aggregate book_title & borrower {name & email} for more human friendly response...
            include: {
                book: {
                    select: {
                        title: true
                    }
                },
                borrower: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        
        res.status(200).json({
            status: 'success',
            dueBorrowings
        })
    } catch (err) {
        next(err);
    }
}