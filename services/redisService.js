const Redis = require('ioredis');
const { REDIS_HOST, MOVIES_LIMIT } = require('../config/config');
const redis = new Redis({ host: REDIS_HOST });

const storeMovie = async (movie) => {
    try {
        const movieData = {
            imdb_title_id: movie.imdb_title_id,
            title: movie.title,
        };

        const existingMovies = await redis.lrange('movies', 0, -1);
        const movieExists = existingMovies.some(existingMovie => {
            const parsedMovie = JSON.parse(existingMovie); // redis saves data as strings
            return parsedMovie.imdb_title_id === movieData.imdb_title_id; // avoid duplicates
        });

        if (!movieExists) {
            await redis.lpush('movies', JSON.stringify(movieData));
            const movieCount = await redis.llen('movies');
            if (movieCount > MOVIES_LIMIT) {
                await redis.ltrim('movies', 0, MOVIES_LIMIT - 1); // remove irrelevant data
            }

            console.log('Fetched and stored new movie:', movieData);
        } else {
            console.log('Movie already exists in the list:', movieData);
        }
    } catch (error) {
        console.error('Error storing movie:', error.message);
    }
};

const getMovies = async () => {
    try {
        const movies = await redis.lrange('movies', 0, -1);
        return movies.map(movie => {
            const parsedMovie = JSON.parse(movie);
            return {
                imdb_title_id: parsedMovie.imdb_title_id,
                title: parsedMovie.title,
            };
        });
    } catch (error) {
        console.error('Error fetching movies from cache:', error.message);
        return [];
    }
};

module.exports = {
    storeMovie,
    getMovies,
};