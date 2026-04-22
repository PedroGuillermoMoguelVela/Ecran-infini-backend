const express = require('express');
const { recordSearch, getSearchHistory, deleteSearchEntry, clearSearchHistory } = require('../controllers/searchHistoryController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, recordSearch);
router.get('/', auth, getSearchHistory);
router.delete('/:id', auth, deleteSearchEntry);
router.delete('/', auth, clearSearchHistory);

module.exports = router;
