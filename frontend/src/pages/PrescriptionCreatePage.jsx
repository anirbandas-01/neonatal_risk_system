// frontend/src/pages/PrescriptionCreatePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDoctorAuth } from '../context/DoctorAuthContext';
import { prescriptionService } from '../services/prescriptionService';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  FileText,
  AlertCircle,
  CheckCircle,
  Search,
  Copy,
  Loader
} from 'lucide-react';

const COMMON_MEDICINES = [
  { name: 'Paracetamol Drops', dosage: '0.6 ml', frequency: 'TDS' },
  { name: 'Vitamin D Drops', dosage: '1 drop (400 IU)', frequency: 'OD' },
  { name: 'Iron Drops', dosage: '1 ml', frequency: 'OD' },
  { name: 'Zinc Sulfate Syrup', dosage: '5 ml', frequency: 'OD' },
  { name: 'Gripe Water', dosage: '2.5 ml', frequency: 'SOS' },
  { name: 'Probiotics Drops', dosage: '5 drops', frequency: 'OD' },
];

const FREQUENCY_OPTIONS = [
  { value: 'OD', label: 'OD (Once Daily)' },
  { value: 'BD', label: 'BD (Twice Daily)' },
  { value: 'TDS', label: 'TDS (Three Times Daily)' },
  { value: 'QID', label: 'QID (Four Times Daily)' },
  { value: 'SOS', label: 'SOS (If Needed)' },
];

function PrescriptionCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor } = useDoctorAuth();
  
  const { assessmentId, assessmentData } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [diagnosisSummary, setDiagnosisSummary] = useState('');
  const [medicines, setMedicines] = useState([{
    name: '',
    dosage: '',
    frequency: '',
    timing: [],
    duration: '',
    instructions: ''
  }]);
  const [advice, setAdvice] = useState('');
  
  // Load last prescription for "copy from last" feature
  const [lastPrescription, setLastPrescription] = useState(null);
  const [loadingLast, setLoadingLast] = useState(false);

  useEffect(() => {
    if (!assessmentId || !assessmentData) {
      setError('Assessment data missing. Please start from assessment results.');
      return;
    }
    
    // Auto-fill diagnosis from risk assessment
    if (assessmentData.riskAssessment) {
      const risk = assessmentData.riskAssessment.finalRisk;
      const autoText = `Clinical assessment shows ${risk} status. `;
      setDiagnosisSummary(autoText);
    }
    
    // Try to load last prescription for this baby
    loadLastPrescription();
  }, [assessmentId, assessmentData]);

  const loadLastPrescription = async () => {
    if (!assessmentData?.babyId) return;
    
    setLoadingLast(true);
    try {
      const response = await prescriptionService.getByBabyId(assessmentData.babyId);
      if (response.success && response.data && response.data.length > 0) {
        setLastPrescription(response.data[0]); // Most recent
      }
    } catch (err) {
      console.log('No previous prescription found');
    } finally {
      setLoadingLast(false);
    }
  };

  const copyFromLast = () => {
    if (!lastPrescription) return;
    
    setDiagnosisSummary(lastPrescription.diagnosis_summary);
    setMedicines(lastPrescription.medicines.map(med => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      timing: med.timing || [],
      duration: med.duration,
      instructions: med.instructions || ''
    })));
    setAdvice(lastPrescription.advice || '');
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

  const quickAddMedicine = (commonMed) => {
    const lastIndex = medicines.length - 1;
    if (medicines[lastIndex].name !== '') {
      addMedicine();
    }
    
    const index = medicines[lastIndex].name === '' ? lastIndex : medicines.length - 1;
    updateMedicine(index, 'name', commonMed.name);
    updateMedicine(index, 'dosage', commonMed.dosage);
    updateMedicine(index, 'frequency', commonMed.frequency);
  };

  const validateForm = () => {
    if (!diagnosisSummary.trim()) {
      setError('Diagnosis summary is required');
      return false;
    }

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.name.trim() || !med.dosage.trim() || !med.frequency || 
          med.timing.length === 0 || !med.duration.trim()) {
        setError(`Please complete all required fields for Medicine ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const prescriptionData = {
        doctor_id: doctor._id,
        doctor: {
          name: doctor.name,
          registration_no: doctor.registration_no,
          clinic_name: doctor.clinic_name,
          phone: doctor.phone,
          email: doctor.email || '',
          address: doctor.address || ''
        },
        patient: {
          baby_id: assessmentData.babyId,
          name: assessmentData.babyInfo.name,
          age_days: Math.floor((Date.now() - new Date(assessmentData.babyInfo.dateOfBirth)) / (1000 * 60 * 60 * 24)),
          gender: assessmentData.babyInfo.gender,
          parent_phone: assessmentData.parentInfo?.contactNumber || 'N/A',
          parent_email: assessmentData.parentInfo?.email || ''
        },
        assessment_id: assessmentId,
        diagnosis_summary: diagnosisSummary,
        medicines: medicines,
        advice: advice
      };

      const response = await prescriptionService.create(prescriptionData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/prescription/view/${response.data._id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  if (!assessmentId || !assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Missing Assessment Data</h2>
          <p className="text-gray-600 mb-6">Please create prescription from an assessment results page.</p>
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
            Back
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileText className="w-8 h-8 mr-3 text-purple-600" />
                  Create Prescription
                </h1>
                <p className="text-gray-600 mt-2">
                  For {assessmentData.babyInfo.name} ({assessmentData.babyId})
                </p>
              </div>
              
              {/* Copy from Last button */}
              {lastPrescription && (
                <button
                  onClick={copyFromLast}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy from Last Prescription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 flex items-center animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-800">Prescription Created Successfully!</p>
              <p className="text-sm text-green-700">Redirecting to view...</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Diagnosis */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Diagnosis Summary *</h2>
            <textarea
              value={diagnosisSummary}
              onChange={(e) => setDiagnosisSummary(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter diagnosis summary..."
              required
            />
          </div>

          {/* Quick Add Common Medicines */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Quick Add Common Medicines
            </h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_MEDICINES.map((med, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => quickAddMedicine(med)}
                  className="px-3 py-2 bg-white hover:bg-blue-100 border-2 border-blue-300 text-blue-900 rounded-lg text-sm font-semibold transition-colors"
                >
                  + {med.name}
                </button>
              ))}
            </div>
          </div>

          {/* Medicines */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">℞ Prescription *</h2>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Medicine
              </button>
            </div>

            {medicines.map((medicine, index) => (
              <div key={index} className="mb-6 p-5 border-2 border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-700 text-lg">Medicine {index + 1}</h3>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Medicine Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Enter medicine name..."
                      required
                    />
                  </div>

                  {/* Dosage and Frequency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., 2.5 ml, 1 tablet"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Select frequency</option>
                        {FREQUENCY_OPTIONS.map(freq => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Timing */}
                  <div>
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
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 5 days, 1 week"
                      required
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., Shake well before use"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advice */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Medical Advice (Optional)</h2>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Ensure adequate hydration, follow-up if symptoms persist..."
            />
          </div>

          {/* Submit Buttons */}
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
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
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

export default PrescriptionCreatePage;