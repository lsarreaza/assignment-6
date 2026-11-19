const express = require('express');
require('dotenv').config();

const triviabookRoutes = require('./routes/triviabookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/triviabook', triviabookRoutes);

app.listen(PORT, () => {
  console.log(`Triviabook API listening on port ${PORT}`);
});