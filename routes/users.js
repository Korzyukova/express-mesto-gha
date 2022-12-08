const router = require("express").Router();
const { createUser, getUsers, getUserId, updateUser, updateUserAvatar} = require("../controllers/users");

router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/users/:userId", getUserId);

router.patch("users/me", updateUser);
router.patch("users/me/avatar", updateUserAvatar);

module.exports = router;
