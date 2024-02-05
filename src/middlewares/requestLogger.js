const requestLoggerMiddleware = (req, res, next) => {
    console.log(req.method, req.path, '-body: ', req.body);
    next();
}

export default requestLoggerMiddleware;