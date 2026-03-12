const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// GET user by username
router.get('/:username', userController.getUserByUsername);

// CREATE new user
router.post('/', userController.createUser);

// UPDATE user by username
router.put('/:username', userController.updateUser);

// Soft delete user
router.delete('/:username', userController.deleteUser);

// Enable user
router.post('/enable', userController.enableUser);

// Disable user
router.post('/disable', userController.disableUser);

module.exports = router;
