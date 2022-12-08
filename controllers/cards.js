const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res
          .status(500)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({
    _id: req.params.cardId,
  })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res
          .status(500)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res
          .status(500)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res
          .status(500)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
  }
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res
          .status(500)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    });
};
