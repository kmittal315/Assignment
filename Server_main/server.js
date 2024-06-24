const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models/spreadsheetData');
const spreadsheetRoutes = require('./routes/spreadsheetRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/data', spreadsheetRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
