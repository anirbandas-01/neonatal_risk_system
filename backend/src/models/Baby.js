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
        required: true,
        min: 22,
        max: 42
    },

    birthWeightKg: {
        type: Number,
        required: true,
        min: 1.0,
        max: 6.0
    },

    birthLengthCm: {
        type: Number,
        required: true,
        min: 35,
        max: 60
    },

    birthHeadCircumferenceCm: {
        type: Number,
        required: true,
        min: 25,
        max: 42
    },

    ageDays: {
        type: Number,
        required: true,
        min: 0,
        max: 60
    },

    weightKg: {
        type: Number,
        required: true,
        min: 1.0,
        max: 6.0
    },

    lengthCm: {
        type: Number,
        required: true,
        min: 35,
        max: 65
    },

    headCircumferenceCm: {
        type: Number,
        required: true,
        min: 25,
        max: 45
    },

    temperatureC: {
        type: Number,
        required: true,
        min: 35.0,
        max: 40.0
    },

    heartRateBpm: {
        type: Number,
        required: true,
        min: 80,
        max: 200
    },

    respiratoryRateBpm: {
        type: Number,
        required: true,
        min: 20,
        max: 80
    },

    oxygenSaturation: {
        type: Number,
        required: true,
        min: 70,
        max: 100
    },

    feedingType: {
        type: String,
        enum: ['Breast', 'Formula', 'Mixed'],
        required: true
    },

    feedingFrequencyPerDay: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },

    urineOutputCount: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    },

    stoolCount: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    },

    jaundiceLevelMgDl: {
        type: Number,
        required: true,
        min: 0,
        max: 25
    },

    apgarScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },

    immunizationsDone: {
        type: String,
        enum: ['Yes', 'No'],
        required: true
    },

    reflexesNormal: {
        type: String,
        enum: ['Yes', 'No'],
        required: true
    }
    },

    riskAssessment: {
        finalRisk: {
            type: String,
            enum: ['Low Risk', 'Medium Risk', 'High Risk'],
            required: true
        },
        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        recommendations: [{
            type: String
        }],
        mlModelScore: {
            type: Number
        },
        lstmModelScore: {
            type: Number
        },
        ensembleScore: {
            type: Number
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



babySchema.index({ babyId: 1});
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