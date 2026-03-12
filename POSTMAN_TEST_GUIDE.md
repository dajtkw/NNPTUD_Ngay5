# Postman Testing Guide

## Base URL
```
http://localhost:3000
```

## 1. ROLE ENDPOINTS

### 1.1 Get All Roles
- **Method**: GET
- **URL**: `http://localhost:3000/api/roles`
- **Expected**: Returns array of all roles (excluding soft deleted)

### 1.2 Get Role by ID
- **Method**: GET
- **URL**: `http://localhost:3000/api/roles/r1`
- **Expected**: Returns role with id "r1"
- **Try IDs**: r1, r2, r3

### 1.3 Create New Role
- **Method**: POST
- **URL**: `http://localhost:3000/api/roles`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "id": "r4",
  "name": "Test Role",
  "description": "Test description"
}
```
- **Expected**: Creates role and returns created role object

### 1.4 Update Role
- **Method**: PUT
- **URL**: `http://localhost:3000/api/roles/r4`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Updated Role Name",
  "description": "Updated description"
}
```
- **Expected**: Updates role and returns updated object

### 1.5 Soft Delete Role
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/roles/r4`
- **Expected**: Sets deletedAt timestamp and returns deleted role
- **Note**: Role will not appear in GET all after deletion (soft delete)

---

## 2. USER ENDPOINTS

### 2.1 Get All Users
- **Method**: GET
- **URL**: `http://localhost:3000/api/users`
- **Expected**: Returns array of all users with populated role information

### 2.2 Get User by Username
- **Method**: GET
- **URL**: `http://localhost:3000/api/users/nguyenvana`
- **Expected**: Returns user with username "nguyenvana"
- **Try usernames**: nguyenvana, tranthib, levanc

### 2.3 Create New User
- **Method**: POST
- **URL**: `http://localhost:3000/api/users`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "newuser",
  "password": "123456",
  "email": "newuser@example.com",
  "fullName": "New User",
  "avatarUrl": "https://i.sstatic.net/l60Hf.png",
  "status": true,
  "loginCount": 0,
  "role": "r3"
}
```
- **Note**: role field accepts role ID string (r1, r2, r3, etc.)
- **Expected**: Creates user and returns created user with populated role

### 2.4 Update User
- **Method**: PUT
- **URL**: `http://localhost:3000/api/users/newuser`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "fullName": "Updated Name",
  "status": false,
  "loginCount": 5
}
```
- **Expected**: Updates user and returns updated user with populated role

### 2.5 Soft Delete User
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/users/newuser`
- **Expected**: Sets deletedAt timestamp and returns deleted user
- **Note**: User will not appear in GET all after deletion (soft delete)

---

## 3. SPECIAL ENDPOINTS

### 3.1 Enable User
- **Method**: POST
- **URL**: `http://localhost:3000/api/users/enable`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "thid@gmail.com",
  "username": "phamthid"
}
```
- **Expected**: Sets user status to true and returns updated user
- **Note**: Both email and username are required and must match

### 3.2 Disable User
- **Method**: POST
- **URL**: `http://localhost:3000/api/users/disable`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "thid@gmail.com",
  "username": "phamthid"
}
```
- **Expected**: Sets user status to false and returns updated user

### 3.3 Get Users by Role ID
- **Method**: GET
- **URL**: `http://localhost:3000/api/roles/r1/users`
- **Expected**: Returns role info, user count, and array of users with that role
- **Try IDs**: r1 (2 users), r2 (3 users), r3 (5 users)

---

## 4. TESTING SCENARIOS

### Scenario 1: Complete Role-User Flow
1. Create new role: POST `/api/roles` with `{ "id": "test", "name": "Test" }`
2. Create user with that role: POST `/api/users` with `"role": "test"`
3. Get all users: GET `/api/users` - verify user has role populated
4. Get users by role: GET `/api/roles/test/users` - verify user appears
5. Update user: PUT `/api/users/{username}`
6. Enable/Disable user: POST `/api/users/enable` or `/disable`
7. Delete user: DELETE `/api/users/{username}`
8. Delete role: DELETE `/api/roles/test`

### Scenario 2: Test Soft Delete
1. Create test user
2. GET `/api/users` - verify user exists
3. DELETE `/api/users/{username}`
4. GET `/api/users` - verify user is NOT in list (soft deleted)
5. GET `/api/users/{username}` - should return 404 (filtered by soft delete)

### Scenario 3: Test Role Reference
1. GET `/api/users` - observe role is embedded object (populated)
2. Create user with role ID string: `"role": "r1"`
3. Verify response has full role object with all fields

---

## 5. IMPORTANT NOTES

- **Soft Delete**: Documents are not actually removed. `deletedAt` field is set to current date. All find queries automatically filter out soft-deleted documents.
- **Role Reference**: Users collection stores role as ObjectID reference. When creating/updating users, you can pass role as string ID (e.g., "r1") and it will be automatically converted to ObjectID.
- **Timestamps**: All models use custom timestamp field names: `creationAt` and `updatedAt` instead of default `createdAt` and `updatedAt`.
- **Unique Constraints**: 
  - Role `id` field must be unique
  - User `username` and `email` must be unique
- **Enable/Disable**: These endpoints require BOTH email and username to match a user. They update the `status` field (boolean).

---

## 6. SAMPLE DATA FOR TESTING

### Existing Roles:
- r1: Quản trị viên
- r2: Biên tập viên
- r3: Người dùng

### Existing Users:
- nguyenvana (status: true, role: r1)
- tranthib (status: true, role: r2)
- levanc (status: true, role: r3)
- phamthid (status: false, role: r3) - can test enable
- hoanganh (status: true, role: r3)
- dangminh (status: true, role: r2)
- phamkhoa (status: true, role: r3)
- truonglinh (status: false, role: r3)
- doquang (status: true, role: r2)
- ngocanh (status: true, role: r1)

---

## 7. POSTMAN COLLECTION TIP

Create a Postman collection with these folders:
1. **Roles** - all role endpoints
2. **Users** - all user endpoints
3. **Special** - enable/disable and get users by role

Set environment variable:
- `baseUrl` = `http://localhost:3000`

Then use URLs like: `{{baseUrl}}/api/roles`
