import { Router } from 'express';

import MoviesController from '../controllers/movies.controller.js';

const router = Router();

router.get('/movies', MoviesController.apiGetMovies);

export default router;