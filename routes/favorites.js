const express = require('express');
const { addFavorite, getUserFavorites, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, addFavorite);
router.get('/', auth, getUserFavorites);
router.get('/check/:movieId', auth, checkFavorite);
router.delete('/:movieId', auth, removeFavorite);

module.exports = router;
