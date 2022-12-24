const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getMe);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    password: Joi.string(),
    email: Joi.string().email().pattern(/^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).uri(),
  }),
}), updateUser);
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).uri({
      scheme: [
        /https?/,
      ],
    }),
  }),
}), updateUserAvatar);
router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserId);

module.exports = router;
