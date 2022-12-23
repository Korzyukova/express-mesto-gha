/* eslint-disable no-underscore-dangle */
const { default: mongoose } = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorHandler = require('../middlewares/errorHandler');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      ErrorHandler(err, res);
    });
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    ErrorHandler(
      {
        code: 400,
      },
      res,
    );
  } else {
    User.findById({
      _id: userId,
    })
      .then((users) => {
        if (!users) {
          ErrorHandler(
            {
              code: 404,
            },
            res,
          );
        } else {
          res.send(users);
        }
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
  }
};

module.exports.getMe = (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    ErrorHandler(
      {
        code: 400,
      },
      res,
    );
  } else {
    User.findById({
      _id: userId,
    })
      .then((users) => {
        if (!users) {
          ErrorHandler(
            {
              code: 404,
            },
            res,
          );
        } else {
          res.send(users);
        }
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
  }
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  isEmail(email);
  isStrongPassword(password);

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email,
        name,
        about,
        avatar,
        password: hash,
      })
        .then((user) => {
          const u = { ...user };
          delete u._doc.password;
          res.send({ data: u._doc });
        })
        .catch((err) => {
          ErrorHandler(err, res);
        });
    })
    .catch((err) => {
      ErrorHandler(err, res);
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

  User.findOneAndUpdate({ _id: req.user._id }, update, {
    runValidators: true,
    new: true,
  })
    .then(() => res.send(update))
    .catch((err) => {
      ErrorHandler(err, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const update = { avatar: req.body.avatar };
  User.findOneAndUpdate({ _id: req.user._id }, update, {
    runValidators: true,
    new: true,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      ErrorHandler(err, res);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        ErrorHandler(
          {
            code: 401,
          },
          res,
        );
      } else {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
          ErrorHandler(
            {
              code: 401,
            },
            res,
          );
        } else {
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
            expiresIn: '7d',
          });
          res.send({ token });
        }
      }
    })
    .catch((err) => {
      ErrorHandler(err, res);
    });
};
