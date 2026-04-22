const SearchHistory = require('../models/searchHistory');

const recordSearch = async (req, res) => {
  try {
    const { query, resultsCount } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Consulta de búsqueda requerida' });
    }

    const searchEntry = new SearchHistory({
      user: req.user._id,
      query: query.trim(),
      resultsCount: resultsCount || 0
    });

    await searchEntry.save();
    res.status(201).json(searchEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const searchHistory = await SearchHistory.find({ user: req.user._id })
      .sort({ searchedAt: -1 })
      .limit(limit);

    res.json(searchHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const deleteSearchEntry = async (req, res) => {
  try {
    const searchEntry = await SearchHistory.findById(req.params.id);

    if (!searchEntry) {
      return res.status(404).json({ message: 'Entrada de historial no encontrada' });
    }

    if (searchEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta entrada' });
    }

    await searchEntry.deleteOne();
    res.json({ message: 'Entrada eliminada del historial' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const clearSearchHistory = async (req, res) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id });
    res.json({ message: 'Historial de búsquedas limpiado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { recordSearch, getSearchHistory, deleteSearchEntry, clearSearchHistory };
