const express = require('express');
const router = express.Router();

const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { verifyUser } = require("../middlewares/verifyToken");
const { save } = require('../controllers/save.controller');

router.get('/users', getUsers);
router.route('/:id')
    .get(verifyUser, getUser)
    .put(verifyUser, updateUser)
    .delete(verifyUser, deleteUser)

//saving post
router.post('/save/:postId', save);

module.exports = router;

