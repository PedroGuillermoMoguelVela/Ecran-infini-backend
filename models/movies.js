const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  review: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  director: { type: String, default: '' },
  year: { type: Number, default: 0 },
  genre: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

//búsquedas por título
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;