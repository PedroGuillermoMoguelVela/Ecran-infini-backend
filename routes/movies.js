const express = require('express');
const { getAllMovies, searchMovies, getMovieById } = require('../controllers/movieController');

const router = express.Router();

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

module.exports = router;
