const Review = require('../models/reviews');
const Movie = require('../models/movies');
const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    const existingReview = await Review.findOne({ user: req.user._id, movie: movieId });
    if (existingReview) {
      return res.status(400).json({ message: 'Ya has reseñado esta película' });
    }

    const review = new Review({ user: req.user._id, movie: movieId, rating, comment });
    await review.save();
    await review.populate('user', 'name email');
    await review.populate('movie', 'title');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};


const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};



const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('movie', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }


    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta reseña' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    await review.populate('user', 'name email');
    await review.populate('movie', 'title');
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {

      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (review.user.toString() !== req.user._id.toString()) {

      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reseña' });
    }

    await review.deleteOne();
    res.json({ message: 'Reseña eliminada' });
  } catch (error) {

    res.status(500).json({ message: 'Error del servidor' });

  }
};

module.exports = { addReview, getMovieReviews, getUserReviews, updateReview, deleteReview };
