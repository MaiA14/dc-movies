const movieService = require('../services/movieService');
const redisService = require('../services/redisService');

class MovieController {
    async getRobust(req, res) {
        try {
            const movie = await movieService.fetchMovie(); // get latest movie

            if (movie) {
                res.json(movie);
            } else {
                const movies = await redisService.getMovies(); // take from cache if there is no movie
                if (movies.length > 0) {
                    res.json(movies[0]);
                } else {
                    res.status(404).json({ error: 'No movies available.' });
                }
            }
        } catch (error) {
            console.error('Error fetching movie:', error.message);
            res.status(500).json({ error: 'Internal Server Error.' });
        }
    }

    async getArchive(req, res) {
        try {
            const movies = await redisService.getMovies();
            res.json(movies);  
        } catch (error) {
            console.error('Error fetching movies', error.message);
            res.status(500).json({ error: 'Error retrieving movies' });
        }
    }
}

module.exports = new MovieController(); 