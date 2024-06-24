const express = require('express');
const {
  getAllData,
  createData,
  updateData,
  deleteData,
} = require('../controllers/spreadsheetController');

const router = express.Router();

router.get('/', getAllData);
router.post('/', createData);
router.put('/:id', updateData);
router.delete('/:id', deleteData);

module.exports = router;
