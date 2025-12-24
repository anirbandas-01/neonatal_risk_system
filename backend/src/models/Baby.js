const mongoose = require('mongoose');


const assessmentSchema = new mongoose.Schema({
    assessmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    healthParameters: {
        birthWeight: {
            type: Number,
            required: true,
            min: 1.0,
            max:6.0
        },
        birthLength: {
            type: Number,
            required: true,
            min:35,
            max:60
        },
        headCircumference: {
            type: Number,
            required: true,
            min:25,
            max:42
        },
        temperature: {
            type: Number,
            required: true,
            min:35.0,
            max:40.0
        },
        heartRate: {
            type: Number,
            required: true,
            min:80,
            max:200
        },
        respiratoryRate: {
            type: Number,
            required: true,
            min: 20,
            max: 80
        },
        jaundiceLevel: {
            type: Number,
            required: true,
            min: 0,
            max: 25
        },
        bloodGlucose: {
            type: Number,
            required: true,
            min: 1.0,
            max: 10.0
        },
        oxygenSaturation: {
            type: Number,
            required: true,
            min: 70,
            max: 100
        },
        apgarScore: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },
        birthDefects: {
            type: String,
            enum: ['No', 'Yes', 'Some distress'],
            required: true
        },
        normalReflexes: {
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        immunizations: {
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


babySchema.pre('save', function(next){
    if (this.assessments && this.assessments.length > 0) {
        this.totalVisits = this.assessments.length;

        const lastAssessment = this.assessments[this.assessments.length - 1];
        this.lastVisitDate = lastAssessment.assessmentDate;
        this.currentRiskLevel = lastAssessment.riskAssessment.finalRisk;
    }
    next();
});

const Baby = mongoose.model('Baby', babySchema);

module.exports = Baby;