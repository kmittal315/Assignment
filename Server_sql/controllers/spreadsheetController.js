const { SpreadsheetData } = require('../models/spreadsheetData');

const getAllData = async (req, res) => {
  try {
    const data = await SpreadsheetData.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createData = async (req, res) => {
  try {
    const newData = await SpreadsheetData.create(req.body);
    res.json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await SpreadsheetData.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedData = await SpreadsheetData.findOne({ where: { id } });
      res.status(200).json(updatedData);
    }
    throw new Error('Data not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SpreadsheetData.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
    }
    throw new Error('Data not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllData,
  createData,
  updateData,
  deleteData,
};
