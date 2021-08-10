const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

const app = express();
dotenv.config();
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/rs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('database connection successfully'))
  .catch((err) => console.log(err));

app.use('/todo', todoHandler);
app.use('/user', userHandler);

const errorHandler = (err, req, res, next) => {
  if (res.handlersSend) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

app.listen(3000, () => {
  console.log('app listening at port 3000');
});
