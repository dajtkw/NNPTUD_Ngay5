const { MongoClient } = require('mongodb');
const fs = require('fs');

// Load data from data2.js
const data2Content = fs.readFileSync('./data2.js', 'utf8');

// Extract data arrays using regex
const dataRoleMatch = data2Content.match(/let dataRole = (\[[\s\S]*?\]);/);
const dataUserMatch = data2Content.match(/let dataUser = (\[[\s\S]*?\]);/);

if (!dataRoleMatch || !dataUserMatch) {
  console.error('Could not extract data from data2.js');
  process.exit(1);
}

const dataRole = eval(dataRoleMatch[1]);
const dataUser = eval(dataUserMatch[1]);

// MongoDB connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('your-database-name');
    
    // Import roles
    const rolesCollection = database.collection('roles');
    const existingRoles = await rolesCollection.countDocuments();
    
    if (existingRoles === 0) {
      await rolesCollection.insertMany(dataRole);
      console.log(`Imported ${dataRole.length} roles`);
    } else {
      console.log(`Roles collection already has ${existingRoles} documents, skipping...`);
    }

    // Import users
    const usersCollection = database.collection('users');
    const existingUsers = await usersCollection.countDocuments();
    
    if (existingUsers === 0) {
      await usersCollection.insertMany(dataUser);
      console.log(`Imported ${dataUser.length} users`);
    } else {
      console.log(`Users collection already has ${existingUsers} documents, skipping...`);
    }

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await client.close();
  }
}

importData();
