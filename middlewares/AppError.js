function errorMiddleware (error, req, res, next) {
    const status = error.statusCode || 500;
    const message = error.message || 'Something went wrong!';

    res.status(status).json({
        status, 
        message
    }); 
}


export default errorMiddleware;