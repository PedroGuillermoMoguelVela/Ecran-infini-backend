const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  addedAt: { type: Date, default: Date.now }
});

//  evitar duplicados
favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });
const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;