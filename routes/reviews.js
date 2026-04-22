const express = require('express');
const { addReview, getMovieReviews, getUserReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, addReview);
router.get('/movie/:movieId', getMovieReviews);
router.get('/user', auth, getUserReviews);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;
