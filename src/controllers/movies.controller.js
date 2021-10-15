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
}
