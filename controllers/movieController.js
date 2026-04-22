const Movie = require('../models/movies');

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ title: 1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
    }

    const movies = await Movie.find({
      $text: { $search: q }
    }).sort({ score: { $meta: 'textScore' } });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getAllMovies, searchMovies, getMovieById };
