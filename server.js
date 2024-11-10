const express = require('express');
const { getRobust, getArchive } = require('./controllers/movieController');
const { startMoviePolling } = require('./services/moviePollingService');

const app = express();
const { PORT } = require('./config/config');

startMoviePolling();

app.get('/movies/robust', getRobust);
app.get('/movies/archive', getArchive);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});