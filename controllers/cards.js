const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const {
  WrongDataError400,
  NotFoundError404,
  RemoveCardError403,
} = require('../middlewares/errorHandlers');

const errorMsg404 = 'Пользователь с указанным _id не найден';
const errorMsg400 = "Переданы некорректные данные при создании пользователя'";
const errorMsg403 = 'Удаление карточки другого пользователя';

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new WrongDataError400(errorMsg400);
  } else {
    Card.deleteOne({
      _id: cardId,
      owner: userId,
    })
      .then((cards) => {
        if (cards.deletedCount === 0) {
          Card.findOne({
            _id: cardId,
          }).then((c) => {
            if (c) {
              throw new RemoveCardError403(errorMsg403);
            } else {
              throw new NotFoundError404(errorMsg404);
            }
          });
        } else {
          res.send({ data: cards });
        }
      })
      .catch(next);
  }
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new WrongDataError400(errorMsg400);
  } else {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((cards) => {
        if (!cards) {
          throw new NotFoundError404(errorMsg404);
        } else {
          res.send({ data: cards });
        }
      })
      .catch(next);
  }
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new WrongDataError400(errorMsg400);
  } else {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((cards) => {
        if (!cards) {
          throw new NotFoundError404(errorMsg404);
        } else {
          res.send({ data: cards });
        }
      })
      .catch(next);
  }
};
