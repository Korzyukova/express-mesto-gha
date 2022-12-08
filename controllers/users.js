const { default: mongoose } = require("mongoose");
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length < 1) {
        res.status(404).send("Пользователь не найден");
      }

      res.send({ data: users });
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

module.exports.getUserId = (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
  }
  User.find({
    _id: req.params.userId,
  })
    .then((users) => {
      if (users.length < 1) {
        res.status(404).send("Пользователь не найден");
      }
      res.send({ data: users });
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
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

module.exports.updateUser = (req, res) => {
  const update = {};

  const { name, about, avatar } = req.body;

  if (name) {
    update.name = name;
  }

  if (about) {
    update.about = about;
  }

  if (avatar) {
    update.avatar = avatar;
  }

  User.updateOne({ _id: req.user._id }, update, { runValidators: true })
    .then((user) => res.send(update))
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

module.exports.updateUserAvatar = (req, res) => {
  const update = { avatar: req.body.avatar };
  User.updateOne({ _id: req.user._id }, update, { runValidators: true })
    .then((user) => res.status(200).send(update))
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
