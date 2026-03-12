const Role = require('../models/Role');
const User = require('../models/User');

// Get all roles (excluding soft deleted)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get role by ID (id field, not _id)
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ id: req.params.id });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const roleData = req.body;
    
    // Check if role with same id exists
    const existing = await Role.findOne({ id: roleData.id });
    if (existing) {
      return res.status(400).json({ message: 'Role with this ID already exists' });
    }
    
    const role = new Role(roleData);
    await role.save();
    
    res.status(201).json({
      message: 'Role created successfully',
      role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update role by ID
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete role (set deletedAt)
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { id: req.params.id },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role deleted successfully (soft delete)', role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users in a specific role
exports.getUsersByRole = async (req, res) => {
  try {
    // First check if role exists
    const role = await Role.findOne({ id: req.params.id });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    // Find all users with this role ID
    const users = await User.find({ role: role._id }).populate('role');
    
    res.json({
      role: role,
      userCount: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
