import MoviesDAO from "../dao/movies.dao.js"

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
}
