const express = require('express');
const cors = require('cors');
const morgan = 'morgan';
const connectDB = require('./utils/db');


const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// express CORS
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use(express.json());


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/sales', salesRoutes);

app.use((err, _req, res, _next) => {
  // Fallback error handler to keep responses predictable.
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
};

start();
