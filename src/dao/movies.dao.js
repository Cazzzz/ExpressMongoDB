let movies;
let mflix;
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]]

class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return
        }
        try {
            mflix = await conn.db(process.env.DB_NAME);
            movies = await mflix.collection("movies");
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in moviesDAO: ${e}`);
        }
    }

    static async getMovies(query = {}, project = {}, sort = DEFAULT_SORT, page = 0, moviesPerPage = 20) {
        let cursor;
        try {
            cursor = await movies.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    
        const displayCursor = cursor.skip(moviesPerPage*page).limit(moviesPerPage);
    
        try {
            const moviesList = await displayCursor.toArray();
            const totalNumMovies = (page === 0) ? await movies.countDocuments(query) : 0;
        
            return { moviesList, totalNumMovies }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { moviesList: [], totalNumMovies: 0 }
        }
    }
};

export default MoviesDAO;