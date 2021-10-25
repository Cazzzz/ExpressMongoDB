import { Router } from 'express';

import MoviesController from '../controllers/movies.controller.js';

const router = Router();

router.get('/', MoviesController.apiGetMovies);
router.get("/:id", MoviesController.apiGetMovieById);
router.post("/", MoviesController.apiPostMovie);

export default router;