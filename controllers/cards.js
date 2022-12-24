const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const ErrorHandler = require('../middlewares/errorHandler');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      ErrorHandler(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    ErrorHandler({
      code: 400,
    }, res);
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
              ErrorHandler({
                code: 403,
              }, res);
            } else {
              ErrorHandler({
                code: 404,
              }, res);
            }
          });
        } else {
          res.send({ data: cards });
        }
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
  }
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => {
      ErrorHandler(err, res);
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    ErrorHandler({
      code: 400,
    }, res);
  } else {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((cards) => {
        if (!cards) {
          ErrorHandler({
            code: 404,
          }, res);
        } else {
          res.send({ data: cards });
        }
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
  }
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    ErrorHandler({
      code: 400,
    }, res);
  } else {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((cards) => {
        if (!cards) {
          ErrorHandler({
            code: 404,
          }, res);
        } else {
          res.send({ data: cards });
        }
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
  }
};
