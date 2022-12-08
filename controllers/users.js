const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length < 1) {
        res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      res.send({ data: users });
    })
    .catch(() =>
      res.status(500).send({ message: "Запрашиваемый пользователь не найден" })
    );
};

module.exports.getUserId = (req, res) => {
  User.find({
    _id: req.params.userId,
  })
    .then((users) => {
      if (users.length < 1) {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      res.send({ data: users });
    })
    .catch(() =>
      res.status(500).send({ message: "Запрашиваемый пользователь не найден" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(400).send({
      message: "Переданы некорректные данные при создании пользователя.",
    });
  }
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
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

  if (!name && !about && !avatar) {
    res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
  }

  if (name) {
    update.name = name;
  }

  if (about) {
    update.about = about;
  }

  if (avatar) {
    update.avatar = avatar;
  }

  User.updateOne({ _id: req.body.userId }, update)
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res.status(500).send({ message: "Запрашиваемый пользователь не найден" })
    );
};

module.exports.updateUserAvatar = (req, res) => {
  if (!req.body.avatar) {
    res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
  }
  User.updateOne({ _id: req.body.userId }, { avatar: req.body.avatar })
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res.status(500).send({ message: "Запрашиваемый пользователь не найден" })
    );
};
