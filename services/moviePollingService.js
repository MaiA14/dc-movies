const { fetchMovie } = require('./movieService');
const { storeMovie } = require('./redisService');

const startMoviePolling = () => {
    setInterval(async () => {
        const movie = await fetchMovie();
        if (movie) {
            await storeMovie(movie);
            console.log('Fetched and stored new movie:', movie);
        } else {
            console.log('Movie API failed to return data...');
        }
    }, 5000);  
};

module.exports = { startMoviePolling };
