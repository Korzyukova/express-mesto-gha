const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

function notFound404(res) {
  res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
}
const notFound400 = (res) => {
  res.status(400).send({
    message: 'Переданы некорректные данные при создании карточки',
  });
};
const notFound500 = (res) => {
  res.status(500).send({ message: 'Ошибка по умолчанию' });
};

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      notFound500(res);
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    notFound400(res);
  } else {
    Card.deleteOne({
      _id: cardId,
    })
      .then((cards) => {
        if (cards.deletedCount === 0) {
          notFound404(res);
        } else {
          res.send({ data: cards });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          notFound400(res);
        } else {
          notFound500(res);
        }
      });
  }
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        notFound400(res);
      } else {
        notFound500(res);
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    notFound400(res);
  } else {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((cards) => {
        if (!cards) {
          notFound404(res);
        } else {
          res.send({ data: cards });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          notFound400(res);
        }
      });
  }
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    notFound400(res);
  } else {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((cards) => {
        if (!cards) {
          notFound404(res);
        } else {
          res.send({ data: cards });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          notFound400(res);
        } else {
          notFound500(res);
        }
      });
  }
};
