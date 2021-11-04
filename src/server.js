import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.router.js';
import accountsRouter from './routes/accounts.router.js';
import transactionsRouter from './routes/transactions.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/transactions', transactionsRouter);

export default app;