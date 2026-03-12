const User = require('../models/User');
const Role = require('../models/Role');

// Get all users (excluding soft deleted)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by username
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if user with same username exists
    const existing = await User.findOne({ username: userData.username });
    if (existing) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }
    
    // Check if role exists if role is provided as id
    if (userData.role) {
      const role = await Role.findOne({ id: userData.role });
      if (role) {
        userData.role = role._id;
      }
    }
    
    const user = new User(userData);
    await user.save();
    
    const populatedUser = await User.findById(user._id).populate('role');
    
    res.status(201).json({
      message: 'User created successfully',
      user: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user by username
exports.updateUser = async (req, res) => {
  try {
    const updateData = req.body;
    
    // If role is provided as string id, convert to ObjectId
    if (updateData.role && typeof updateData.role === 'string') {
      const role = await Role.findOne({ id: updateData.role });
      if (role) {
        updateData.role = role._id;
      }
    }
    
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      updateData,
      { new: true, runValidators: true }
    ).populate('role');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete user (set deletedAt)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully (soft delete)', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enable user (set status to true)
exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }
    
    const user = await User.findOneAndUpdate(
      { email, username },
      { $set: { status: true } },
      { new: true }
    ).populate('role');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and username' });
    }
    
    res.json({ message: 'User enabled successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Disable user (set status to false)
exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }
    
    const user = await User.findOneAndUpdate(
      { email, username },
      { $set: { status: false } },
      { new: true }
    ).populate('role');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and username' });
    }
    
    res.json({ message: 'User disabled successfully', user });
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
