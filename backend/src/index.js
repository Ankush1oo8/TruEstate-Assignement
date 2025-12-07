const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { loadSalesData } = require('./utils/csvLoader');
const salesRoutes = require('./routes/salesRoutes');
const { setSalesData } = require('./services/salesService');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/sales', salesRoutes);

app.use((err, _req, res, _next) => {
  // Fallback error handler to keep responses predictable.
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

const start = () => {
  const csvPath = path.join(__dirname, '..', 'data', 'truestate_assignment_dataset.csv');
  const data = loadSalesData(csvPath);
  setSalesData(data);

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
};

start();
