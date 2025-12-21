const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
    babyId: {
        type: String,
        required:true,
        unique:true,
        trim:true
    },

    assessmentDate: {
        type: Date,
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
},{timestamps: true});

babySchema.index({ babyId: 1});
babySchema.index({ 'riskAssessment.finalRisk': 1});
babySchema.index({ createdAt: -1});

const Baby = mongoose.model('baby', babySchema);

module.exports = Baby;