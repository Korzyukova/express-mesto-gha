const notFound404 = (res) => {
  res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
};
const notFound400 = (res) => {
  res.status(400).send({
    message: 'Переданы некорректные данные при создании карточки',
  });
};
const notFound500 = (res) => {
  res.status(500).send({ message: 'Ошибка по умолчанию' });
};

const notFound409 = (res) => {
  res.status(409).send({ message: 'Такой пользователь уже существуетю' });
};

const ErrorHandler = (err, res) => {
  if (err.code === 400) {
    notFound400(res);
  } else if (err.code === 404) {
    notFound404(res);
  } else if (err.code === 1100) {
    notFound409(res);
  } else {
    notFound500(res);
  }
};

module.exports = ErrorHandler;
