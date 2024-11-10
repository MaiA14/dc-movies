const movieService = require('./movieService');
const redisService = require('./redisService');

class MoviePollingService {
    startMoviePolling() {
        setInterval(async () => {
            const movie = await movieService.fetchMovie();
            if (movie) {
                await redisService.storeMovie(movie);
                console.log('Fetched and stored new movie:', movie);
            } else {
                console.log('Movie API failed to return data...');
            }
        }, 5000);  
    }
}

module.exports = new MoviePollingService(); 