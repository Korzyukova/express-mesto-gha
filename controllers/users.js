const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const notFound404 = (res) => {
  res.status(404).send({ message: 'Пользователь не найден' });
};
const notFound400 = (res) => {
  res.status(400).send({
    message: 'Переданы некорректные данные при создании пользователя',
  });
};
const notFound500 = (res) => {
  res.status(500).send({ message: 'Ошибка по умолчанию' });
};

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      if (users.length < 1) {
        notFound404(res);
      } else {
        res.send({ data: users });
      }
    })
    .catch(() => {
      notFound500(res);
    });
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    notFound400(res);
  } else {
    User.findById({
      _id: userId,
    })
      .then((users) => {
        if (users.length < 1) {
          notFound404(res);
        } else {
          res.send(users);
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        notFound400(res);
      } else {
        notFound500(res);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const update = {};

  const { name, about } = req.body;

  if (name) {
    update.name = name;
  }

  if (about) {
    update.about = about;
  }

  User.updateOne({ _id: req.user._id }, update, { runValidators: true })
    .then(() => res.send(update))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        notFound400(res);
      } else if (err.name === 'CastError') {
        notFound400(res);
      } else {
        notFound500(res);
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const update = { avatar: req.body.avatar };
  User.updateOne(
    { _id: req.user._id },
    update,
    { runValidators: true },
    { new: true },
  )
    .then(() => res.status(200).send(update))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        notFound400(res);
      } else if (err.name === 'CastError') {
        notFound400(res);
      } else {
        notFound500(res);
      }
    });
};
