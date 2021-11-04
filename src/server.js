import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.router.js';
import customersRouter from './routes/customers.router.js';
import transactionsRouter from './routes/transactions.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersRouter);
app.use('/customers', customersRouter);
app.use('/transactions', transactionsRouter);

export default app;