/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '63915665826a3a9209886047',
//   };

//   next();
// });

app.use(routes);
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

const { PORT = 3000 } = process.env;

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');
