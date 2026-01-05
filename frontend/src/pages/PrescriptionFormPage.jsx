import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, FileText, AlertCircle, CheckCircle, Search } from 'lucide-react';

const COMMON_MEDICINES = [
  'Paracetamol Syrup',
  'Paracetamol Drops',
  'Ibuprofen Suspension',
  'Cefixime Suspension',
  'Amoxicillin Syrup',
  'Amoxicillin + Clavulanate Suspension',
  'Azithromycin Suspension',
  'Vitamin D Drops',
  'Multivitamin Drops',
  'Iron + Folic Acid Drops',
  'Zinc Sulfate Syrup',
  'Gripe Water',
  'Probiotics Drops',
  'Domperidone Suspension',
  'Cetirizine Syrup',
  'Salbutamol Syrup'
];

const FREQUENCY_OPTIONS = [
  { value: 'OD', label: 'OD (Once Daily)', display: 'Once daily' },
  { value: 'BD', label: 'BD (Twice Daily)', display: 'Twice daily' },
  { value: 'TDS', label: 'TDS (Three Times Daily)', display: 'Three times daily' },
  { value: 'QID', label: 'QID (Four Times Daily)', display: 'Four times daily' },
  { value: 'SOS', label: 'SOS (If Needed)', display: 'If needed' },
  { value: 'STAT', label: 'STAT (Immediately)', display: 'Immediately' }
];

const ROUTE_OPTIONS = [
  'Oral',
  'IV (Intravenous)',
  'IM (Intramuscular)',
  'Topical',
  'Rectal',
  'Nebulization'
];

export default function EnhancedPrescriptionForm() {
  const [doctorInfo] = useState({
    name: 'Dr. John Smith',
    registration_no: 'MED-123456',
    clinic_name: 'City Medical Center',
    phone: '+919876543210',
    address: '123 Medical Plaza, City, State - 123456'
  });

  const [patientInfo] = useState({
    baby_id: 'BABY-001',
    name: 'Baby Kumar',
    age_days: 15,
    gender: 'Male',
    parent_phone: '+919876543210'
  });

  const [diagnosisSummary, setDiagnosisSummary] = useState('');
  
  const [medicines, setMedicines] = useState([{
    name: '',
    dose: '',
    frequency: '',
    route: 'Oral',
    timing: [],
    duration: '',
    instructions: '',
    showSuggestions: false
  }]);

  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addMedicine = () => {
    setMedicines([...medicines, {
      name: '',
      dose: '',
      frequency: '',
      route: 'Oral',
      timing: [],
      duration: '',
      instructions: '',
      showSuggestions: false
    }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    
    if (field === 'name') {
      updated[index].showSuggestions = value.length > 0;
    }
    
    setMedicines(updated);
  };

  const selectMedicine = (index, medicineName) => {
    const updated = [...medicines];
    updated[index].name = medicineName;
    updated[index].showSuggestions = false;
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

  const getFilteredMedicines = (searchTerm) => {
    if (!searchTerm) return COMMON_MEDICINES;
    return COMMON_MEDICINES.filter(med => 
      med.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const validateForm = () => {
    if (!diagnosisSummary.trim()) {
      setError('Diagnosis summary is required');
      return false;
    }

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.name.trim() || !med.dose.trim() || !med.frequency || 
          !med.route || med.timing.length === 0 || !med.duration.trim()) {
        setError(`Please complete all required fields for Medicine ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        alert('✅ Prescription created successfully!\n\nIn production, this would:\n- Save to database\n- Generate PDF\n- Send to patient');
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-6">
          <button className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assessment
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Create Medical Prescription
            </h1>
            <p className="text-gray-600 mt-2">
              For {patientInfo.name} ({patientInfo.baby_id})
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-800">Prescription Created Successfully!</p>
              <p className="text-sm text-green-700">Ready for download and printing</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

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
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Diagnosis Summary *</h2>
          <textarea
            value={diagnosisSummary}
            onChange={(e) => setDiagnosisSummary(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="Enter diagnosis summary..."
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">℞ Prescription *</h2>
            <button
              onClick={addMedicine}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Medicine
            </button>
          </div>

          {medicines.map((medicine, index) => (
            <div key={index} className="mb-6 p-5 border-2 border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 text-lg">Medicine {index + 1}</h3>
                {medicines.length > 1 && (
                  <button
                    onClick={() => removeMedicine(index)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                      onFocus={() => updateMedicine(index, 'showSuggestions', true)}
                      className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Start typing medicine name..."
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  {medicine.showSuggestions && medicine.name && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {getFilteredMedicines(medicine.name).map((med, i) => (
                        <button
                          key={i}
                          onClick={() => selectMedicine(index, med)}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors text-sm"
                        >
                          {med}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dose per Administration *
                    </label>
                    <input
                      type="text"
                      value={medicine.dose}
                      onChange={(e) => updateMedicine(index, 'dose', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 2.5 ml or 1 tablet"
                    />
                    <p className="text-xs text-gray-500 mt-1">Example: 2.5 ml, 1 tablet, 5 drops</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select frequency</option>
                      {FREQUENCY_OPTIONS.map(freq => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                    {medicine.frequency && (
                      <p className="text-xs text-blue-600 mt-1 font-semibold">
                        {FREQUENCY_OPTIONS.find(f => f.value === medicine.frequency)?.display}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route of Administration *
                    </label>
                    <select
                      value={medicine.route}
                      onChange={(e) => updateMedicine(index, 'route', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      {ROUTE_OPTIONS.map(route => (
                        <option key={route} value={route}>
                          {route}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days) *
                    </label>
                    <input
                      type="number"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 5"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timing * (Select at least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Morning', 'Afternoon', 'Evening', 'Night', 'Before Food', 'After Food'].map(time => (
                      <button
                        key={time}
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
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Take with plenty of water, Shake well before use"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Medical Advice (Optional)</h2>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="e.g., Ensure adequate feeding, Follow-up after 48 hours if symptoms persist..."
          />
        </div>

        <div className="flex gap-4">
          <button
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Creating Prescription...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Create Prescription
              </>
            )}
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold mb-2">📋 Medical Prescription Format</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• <strong>Dose:</strong> Amount per single administration (e.g., 2.5 ml, 1 tablet)</p>
            <p>• <strong>Frequency:</strong> OD = Once daily, BD = Twice daily, TDS = Three times daily</p>
            <p>• <strong>Route:</strong> How medicine should be administered (Oral for most neonatal cases)</p>
            <p>• <strong>Duration:</strong> Total number of days to continue medication</p>
          </div>
        </div>

      </div>
    </div>
  );
}