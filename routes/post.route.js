const express = require('express');
const { getUserPosts, createPost, getPost, getAllPosts, getSavedPosts } = require('../controllers/post.controller');
const { verifyUser } = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/properties/all', getAllPosts);
router.get('/properties', verifyUser, getUserPosts);
router.get('/savedposts/:id', verifyUser, getSavedPosts);
router.post('/:id', verifyUser, createPost);
router.get('/properties/:id', getPost);

module.exports = router;