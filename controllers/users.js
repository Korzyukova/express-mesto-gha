/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  AuthorizationError401,
  NotFoundError404,
  UserExistsError409,
} = require('../middlewares/errorHandlers');

const errorMsg404 = 'Пользователь с указанным _id не найден';
const errorMsg401 = 'Ошибка авторизации';
const errorMsg409 = 'Такой пользователь уже существует';

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById({
    _id: userId,
  })
    .then((users) => {
      if (!users) {
        throw new NotFoundError404(errorMsg404);
      }

      res.send(users);
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById({
    _id: userId,
  })
    .then((users) => {
      if (!users) {
        throw new NotFoundError404(errorMsg404);
      } else {
        res.send(users);
      }
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  await User.findOne({
    email,
  }).then((user) => {
    if (user) {
      throw new UserExistsError409(errorMsg409);
    }
  })
    .catch(next);

  const hash = await bcrypt.hash(password, 10).catch(next);
  const user = await User.create({
    email,
    name,
    about,
    avatar,
    password: hash,
  }).catch(next);
  const u = { ...user };
  delete u._doc.password;
  res.send({ data: u._doc });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const update = { name, about };
  User.findOneAndUpdate({ _id: req.user._id }, update, {
    runValidators: true,
    new: true,
  })
    .then(() => res.send(update))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const update = { avatar: req.body.avatar };
  User.findOneAndUpdate({ _id: req.user._id }, update, {
    runValidators: true,
    new: true,
  })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        throw new AuthorizationError401(errorMsg401);
      } else {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
          throw new AuthorizationError401(errorMsg401);
        } else {
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
            expiresIn: '7d',
          });
          res.send({ token });
        }
      }
    })
    .catch(next);
};
