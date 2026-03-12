const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: 'https://i.sstatic.net/l60Hf.png'
  },
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  loginCount: {
    type: Number,
    default: 0,
    min: 0
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'creationAt',
    updatedAt: 'updatedAt'
  }
});

// Soft delete index
userSchema.index({ deletedAt: 1 });

// Pre find hook to filter out soft deleted documents
userSchema.pre('find', function() {
  this.where({ deletedAt: null });
});

userSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});

userSchema.pre('findOneAndDelete', function() {
  // Convert findOneAndDelete to soft delete
  if (!this.getOptions().force) {
    this.findOneAndUpdate({}, { $set: { deletedAt: new Date() } });
    return this.model.findOne(this.getFilter());
  }
});

module.exports = mongoose.model('User', userSchema);
