const axios = require('axios');
const { MOVIE_API, RETRY_COUNT } = require('../config/config');

class MovieService {
    constructor() {
        this.retries = RETRY_COUNT;
    }

    async fetchMovie(retries = this.retries) {
        let attempts = 0;
        while (attempts < retries) {
            try {
                const response = await axios.get(MOVIE_API, { timeout: 5000 });
                return response.data;  
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} to fetch movie failed: ${error.message}`);
                if (attempts >= retries) {
                    return null;
                }
            }
        }
    }
}

module.exports = new MovieService(); 