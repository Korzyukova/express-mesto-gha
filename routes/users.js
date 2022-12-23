const router = require('express').Router();
const {
  // createUser,
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
// router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/:userId', getUserId);

module.exports = router;
