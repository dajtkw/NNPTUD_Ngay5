const mongoose = require('mongoose');
const Role = require('./models/Role');
const User = require('./models/User');
require('dotenv').config();

const connectDB = require('./config/db');

async function importData() {
  try {
    await connectDB();
    
    // Clear existing data
    await Role.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    
    // Import roles first
    const rolesData = [
      {
        id: 'r1',
        name: 'Quản trị viên',
        description: 'Toàn quyền quản lý hệ thống',
        creationAt: '2026-03-04T08:00:00.000Z',
        updatedAt: '2026-03-04T08:00:00.000Z'
      },
      {
        id: 'r2',
        name: 'Biên tập viên',
        description: 'Quản lý nội dung và dữ liệu',
        creationAt: '2026-03-04T08:00:00.000Z',
        updatedAt: '2026-03-04T08:00:00.000Z'
      },
      {
        id: 'r3',
        name: 'Người dùng',
        description: 'Tài khoản người dùng thông thường',
        creationAt: '2026-03-04T08:00:00.000Z',
        updatedAt: '2026-03-04T08:00:00.000Z'
      }
    ];
    
    const roles = await Role.insertMany(rolesData);
    console.log(`Imported ${roles.length} roles`);
    
    // Create a map of role id (string) to ObjectID
    const roleIdMap = {};
    roles.forEach(role => {
      roleIdMap[role.id] = role._id;
      console.log(`Role: ${role.name} (id: ${role.id} -> ObjectId: ${role._id})`);
    });
    
    // Import users with role references
    const usersData = [
      {
        username: 'nguyenvana',
        password: '123456',
        email: 'vana@gmail.com',
        fullName: 'Nguyễn Văn A',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 15,
        role: roleIdMap['r1'],
        creationAt: '2026-03-04T08:10:00.000Z',
        updatedAt: '2026-03-04T08:10:00.000Z'
      },
      {
        username: 'tranthib',
        password: '123456',
        email: 'thib@gmail.com',
        fullName: 'Trần Thị B',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 7,
        role: roleIdMap['r2'],
        creationAt: '2026-03-04T08:11:00.000Z',
        updatedAt: '2026-03-04T08:11:00.000Z'
      },
      {
        username: 'levanc',
        password: '123456',
        email: 'vanc@gmail.com',
        fullName: 'Lê Văn C',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 3,
        role: roleIdMap['r3'],
        creationAt: '2026-03-04T08:12:00.000Z',
        updatedAt: '2026-03-04T08:12:00.000Z'
      },
      {
        username: 'phamthid',
        password: '123456',
        email: 'thid@gmail.com',
        fullName: 'Phạm Thị D',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: false,
        loginCount: 0,
        role: roleIdMap['r3'],
        creationAt: '2026-03-04T08:13:00.000Z',
        updatedAt: '2026-03-04T08:13:00.000Z'
      },
      {
        username: 'hoanganh',
        password: '123456',
        email: 'anh@gmail.com',
        fullName: 'Hoàng Anh',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 2,
        role: roleIdMap['r3'],
        creationAt: '2026-03-04T08:14:00.000Z',
        updatedAt: '2026-03-04T08:14:00.000Z'
      },
      {
        username: 'dangminh',
        password: '123456',
        email: 'minh@gmail.com',
        fullName: 'Đặng Minh',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 9,
        role: roleIdMap['r2'],
        creationAt: '2026-03-04T08:15:00.000Z',
        updatedAt: '2026-03-04T08:15:00.000Z'
      },
      {
        username: 'phamkhoa',
        password: '123456',
        email: 'khoa@gmail.com',
        fullName: 'Phạm Quốc Khoa',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 1,
        role: roleIdMap['r3'],
        creationAt: '2026-03-04T08:16:00.000Z',
        updatedAt: '2026-03-04T08:16:00.000Z'
      },
      {
        username: 'truonglinh',
        password: '123456',
        email: 'linh@gmail.com',
        fullName: 'Trương Linh',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: false,
        loginCount: 0,
        role: roleIdMap['r3'],
        creationAt: '2026-03-04T08:17:00.000Z',
        updatedAt: '2026-03-04T08:17:00.000Z'
      },
      {
        username: 'doquang',
        password: '123456',
        email: 'quang@gmail.com',
        fullName: 'Đỗ Quang',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 4,
        role: roleIdMap['r2'],
        creationAt: '2026-03-04T08:18:00.000Z',
        updatedAt: '2026-03-04T08:18:00.000Z'
      },
      {
        username: 'ngocanh',
        password: '123456',
        email: 'ngocanh@gmail.com',
        fullName: 'Ngọc Anh',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        loginCount: 6,
        role: roleIdMap['r1'],
        creationAt: '2026-03-04T08:19:00.000Z',
        updatedAt: '2026-03-04T08:19:00.000Z'
      }
    ];
    
    const users = await User.insertMany(usersData);
    console.log(`Imported ${users.length} users`);
    
    console.log('\nData import completed successfully!');
    console.log(`Total roles: ${roles.length}`);
    console.log(`Total users: ${users.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  }
}

importData();
