const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length < 1){
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" });
      }
      res.send({ data: cards })
    })
    .catch(() => res.status(500).send({ message: "Запрашиваемый пользователь не найден" }));
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({
    _id: req.params.cardId,
  })
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Запрашиваемый пользователь не найден" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Запрашиваемый пользователь не найден" }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Запрашиваемый пользователь не найден" }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: "Запрашиваемый пользователь не найден" }));
}