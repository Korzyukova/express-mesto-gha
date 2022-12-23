const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
  createUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/:userId', getUserId);

module.exports = router;
