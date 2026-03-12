const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let database;
let rolesCollection, usersCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    database = client.db('your-database-name');
    rolesCollection = database.collection('roles');
    usersCollection = database.collection('users');
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// ============ ROLES CRUD ============

// GET all roles
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await rolesCollection.find().toArray();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET role by ID
app.get('/api/roles/:id', async (req, res) => {
  try {
    const role = await rolesCollection.findOne({ id: req.params.id });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new role
app.post('/api/roles', async (req, res) => {
  try {
    const roleData = req.body;
    
    // Check if role with same id exists
    const existing = await rolesCollection.findOne({ id: roleData.id });
    if (existing) {
      return res.status(400).json({ message: 'Role with this ID already exists' });
    }
    
    const result = await rolesCollection.insertOne(roleData);
    res.status(201).json({ 
      message: 'Role created successfully', 
      id: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE role by ID
app.put('/api/roles/:id', async (req, res) => {
  try {
    const result = await rolesCollection.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role updated successfully', role: result.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE role by ID
app.delete('/api/roles/:id', async (req, res) => {
  try {
    const result = await rolesCollection.findOneAndDelete({ id: req.params.id });
    
    if (!result.value) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ USERS CRUD ============

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user by ID (username)
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new user
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if user with same username exists
    const existing = await usersCollection.findOne({ username: userData.username });
    if (existing) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }
    
    const result = await usersCollection.insertOne(userData);
    res.status(201).json({ 
      message: 'User created successfully', 
      id: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user by ID (username)
app.put('/api/users/:username', async (req, res) => {
  try {
    const result = await usersCollection.findOneAndUpdate(
      { username: req.params.username },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user: result.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user by ID (username)
app.delete('/api/users/:username', async (req, res) => {
  try {
    const result = await usersCollection.findOneAndDelete({ username: req.params.username });
    
    if (!result.value) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SPECIAL REQUEST ============

// GET all users in a specific role
app.get('/api/roles/:id/users', async (req, res) => {
  try {
    // First check if role exists
    const role = await rolesCollection.findOne({ id: req.params.id });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    // Find all users with this role ID
    const users = await usersCollection
      .find({ 'role.id': req.params.id })
      .toArray();
    
    res.json({
      role: role,
      userCount: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});
