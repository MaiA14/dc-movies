const { fetchMovie } = require('../services/movieService');
const { getMovies } = require('../services/redisService');

const getRobust = async (req, res) => {
    try {
        const movie = await fetchMovie(); // get latest movie

        if (movie) {
            res.json(movie);
        } else {
            const movies = await getMovies(); // take from cache if there is no movie
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
};

const getArchive = async (req, res) => {
    try {
        const movies = await getMovies();
        res.json(movies);  
    } catch (error) {
        console.error('Error fetching movies', error.message);
        res.status(500).json({ error: 'Error retrieving movies' });
    }
};

module.exports = { getRobust, getArchive };