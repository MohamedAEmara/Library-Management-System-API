import prisma from '../DB/db.js';
import { lowerEmail } from '../utils/lowerEmail.js';
import emailValidator from 'email-validator';

export const createBorrower = async (req, res, next) => {
    try {
        let { name, email } = req.body;
        if(!name || !email) {
            const error = new Error('Please insert your name & email');
            error.statusCode = 400;
            return next(error);
        }

        // lowercase email to make it case insensitive..
        email = lowerEmail(email);

        // Validate email before querying...
        if(!emailValidator.validate(email)) {
            const error = new Error('Please enter a valid email to register a new borrower.');
            error.statusCode = 400;
            return next(error);
        }

        // Validate provided email is unique:
        const usedEmail = await prisma.borrower.findFirst({
            where: {
                email
            }
        });

        if(usedEmail) {
            const error = new Error('A borrower with this email already exists');
            error.statusCode = 400;
            return next(error);
        }

        const borrower = await prisma.borrower.create({
            data: {
                name,
                email
            }
        });

        res.status(200).json({
            status: 'success',
            borrower
        });
    } catch (err) {
        next(err);
    }
}


export const getSingleBorrorwer = async (req, res, next) => {
    try {
        const id = req.params.borrowerID;
        const borrower = await prisma.borrower.findFirst({
            where: {
                id
            }
        });
        
        if(!borrower) {
            const error = new Error('There is no borrower with this ID');
            error.statusCode = 400;
            return next(error);
        } 

        res.status(200).json({
            status: 'success',
            borrower
        });
    } catch (err) {
        next(err);
    }
}



export const getAllBorrowers = async (req, res, next) => {
    try {
        const borrowers = await prisma.borrower.findMany();

        res.status(200).json({
            status: 'success',
            borrowers
        });
    } catch (err) {
        next(err);
    }
}


export const deleteBorrower = async (req, res, next) => {
    try {
        const id = req.params.borrowerID;
        const borrower = await prisma.borrower.findFirst({
            where: {
                id
            }
        });

        if(!borrower) {
            const error = new Error('There is no borrower with this ID.');
            error.statusCode = 400;
            return next(error);
        }

        await prisma.borrower.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            status: 'success',
            message: 'Borrower deleted successfully'
        });
    } catch (err) {
        next(err);
    }
}


export const updateBorrower = async (req, res, next) => {
    try {
        const id = req.params.borrowerID;
        let { email, name } = req.body;

        const borrower = await prisma.borrower.findFirst({
            where: {
                id
            }
        });

        // lowercase email to make it case insensitive..
        if(email)
            email = lowerEmail(email);
        
        // Validate email before querying...
        if(!emailValidator.validate(email)) {
            const error = new Error('Please enter a valid email to register a new borrower.');
            error.statusCode = 400;
            return next(error);
        }

        if(!borrower) {
            const error = new Error('There is no borrower with this ID.');
            error.statusCode = 400;
            return next(error);
        }

        // Validate if the brovided email isn't taken...
        const takenEmail = await prisma.borrower.findFirst({
            where: {
                email
            }
        });

        // Check if the user added (email) field in "body" && it's not taken before.
        if(email && takenEmail) {
            const error = new Error('Email you entered is taken.');
            error.statusCode = 400;
            return next(error); 
        }


        // keep data not specified in req.body as is.
        const newData = {
            name: name !== undefined ? name : borrower.name,
            email: email !== undefined ? email : borrower.email
        };

        const updatedBorrower = await prisma.borrower.update({
            where: {
                id
            },
            data: newData        
            
        });

        res.status(200).json({
            status: 'success',
            borrower: updatedBorrower
        });
    } catch (err) {
        next(err);
    }
}