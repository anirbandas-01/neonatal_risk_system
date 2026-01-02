import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useDoctorAuth } from '../context/DoctorAuthContext';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export default function PrescriptionFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentId } = useParams();
  
  const { doctor } = useDoctorAuth();

  const assessmentData = location.state?.assessmentData;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const doctorInfo = doctor ? {
      name: doctor.name,
      registration_no: doctor.registration_no,
      clinic_name: doctor.clinic_name,
      phone: doctor.phone,
      address: doctor.address || 'Not provided',
      email: doctor.email
    } : null;


    if (!doctor || !doctorInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to create prescriptions.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  // Diagnosis Summary
  const [diagnosisSummary, setDiagnosisSummary] = useState('');

  // Medicines List
  const [medicines, setMedicines] = useState([{
    name: '',
    dosage: '',
    frequency: '',
    timing: [],
    duration: '',
    instructions: ''
  }]);

  // Medical Advice
  const [advice, setAdvice] = useState('');

useEffect(() => {
  console.log('🔍 Prescription Form Page Loaded');
  console.log('📋 Assessment Data:', assessmentData);
  console.log('🆔 Assessment ID from params:', assessmentId);
  
  if (assessmentData) {
    // Auto-generate diagnosis summary from assessment
    generateDiagnosisSummary();
    
    // Validate we have an assessment ID
    const actualAssessmentId = assessmentId || assessmentData._id || assessmentData.id;
    
    if (!actualAssessmentId) {
      console.error('❌ CRITICAL: No assessment ID found!');
      console.error('Assessment Data Structure:', JSON.stringify(assessmentData, null, 2));
      setError('Assessment ID is missing. Please go back and try again.');
    } else {
      console.log('✅ Valid Assessment ID:', actualAssessmentId);
    }
  }
}, [assessmentData, assessmentId]);

  const generateDiagnosisSummary = () => {
    if (!assessmentData) return;
    
    const { riskAssessment, healthParameters } = assessmentData;
    let summary = `Neonate assessment reveals ${riskAssessment.finalRisk.toLowerCase()} status. `;
    
    // Add specific clinical flags if available
    if (riskAssessment.clinicalFlags && riskAssessment.clinicalFlags.length > 0) {
      const flagMessages = riskAssessment.clinicalFlags.map(f => f.message).join(', ');
      summary += `Clinical observations: ${flagMessages}. `;
    }
    
    // Add specific risks
    if (riskAssessment.specificRisks) {
      const highRisks = Object.entries(riskAssessment.specificRisks)
        .filter(([_, level]) => level === 'high' || level === 'suspected')
        .map(([category, _]) => category.replace(/_/g, ' '));
      
      if (highRisks.length > 0) {
        summary += `Areas of concern: ${highRisks.join(', ')}. `;
      }
    }
    
    setDiagnosisSummary(summary.trim());
  };

  const addMedicine = () => {
    setMedicines([...medicines, {
      name: '',
      dosage: '',
      frequency: '',
      timing: [],
      duration: '',
      instructions: ''
    }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const toggleTiming = (index, time) => {
    const updated = [...medicines];
    const timings = updated[index].timing;
    
    if (timings.includes(time)) {
      updated[index].timing = timings.filter(t => t !== time);
    } else {
      updated[index].timing = [...timings, time];
    }
    
    setMedicines(updated);
  };

  const validateForm = () => {
    if (!diagnosisSummary.trim()) {
      setError('Diagnosis summary is required');
      return false;
    }

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.name.trim() || !med.dosage.trim() || !med.frequency.trim() || 
          med.timing.length === 0 || !med.duration.trim()) {
        setError(`Please complete all fields for Medicine ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    if (!assessmentData) {
      setError('Assessment data not found');
      return;
    }

    // Get the correct assessment ID
    const actualAssessmentId = assessmentId || assessmentData._id || assessmentData.assessmentId || assessmentData.assessment?._id || assessmentData.latestAssessment?._id;
    
    if (!actualAssessmentId) {
      setError('Assessment ID is missing. Please go back and select the assessment again.');
       console.error('❌ Invalid Assessment ID:', actualAssessmentId);
    console.error('📋 Assessment Data:', assessmentData);
      return;
    }

    console.log('📝 Creating prescription with assessment ID:', actualAssessmentId);

    setLoading(true);

    try {
    
      console.log('🔍 Prescription Debug Info:');
      console.log('assessmentData:', assessmentData);
      console.log('parentInfo:', assessmentData.parentInfo);
      console.log('Parent phone:', assessmentData.parentInfo?.contactNumber);

      const prescriptionData = {
      doctor_id: doctor._id,  
      doctor: doctorInfo,
      patient: {
        baby_id: assessmentData.babyId,
        name: assessmentData.babyInfo.name,
        age_days: assessmentData.healthParameters.ageDays,
        gender: assessmentData.babyInfo.gender,
        parent_phone: assessmentData.parentInfo?.contactNumber || 
                  assessmentData.babyInfo?.parentInfo?.contactNumber || 
                  'N/A',
        parent_email: assessmentData.parentInfo?.email || 
                  assessmentData.babyInfo?.parentInfo?.email || 
                  'N/A'
      },
      assessment_id: actualAssessmentId,  
      diagnosis_summary: diagnosisSummary,
      medicines: medicines,
      advice: advice
    };

      console.log('📤 Sending prescription data:', JSON.stringify(prescriptionData, null, 2));

      const response = await axios.post(`${API_BASE_URL}/prescription/create`, prescriptionData);

      console.log('✅ Prescription created successfully:', response.data);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/prescription/${response.data.data._id}/view`, {
            state: { prescription: response.data.data }
          });
        }, 1500);
      }

    } catch (err) {
      console.error('❌ Prescription creation error:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
};

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Data Required</h2>
          <p className="text-gray-600 mb-6">Please select an assessment from the results page first.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assessment
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Create Prescription
            </h1>
            <p className="text-gray-600 mt-2">
              For {assessmentData.babyInfo.name} ({assessmentData.babyId})
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-800">Prescription Created Successfully!</p>
              <p className="text-sm text-green-700">Redirecting to prescription view...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Doctor Information (Read-only) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Doctor Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold">{doctorInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Registration No</p>
              <p className="font-semibold">{doctorInfo.registration_no}</p>
            </div>
            <div>
              <p className="text-gray-600">Clinic/Hospital</p>
              <p className="font-semibold">{doctorInfo.clinic_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-semibold">{doctorInfo.phone}</p>
            </div>
            {doctorInfo.email && (
            <div className="col-span-2">
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{doctorInfo.email}</p>
            </div>
               )}
            {doctorInfo.address && doctorInfo.address !== 'Not provided' && (
              <div className="col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-semibold">{doctorInfo.address}</p>
              </div>
            )}
          </div>
        </div>

          {/* Diagnosis Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Diagnosis Summary *</h2>
            <textarea
              value={diagnosisSummary}
              onChange={(e) => setDiagnosisSummary(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Enter diagnosis summary..."
              required
            />
          </div>

          {/* Medicines */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">℞ Prescription *</h2>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Medicine
              </button>
            </div>

            {medicines.map((medicine, index) => (
              <div key={index} className="mb-6 p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-700">Medicine {index + 1}</h3>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., Paracetamol Drops"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 2.5 ml"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <input
                      type="text"
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., Twice daily"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timing * (Select at least one)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Morning', 'Afternoon', 'Evening', 'Night', 'Before Food', 'After Food'].map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => toggleTiming(index, time)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            medicine.timing.includes(time)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 5 days"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., Take with plenty of water"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Medical Advice */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Medical Advice (Optional)</h2>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="e.g., Ensure adequate feeding and follow-up after 48 hours..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Create Prescription
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}