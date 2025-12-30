const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const assessmentRoutes = require('./routes/assessment');
const prescriptionRoutes = require('./routes/prescription');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Mount routes BEFORE 404 handler
app.use('/api/prescription', prescriptionRoutes);
app.use('/api', assessmentRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Newborn Health Monitor API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Newborn Health Monitor API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            createAssessment: 'POST /api/assess',
            getAssessment: 'GET /api/assess/:babyId',
            getAllAssessments: 'GET /api/assessments',
            getStatistics: 'GET /api/assessments/stats',
            createPrescription: 'POST /api/prescription/create',
            getPrescription: 'GET /api/prescription/:prescriptionId',
            downloadPrescription: 'GET /api/prescription/:prescriptionId/download'
        }
    });
});

// 404 handler - MUST come after all routes
app.use((req, res) => {
    console.log('❌ 404 Not Found:', req.method, req.path);
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        requestedPath: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// Start server
app.listen(PORT, () => {
    console.log('=================================');
    console.log('👶 Newborn Health Monitor API');
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log('=================================');
    console.log('📋 Available routes:');
    console.log('   POST   /api/prescription/create');
    console.log('   GET    /api/prescription/:id');
    console.log('   GET    /api/prescription/:id/download');
    console.log('=================================');
});