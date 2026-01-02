const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  timing: [{
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Before Food', 'After Food']
  }],
  duration: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  }
});

const prescriptionSchema = new mongoose.Schema({
   doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
  doctor: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    registration_no: {
      type: String,
      required: true,
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
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },

  patient: {
    baby_id: {
      type: String,
      required: true,
      ref: 'Baby'
    },
    name: {
      type: String,
      required: true
    },
    age_days: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    parent_phone: {
      type: String,
      required: true
    },
    parent_email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },

  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  diagnosis_summary: {
    type: String,
    required: true
  },

  medicines: [medicineSchema],

  advice: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
prescriptionSchema.index({ 'patient.baby_id': 1 });
prescriptionSchema.index({ createdAt: -1 });
prescriptionSchema.index({ assessment_id: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);