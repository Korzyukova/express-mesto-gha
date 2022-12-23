const router = require('express').Router();

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
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateUserAvatar);
router.get('/users/:userId', auth, getUserId);

module.exports = router;
