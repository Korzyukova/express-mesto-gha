/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const routes = require('./routes');
const { createUser, login } = require('./controllers/users');

const app = express();
app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '63915665826a3a9209886047',
//   };

//   next();
// });
// 1) Middleware

// 2) Routes
app.use(routes);

app.use('/cards', require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required().pattern(/^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().email().required().pattern(/^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).uri(),
  }),
}), createUser);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

// 3) Catch All (404)
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

// 4) Define port and start server
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Connect to database
mongoose.connect('mongodb://localhost:27017/mestodb');
