const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
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
roleSchema.index({ deletedAt: 1 });

// Pre find hook to filter out soft deleted documents
roleSchema.pre('find', function() {
  this.where({ deletedAt: null });
});

roleSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});

roleSchema.pre('findOneAndDelete', function() {
  // Convert findOneAndDelete to soft delete
  if (!this.getOptions().force) {
    this.findOneAndUpdate({}, { $set: { deletedAt: new Date() } });
    return this.model.findOne(this.getFilter());
  }
});

module.exports = mongoose.model('Role', roleSchema);
