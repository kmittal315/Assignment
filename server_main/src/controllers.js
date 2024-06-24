const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRows = async (req, res) => {
  try {
    const rows = await prisma.row.findMany();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addRow = async (req, res) => {
  try {
    const newRow = await prisma.row.create({ data: req.body });
    res.json(newRow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRow = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRow = await prisma.row.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updatedRow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRow = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.row.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRows, addRow, updateRow, deleteRow };
