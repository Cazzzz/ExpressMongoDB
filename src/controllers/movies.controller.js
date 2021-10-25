import MoviesDAO from "../dao/movies.dao.js";
import { User } from "./users.controller.js";

export default class MoviesController {
    static async apiGetMovies(req, res, next) {
        const MOVIES_PER_PAGE = 20
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies();
        let response = {
            movies: moviesList,
            page: 0,
            filters: {},
            entries_per_page: MOVIES_PER_PAGE,
            total_results: totalNumMovies,
        }
        res.json(response);
    }

    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {};
            let movie = await MoviesDAO.getMovieByID(id);
            if (!movie) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            let updated_type = movie.lastupdated instanceof Date ? "Date" : "other";
            res.json({ movie, updated_type });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiPostMovie(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const movieDoc = req.body.movie;
            const insertResponse = await MoviesDAO.addMovie(movieDoc);
            const movieId = insertResponse.insertedId;

            const updated = await MoviesDAO.getMovieByID(movieId);

            res.json({ status: "success", movie: updated });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }
}
