import prisma from '../DB/db.js';

export const createBook = async (req, res, next) => {
    try {
        const { title, author, ISBN, location, quantity = 0 } = req.body;

        if(!title || !author || !ISBN || !location) {
            const error = new Error('Missing one or more required fileds { title, author, ISBN, location }');
            error.statusCode = 400;
            return next(error);
        }

        // Ensuring that the new created book has a uniuque ISBN..
        const usedISBN = await prisma.book.findFirst({
            where: {
                ISBN
            }
        });
        
        if(usedISBN) {
            const error = new Error("There's another book with same ISBN.");
            error.statusCode = 400;
            return next(error);
        }
        
        // Create a new book..
        const book = await prisma.book.create({
            data: {
                title,
                ISBN,
                author,
                location,
                quantity
            }
        });

        res.status(200).json({
            status: 'success',
            book  
        })
    } catch (err) {
        next(err);
    }
}


export const updateBook = async (req, res, next) => {
    try {
        const id = req.params.bookID;
        
        const book = await prisma.book.findFirst({
            where: {
                id
            }
        });

        // Return error 400 if bookID is not a valid book id..
        if(!book) {
            const error = new Error('There is no book with this ID.');
            error.statusCode = 400;
            return next(error);
        }

        const { title, author, ISBN, location, quantity } = req.body;
        
        // Ensuring that the new new ISBN is not used before..
        // NOTE: ensure that ISBN is present in (body) before querying in Book model for more optimization..
        const usedISBN = (ISBN !== undefined && await prisma.book.findFirst({
            where: {
                ISBN
            }
        }));
 
        if(usedISBN) {
            const error = new Error("There's another book with same ISBN.");
            error.statusCode = 400;
            return next(error);
        }

        // keep data not specified in req.body as is.
        const newData = {
            title: title !== undefined ? title : book.title,
            author: author !== undefined ? author : book.author,
            ISBN: ISBN !== undefined ? ISBN : book.ISBN,
            location: location !== undefined ? location : book.location,
            quantity: quantity !== undefined ? quantity : book.quantity
        };        


        const updatedBook = await prisma.book.update({
            where: {
                id
            },
            data: newData
        });

        res.status(200).json({
            status: 'sucess',
            book: updatedBook
        });
    } catch (err) {
        next(err);
    }
}



export const getSingleBook = async (req, res, next) => {
    try {
        const id = req.params.bookID;
        const book = await prisma.book.findFirst({
            where: {
                id
            }
        });
    
        if(!book) {
            const error = new Error('There is no book with this ID.');
            error.statusCode = 400;
            return next(error);
        }    

        res.status(200).json({
            status: 'success',
            book
        })
    } catch (err) {
        next(err);
    }
}


export const getAllBooks = async (req, res, next) => {
    try {
        const books = await prisma.book.findMany();
        res.status(200).json({
            status: 'success',
            books
        });
    } catch (err) {
        next(err);
    }
}


export const deleteBook = async (req, res, next) => {
    try {
        const id = req.params.bookID;
        const book = await prisma.book.findFirst({
            where: {
                id
            }
        });
    
        if(!book) {
            const error = new Error('There is no book with this ID.');
            error.statusCode = 400;
            return next(error);
        }    
         
        res.status(200).json({
            status: 'success',
            message: 'Book deleted successfully'
        });
    } catch (err) {
        next(err);
    }
}


export const searchBooks = async (req, res, next) => {
    try {
        const { title, isbn, author } = req.query;
        console.log(title, isbn, author);
        const books = await prisma.book.findMany({
            where: {
                AND: [
                    // All query fields are case insensitive
                    { title: { contains: title || "", mode: 'insensitive' } },
                    { author: { contains: author || "", mode: 'insensitive' }},
                    { ISBN: { contains: isbn || '', mode: 'insensitive'}}   
                ]
            }
        });

        res.status(200).json({
            status: 'success',
            books
        });
    } catch (err) {
        next(err);
    }
}