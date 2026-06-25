const express = require('express');
const cors = require('cors');

const authRoutes =
require('./routes/authRoute');

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  '/api/auth',
  authRoutes
);

app.get(
  '/',
  (req, res) => {
    res.send(
      'Auth System Backend API is running...'
    );
  }
);

module.exports = app;