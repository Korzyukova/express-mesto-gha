const Card = require('../models/card');

const {
  NotFoundError404,
  RemoveCardError403,
} = require('../middlewares/errorHandlers');

const errorMsg404 = 'Карточка с указанным _id не найден';
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
  Card.deleteOne({
    _id: cardId,
    owner: userId,
  })
    .then(async (cards) => {
      if (cards.deletedCount === 0) {
        const c = await Card.findOne({
          _id: cardId,
        });
        if (c) {
          throw new RemoveCardError403(errorMsg403);
        } else {
          throw new NotFoundError404(errorMsg404);
        }
      } else {
        res.send({ data: true });
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
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
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
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
};
