const express = require('express');
require('dotenv').config();

const triviabookRoutes = require('./routes/triviabookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/triviabook', triviabookRoutes);

app.get('/', (req, res) => {
  res.send('My Triviabook API is running');
});

app.listen(PORT, () => {
  console.log(`My Triviabook API listening on port ${PORT}`);
});