const mongoose = require('mongoose');
const Role = require('./models/Role');
const User = require('./models/User');
require('dotenv').config();

const connectDB = require('./config/db');

async function migrateData() {
  try {
    await connectDB();
    
    // Get all roles
    const roles = await Role.find({});
    console.log(`Found ${roles.length} roles`);
    
    // Create a map of role id (string) to ObjectID
    const roleIdMap = {};
    roles.forEach(role => {
      roleIdMap[role._id.toString()] = role._id;
    });
    
    console.log('Role ID map:', roleIdMap);
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    let updatedCount = 0;
    
    // Update each user's role reference
    for (const user of users) {
      console.log(`\nProcessing user: ${user.username}`);
      console.log(`Current role:`, JSON.stringify(user.role));
      
      // Check if role is already an ObjectID
      if (user.role instanceof mongoose.Types.ObjectId) {
        console.log(`  -> Already ObjectID, skipping`);
        continue;
      }
      
      // If role is an embedded object with id field (from old data structure)
      if (user.role && typeof user.role === 'object' && user.role.id) {
        const roleIdStr = user.role.id;
        console.log(`  -> Found embedded role with id: ${roleIdStr}`);
        
        const roleObjectId = roleIdMap[roleIdStr];
        
        if (roleObjectId) {
          // Update to use ObjectID reference
          user.role = roleObjectId;
          await user.save();
          updatedCount++;
          console.log(`  -> Updated to ObjectID: ${roleObjectId}`);
        } else {
          console.log(`  -> ERROR: Role with id ${roleIdStr} not found in map`);
        }
      } else if (user.role && typeof user.role === 'string') {
        // If role is stored as a string ID
        const roleIdStr = user.role;
        console.log(`  -> Found string role id: ${roleIdStr}`);
        
        const roleObjectId = roleIdMap[roleIdStr];
        
        if (roleObjectId) {
          user.role = roleObjectId;
          await user.save();
          updatedCount++;
          console.log(`  -> Updated to ObjectID: ${roleObjectId}`);
        } else {
          console.log(`  -> ERROR: Role with id ${roleIdStr} not found in map`);
        }
      } else {
        console.log(`  -> No valid role found (role is: ${typeof user.role})`);
      }
    }
    
    console.log(`\nMigration complete! Updated ${updatedCount} users.`);
    
    // Verify the data
    const updatedUsers = await User.find({}).populate('role');
    console.log('\nSample user after migration:');
    console.log(JSON.stringify(updatedUsers[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateData();
