const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const bodyParser = require('body-parser');
require('dotenv').config();


const assessmentRoutes = require('./routes/assessment');
const prescriptionRoutes = require('./routes/prescription');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


app.use('/api/prescription', prescriptionRoutes);
app.use('/api', assessmentRoutes);

app.get('/health', (req, res)=> {
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

 mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  }); 


// ===== START SERVER =====
app.listen(PORT, () => {
  console.log('=================================');
  console.log('👶 Newborn Health Monitor API');
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log('=================================');
});