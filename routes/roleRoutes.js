const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET all roles
router.get('/', roleController.getAllRoles);

// Get all users in a specific role (must be BEFORE /:id to avoid conflict)
router.get('/:id/users', roleController.getUsersByRole);

// GET role by ID
router.get('/:id', roleController.getRoleById);

// CREATE new role
router.post('/', roleController.createRole);

// UPDATE role by ID
router.put('/:id', roleController.updateRole);

// Soft delete role
router.delete('/:id', roleController.deleteRole);

module.exports = router;
