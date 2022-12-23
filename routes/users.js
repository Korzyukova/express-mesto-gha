const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/:userId', getUserId);

module.exports = router;
