// backend/src/controllers/doctor.controller.js - NEW FILE
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRE = '7d';

/**
 * REGISTER DOCTOR
 * POST /api/doctor/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, registration_no, clinic_name, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !registration_no || !clinic_name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { registration_no }]
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: existingDoctor.email === email 
          ? 'Email already registered' 
          : 'Registration number already exists'
      });
    }

    // Create new doctor
    const doctor = new Doctor({
      name,
      email,
      password,
      registration_no,
      clinic_name,
      phone,
      address
    });

    await doctor.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: doctor._id, email: doctor.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      token,
      doctor: doctor.toJSON()
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * LOGIN DOCTOR
 * POST /api/doctor/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find doctor
    const doctor = await Doctor.findOne({ email }).select('+password');

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await doctor.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: doctor._id, email: doctor.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      doctor: doctor.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * GET DOCTOR PROFILE
 * GET /api/doctor/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor: doctor.toJSON()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * UPDATE DOCTOR PROFILE
 * PUT /api/doctor/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, clinic_name, phone, address } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctor.id,
      { name, clinic_name, phone, address },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor: doctor.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};