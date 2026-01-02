// backend/src/models/Doctor.js - NEW FILE
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  registration_no: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  clinic_name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+91\d{10}$/.test(v);
      },
    message: 'Phone number must be in format +91XXXXXXXXXX (10 digits after +91)'
  }
  },
  address: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    default: 'Pediatrician'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
/* doctorSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
}); */

doctorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



// Method to compare password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
doctorSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Doctor', doctorSchema);