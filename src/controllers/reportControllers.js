import prisma from "../DB/db.js";
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

async function exportToCSV(borrowings, folder) {
    try {
        // Add timestamp of now() to file name to create unique reports..
        const csvFilePath = `./dist/${folder}/reports${Date.now()}.csv`;   

        const csvHeaders = [ 
            { id: 'id', title: 'ID' },
            { id: 'author', title: 'Book Title' },
            { id: 'isbn', title: 'Author' },
            { id: 'bookName', title: 'ISBN' },
            { id: 'borrowerName', title: 'Borrower Name' },
            { id: 'borrowerEmail', title: 'Borrower Email' },
            { id: 'borrowingDate', title: 'Borrowing Date' },
            { id: 'dueDate', title: 'Due Date' },
            { id: 'returnDate', title: 'Return Date' },
            { id: 'returned', title: 'Returned'}
        ];

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: csvFilePath,
            header: csvHeaders
        });

        // Write data to CSV
        await csvWriter.writeRecords(borrowings);

        console.log('CSV file has been created successfully!');
    } catch (error) {
        console.error('Error exporting to CSV:', error);
    }
}

export const getCSVReport = async (req, res, next) => {
    try {
        // startDate, endDate      ==>     req.body
        const { startDate, endDate } = req.body;
        if(!startDate || !endDate) {
            const error = new Error('Please insert all reqired fields in request body { startDate, endDate }');
            error.statusCode = 400;
            return next(error);
        }

        // Include all books that borrowed after startDate and before endDate  
        const borrowings = await prisma.borrowing.findMany({
            where: {
                borrowingDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            include: {
                borrower: true,
                book: true
            }
        }); 

        // Edit borrowings to match CSV headers...
        let modifiedBorrowings = [];
        borrowings.forEach(borrowing => {
            const tmp = {
                id: borrowing.id,
                author: borrowing.book.author,
                isbn: borrowing.bookISBN,
                bookName: borrowing.book.name,
                borrowerName: borrowing.borrower.name,
                borrowerEmail: borrowing.borrower.email,
                borrowingDate: borrowing.borrowingDate,
                dueDate: borrowing.dueDate,
                returnDate: borrowing.returnDate,
                returned: borrowing.returnDate === null ? false : true 
            };
            modifiedBorrowings.push(tmp);
        })
        
        await exportToCSV(modifiedBorrowings, "reports"); // Call function to export to CSV
        res.status(200).json({
            status: 'success',
            message: 'CSV file created successfully with the following date',
            borrowings: modifiedBorrowings
        });
    } catch (err) {
        next(err);
    }
}



export const getLastMonthOverdue = async (req, res, next) => {
    try {
        // Get the start_date of the interval (Date.now() - milliseconds in one month)
        const lastMonth = new Date (Date.now() - new Date(30 * 24 * 60 * 60 * 1000));

        const overdues = await prisma.borrowing.findMany({
            where: {
                returnDate: null,
                dueDate: {
                    gte: lastMonth
                }
            },
            include: {
                book: true,
                borrower: true
            }
        });

        let modifiedBorrowings = [];
        overdues.forEach(borrowing => {
            const tmp = {
                id: borrowing.id,
                author: borrowing.book.author,
                isbn: borrowing.bookISBN,
                bookName: borrowing.book.name,
                borrowerName: borrowing.borrower.name,
                borrowerEmail: borrowing.borrower.email,
                borrowingDate: borrowing.borrowingDate,
                dueDate: borrowing.dueDate,
                returnDate: borrowing.returnDate,
                returned: borrowing.returnDate === null ? false : true 
            };
            modifiedBorrowings.push(tmp);
        })
        
        await exportToCSV(modifiedBorrowings, "lastMonthOverdue"); // Call function to export to CSV
        res.status(200).json({
            status: 'success',
            message: 'CSV file created successfully with the following date',
            overdues: modifiedBorrowings
        });
    } catch (err) {
        next(err);
    }

}


export const getLastMonthBorrowings = async (req, res, next) => {
    try {
        // Get the start_date of the interval (Date.now() - milliseconds in one month)
        const lastMonth = new Date (Date.now() - new Date(30 * 24 * 60 * 60 * 1000));

        const borrowings = await prisma.borrowing.findMany({
            where: {
                borrowingDate: {
                    gte: lastMonth
                }
            },
            include: {
                book: true,
                borrower: true
            }
        });

        let modifiedBorrowings = [];
        borrowings.forEach(borrowing => {
            const tmp = {
                id: borrowing.id,
                author: borrowing.book.author,
                isbn: borrowing.bookISBN,
                bookName: borrowing.book.name,
                borrowerName: borrowing.borrower.name,
                borrowerEmail: borrowing.borrower.email,
                borrowingDate: borrowing.borrowingDate,
                dueDate: borrowing.dueDate,
                returnDate: borrowing.returnDate,
                returned: borrowing.returnDate === null ? false : true 
            };
            modifiedBorrowings.push(tmp);
        })
        
        await exportToCSV(modifiedBorrowings, "lastMonthBorrowings"); // Call function to export to CSV

        res.status(200).json({
            status: 'success',
            message: 'CSV file created successfully with the following date',
            borrowings: modifiedBorrowings
        });
    } catch (err) {
        next(err);
    }
}