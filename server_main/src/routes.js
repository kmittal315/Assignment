const express = require('express');
const { getRows, addRow, updateRow, deleteRow } = require('./controllers');

const router = express.Router();

router.get('/data', getRows);
router.post('/data', addRow);
router.put('/data/:id', updateRow);
router.delete('/data/:id', deleteRow);

module.exports = router;
