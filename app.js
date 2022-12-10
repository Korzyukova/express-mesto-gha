const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63915665826a3a9209886047',
  };

  next();
});
app.use(routes);
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');
