const Favorite = require('../models/favorites');
const Movie = require('../models/movies');

const addFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    const existingFavorite = await Favorite.findOne({ user: req.user._id, movie: movieId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Esta película ya está en tus favoritos' });
    }

    const favorite = new Favorite({ user: req.user._id, movie: movieId });
    await favorite.save();
    await favorite.populate('movie', 'title review');

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('movie', 'title review imageUrl')
      .sort({ addedAt: -1 });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      movie: req.params.movieId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    res.json({ message: 'Eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id, movie: req.params.movieId });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { addFavorite, getUserFavorites, removeFavorite, checkFavorite };
