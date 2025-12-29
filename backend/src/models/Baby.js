const mongoose = require('mongoose');


const assessmentSchema = new mongoose.Schema({
    assessmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    healthParameters: {
        gestationalAgeWeeks: {
            type: Number,
            required: true
        },

        birthWeightKg: {
            type: Number,
            required: true
        },

        birthLengthCm: {
            type: Number,
            required: true,
            
        },

        birthHeadCircumferenceCm: {
            type: Number,
            required: true,
            
        },

        ageDays: {
            type: Number,
            required: true,
            
        },

        weightKg: {
            type: Number,
            required: true,
            
        },

        lengthCm: {
            type: Number,
            required: true,
            
        },

        headCircumferenceCm: {
            type: Number,
            required: true,
            
        },

        temperatureC: {
            type: Number,
            required: true,
            
        },

        heartRateBpm: {
            type: Number,
            required: true,
            
        },

        respiratoryRateBpm: {
            type: Number,
            required: true,
            
        },

        oxygenSaturation: {
            type: Number,
            required: true,
            
        },

        feedingType: {
            type: String,
            enum: ['breast', 'formula', 'mixed'],
            required: true
        },

        feedingFrequencyPerDay: {
            type: Number,
            required: true,
            
        },

        urineOutputCount: {
            type: Number,
            required: true,
            
        },

        stoolCount: {
            type: Number,
            required: true,
            
        },

        jaundiceLevelMgDl: {
            type: Number,
            required: true,
            
        },

        apgarScore: {
            type: Number,
            required: true,
            
        },

        immunizationsDone: {
            type: String,
            enum: ['yes', 'no'],
            required: true
        },

        reflexesNormal: {
            type: String,
            enum: ['yes', 'no'],
            required: true
        }
    },

    riskAssessment: {
        finalRisk: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            required: true,
            
        },
        recommendations: [{
            type: String
        }],
        clinicalFlags: [{
          code: String,
          message: String,
          severity: String
       }],
       specificRisks: {
          infection_risk: String,
          respiratory_risk: String,
          feeding_risk: String,
          cardiovascular_risk: String
      }  
    },
     doctorNotes: {
        type: String,
        default: ''
    }
},{_id: true});




const babySchema = new mongoose.Schema({
    babyId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    babyInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], default: 'Unknown'
        }
    },

    parentInfo: {
        motherName: {
            type: String,
            required: true,
            trim: true
        },
        fatherName: {
            type: String,
            required: true,
            trim: true
        },
        contactNumber: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        address: {
            type: String,
            trim: true
        }
    },


    assessments: [assessmentSchema],

    totalVisits: {
        type: Number,
        default: 0
    } ,
    lastVisitDate: { 
        type: Date
    },
    currentRiskLevel: {
        type: String,
        enum: ['Low Risk', 'Medium Risk', 'High Risk']
    }
}, { timestamps: true})



//babySchema.index({ babyId: 1});
babySchema.index({ 'babyInfo.name': 1});
babySchema.index({ 'parentInfo.contactNumber': 1});
babySchema.index({ currentRiskLevel: 1});
babySchema.index({ lastVisitDate: -1});


babySchema.pre('save', async function(){
    console.log('🔥 pre-save hook running');
    if (this.assessments && this.assessments.length > 0) {
        this.totalVisits = this.assessments.length;

        const lastAssessment = this.assessments[this.assessments.length - 1];
        this.lastVisitDate = lastAssessment.assessmentDate;
        this.currentRiskLevel = lastAssessment.riskAssessment.finalRisk;
    }
    
});

const Baby = mongoose.model('Baby', babySchema);

module.exports = Baby;