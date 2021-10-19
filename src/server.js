import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.router.js';
import moviesRouter from './routes/movies.router.js';
import commentsRouter from './routes/comments.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use('/comments', commentsRouter);

export default app;