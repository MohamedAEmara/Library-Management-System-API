import express from 'express';
import dotenv from 'dotenv';
import requestLoggerMiddleware from './middlewares/requestLogger.js';
import errorMiddleware from './middlewares/appError.js';
import bookRouter from './routes/bookRoutes.js';
import borrowerRouter from "./routes/borrowerRoutes.js";
import borrowingRouter from "./routes/borrowingRoutes.js";
import reportsRouter from './routes/reportRoutes.js';
dotenv.config({ path: '.env' });
const app = express();

app.use(express.json());
app.use(requestLoggerMiddleware);

app.use('/api/v1/book', bookRouter);
app.use('/api/v1/borrower', borrowerRouter);
app.use('/api/v1/borrow', borrowingRouter);
app.use('/api/v1/reports', reportsRouter);

// Error handler middleware must be after all routes to call it as (next) to avoid throwing errors.
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const baseURL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://127.0.0.1';

app.listen(port, () => {
    console.log(`App is running on port ${port} with base URL ${baseURL}`);
})