const notFound404 = (res) => {
  res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
};
const notFound400 = (res) => {
  res.status(400).send({
    message: 'Переданы некорректные данные при создании карточки',
  });
};

const notFound401 = (res) => {
  res.status(401).send({
    message: 'Пользователь не найден',
  });
};

const notFound403 = (res) => {
  res.status(403).send({
    message: 'Удаление карточки другого пользователя',
  });
};

const notFound500 = (res) => {
  res.status(500).send({ message: 'Ошибка по умолчанию' });
};

const notFound409 = (res) => {
  res.status(409).send({ message: 'Такой пользователь уже существует' });
};

const ErrorHandler = (err, res) => {
  if (err.code === 400) {
    notFound400(res);
  } else if (err.code === 401) {
    notFound401(res);
  } else if(err.code === 403) {
    notFound403(res);
  } if (err.code === 404) {
    notFound404(res);
  } else if (err.code === 11000) {
    notFound409(res);
  } else {
    notFound500(res);
  }
};

module.exports = ErrorHandler;
