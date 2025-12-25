import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Search, Plus, User } from 'lucide-react';
import BabyInfoForm from '../components/BabyInfoForm';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import { validateField, validationRanges, normalRanges } from '../utils/validation';
import { generateBabyId, formatDate } from '../utils/helpers';
import { assessmentAPI, babyAPI } from '../services/api';

function AssessmentFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from baby history
  const existingBaby = location.state?.baby;
  
  // Step 1: Choose new or existing baby
  // Step 2: Enter baby info (if new) or search baby (if existing)
  // Step 3: Fill health parameters
  const [step, setStep] = useState(existingBaby ? 3 : 1);
  const [babyType, setBabyType] = useState(existingBaby ? 'existing' : null); // 'new' or 'existing'
  
  // Search state
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Found baby or new baby data
  const [selectedBaby, setSelectedBaby] = useState(existingBaby || null);
  const [babyId, setBabyId] = useState(existingBaby?.babyId || '');
  
  // Baby info (for new baby)
  const [babyInfo, setBabyInfo] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: 'Unknown'
  });
  
  // Parent info (for new baby)
  const [parentInfo, setParentInfo] = useState({
    motherName: '',
    fatherName: '',
    contactNumber: '',
    email: '',
    address: ''
  });
  
  // Health parameters
  const [healthParameters, setHealthParameters] = useState({
    birthWeight: '',
    birthLength: '',
    headCircumference: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    jaundiceLevel: '',
    bloodGlucose: '',
    oxygenSaturation: '',
    apgarScore: '',
    birthDefects: '',
    normalReflexes: '',
    immunizations: ''
  });
  
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [doctorNotes, setDoctorNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle baby type selection
  const handleBabyTypeSelect = (type) => {
    setBabyType(type);
    if (type === 'new') {
      setBabyId(generateBabyId());
      setStep(2);
    } else {
      setStep(2);
    }
  };

  // Handle baby search
  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError('Please enter a Baby ID');
      return;
    }

    setSearching(true);
    setSearchError('');

    try {
      const response = await babyAPI.checkExists(searchId.trim());
      
      if (response.exists) {
        setSelectedBaby(response.data);
        setBabyId(response.data.babyId);
        setStep(3);
      } else {
        setSearchError('Baby ID not found. Please check the ID or create a new baby.');
      }
    } catch (err) {
      setSearchError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  // Handle baby info change
  const handleBabyInfoChange = (section, name, value) => {
    if (section === 'babyInfo') {
      setBabyInfo(prev => ({ ...prev, [name]: value }));
    } else if (section === 'parentInfo') {
      setParentInfo(prev => ({ ...prev, [name]: value }));
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[section]) {
        delete newErrors[section][name];
      }
      return newErrors;
    });
  };

  // Handle health param change
  const handleHealthParamChange = (e) => {
    const { name, value } = e.target;
    
    setHealthParameters(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationRanges[name]) {
      const validation = validateField(name, value);
      
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          [name]: validation.message
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Validate baby info (for new baby)
  const validateBabyInfo = () => {
    const babyErrors = {};
    const parentErrors = {};
    
    if (babyType === 'new') {
      if (!babyInfo.name.trim()) babyErrors.name = 'Baby name is required';
      if (!babyInfo.dateOfBirth) babyErrors.dateOfBirth = 'Date of birth is required';
      if (!babyInfo.gender) babyErrors.gender = 'Gender is required';
      
      if (!parentInfo.motherName.trim()) parentErrors.motherName = "Mother's name is required";
      if (!parentInfo.contactNumber.trim()) parentErrors.contactNumber = 'Contact number is required';
    }
    
    return { babyErrors, parentErrors };
  };

  // Validate health parameters
  const validateHealthParameters = () => {
    const paramErrors = {};
    
    Object.keys(validationRanges).forEach(field => {
      if (!healthParameters[field] || healthParameters[field] === '') {
        paramErrors[field] = 'This field is required';
      } else {
        const validation = validateField(field, healthParameters[field]);
        if (!validation.isValid) {
          paramErrors[field] = validation.message;
        }
      }
    });
    
    if (!healthParameters.birthDefects) paramErrors.birthDefects = 'This field is required';
    if (!healthParameters.normalReflexes) paramErrors.normalReflexes = 'This field is required';
    if (!healthParameters.immunizations) paramErrors.immunizations = 'This field is required';
    
    return paramErrors;
  };

  // Proceed to health parameters form (from baby info)
  const handleProceedToAssessment = () => {
    const { babyErrors, parentErrors } = validateBabyInfo();
    
    if (Object.keys(babyErrors).length > 0 || Object.keys(parentErrors).length > 0) {
      setErrors({
        ...(Object.keys(babyErrors).length > 0 && { babyInfo: babyErrors }),
        ...(Object.keys(parentErrors).length > 0 && { parentInfo: parentErrors })
      });
      return;
    }
    
    setStep(3);
  };

  // Submit assessment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const paramErrors = validateHealthParameters();
    
    if (Object.keys(paramErrors).length > 0) {
      setErrors(paramErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const assessmentData = {
        isNewBaby: babyType === 'new',
        babyId: babyId,
        assessmentDate: assessmentDate,
        healthParameters: {
          birthWeight: parseFloat(healthParameters.birthWeight),
          birthLength: parseFloat(healthParameters.birthLength),
          headCircumference: parseFloat(healthParameters.headCircumference),
          temperature: parseFloat(healthParameters.temperature),
          heartRate: parseFloat(healthParameters.heartRate),
          respiratoryRate: parseFloat(healthParameters.respiratoryRate),
          jaundiceLevel: parseFloat(healthParameters.jaundiceLevel),
          bloodGlucose: parseFloat(healthParameters.bloodGlucose),
          oxygenSaturation: parseFloat(healthParameters.oxygenSaturation),
          apgarScore: parseInt(healthParameters.apgarScore),
          birthDefects: healthParameters.birthDefects,
          normalReflexes: healthParameters.normalReflexes,
          immunizations: healthParameters.immunizations
        },
        doctorNotes: doctorNotes
      };
      
      if (babyType === 'new') {
        assessmentData.babyInfo = babyInfo;
        assessmentData.parentInfo = parentInfo;
      }
      
      console.log('Submitting assessment:', assessmentData);
      
      const response = await assessmentAPI.createOrUpdate(assessmentData);
      
      console.log('Assessment created:', response);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate('/results', { 
          state: { 
            assessmentData: {
              babyId: response.data.babyId,
              babyInfo: response.data.babyInfo,
              assessmentDate: response.data.latestAssessment.assessmentDate,
              healthParameters: response.data.latestAssessment.healthParameters,
              riskAssessment: response.data.latestAssessment.riskAssessment,
              doctorNotes: response.data.latestAssessment.doctorNotes
            }
          } 
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error creating assessment:', error);
      setErrors({
        submit: error.message || 'Failed to create assessment. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setStep(1);
    setBabyType(null);
    setSelectedBaby(null);
    setBabyId('');
    setSearchId('');
    setSearchError('');
    setBabyInfo({
      name: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: 'Unknown'
    });
    setParentInfo({
      motherName: '',
      fatherName: '',
      contactNumber: '',
      email: '',
      address: ''
    });
    setHealthParameters({
      birthWeight: '',
      birthLength: '',
      headCircumference: '',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      jaundiceLevel: '',
      bloodGlucose: '',
      oxygenSaturation: '',
      apgarScore: '',
      birthDefects: '',
      normalReflexes: '',
      immunizations: ''
    });
    setAssessmentDate(new Date().toISOString().split('T')[0]);
    setDoctorNotes('');
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="bg-cyan-400 rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              👶 Newborn Health Assessment
            </h1>
            <p className="text-white mt-2">
              {step === 1 && 'Choose baby type'}
              {step === 2 && babyType === 'new' && 'Enter baby information'}
              {step === 2 && babyType === 'existing' && 'Search for existing baby'}
              {step === 3 && 'Enter health parameters for today'}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-800">Assessment Created Successfully!</p>
              <p className="text-sm text-green-700">Redirecting to results...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Choose Baby Type */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Select Baby Type
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Baby Card */}
                <button
                  onClick={() => handleBabyTypeSelect('new')}
                  className="group p-8 border-3 border-blue-300 hover:border-blue-500 rounded-xl transition-all hover:shadow-xl bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">New Baby</h3>
                    <p className="text-sm text-gray-600">
                      Create a new baby record with parent information
                    </p>
                  </div>
                </button>

                {/* Existing Baby Card */}
                <button
                  onClick={() => handleBabyTypeSelect('existing')}
                  className="group p-8 border-3 border-green-300 hover:border-green-500 rounded-xl transition-all hover:shadow-xl bg-green-50 hover:bg-green-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Existing Baby</h3>
                    <p className="text-sm text-gray-600">
                      Add assessment to an existing baby record
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2A: Baby Info Form (New Baby) */}
        {step === 2 && babyType === 'new' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Baby Information</h2>
                <p className="text-gray-600">Enter details for the new baby</p>
              </div>

              {/* Baby ID Display */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baby ID (Auto-generated)
                </label>
                <input
                  type="text"
                  value={babyId}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-700 font-mono font-semibold"
                />
              </div>

              <BabyInfoForm
                babyInfo={babyInfo}
                parentInfo={parentInfo}
                onChange={handleBabyInfoChange}
                errors={errors}
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToAssessment}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Proceed to Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2B: Baby Search (Existing Baby) */}
        {step === 2 && babyType === 'existing' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Existing Baby</h2>

              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter Baby ID (e.g., BABY-001)"
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center"
                >
                  {searching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>

              {searchError && (
                <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
                    <p className="text-yellow-800">{searchError}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Health Parameters Form */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Baby Info Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Baby Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Baby ID</p>
                      <p className="font-mono font-semibold text-gray-800">{babyId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedBaby?.babyInfo?.name || babyInfo.name}
                      </p>
                    </div>
                    {selectedBaby && (
                      <>
                        <div>
                          <p className="text-gray-500">Total Visits</p>
                          <p className="font-semibold text-gray-800">{selectedBaby.totalVisits}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Risk</p>
                          <p className={`font-semibold ${
                            selectedBaby.currentRiskLevel === 'Low Risk' ? 'text-green-600' :
                            selectedBaby.currentRiskLevel === 'Medium Risk' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {selectedBaby.currentRiskLevel}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {selectedBaby && selectedBaby.assessments && selectedBaby.assessments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Previous Assessments</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedBaby.assessments.slice(0, 5).map((assessment, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">
                              {formatDate(assessment.assessmentDate)}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              assessment.riskAssessment.finalRisk === 'Low Risk' ? 'bg-green-100 text-green-800' :
                              assessment.riskAssessment.finalRisk === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {assessment.riskAssessment.finalRisk}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/baby/${babyId}/history`)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-semibold underline"
                      >
                        View Complete History
                      </button>
                    </div>
                  )}
                </div>

                {/* Assessment Date */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Assessment Date
                  </h3>
                  <InputField
                    label="Date of Assessment"
                    name="assessmentDate"
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    error={errors.assessmentDate}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Today: {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Health Parameters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Health Parameters
                  </h2>

                  {/* Birth Measurements */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                      Birth Measurements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Birth Weight"
                        name="birthWeight"
                        value={healthParameters.birthWeight}
                        onChange={handleHealthParamChange}
                        error={errors.birthWeight}
                        placeholder="3.2"
                        unit="kg"
                        min={normalRanges.birthWeight.min}
                        max={normalRanges.birthWeight.max}
                      />
                      <InputField
                        label="Birth Length"
                        name="birthLength"
                        value={healthParameters.birthLength}
                        onChange={handleHealthParamChange}
                        error={errors.birthLength}
                        placeholder="50"
                        unit="cm"
                        min={normalRanges.birthLength.min}
                        max={normalRanges.birthLength.max}
                      />
                    </div>
                    <InputField
                      label="Head Circumference"
                      name="headCircumference"
                      value={healthParameters.headCircumference}
                      onChange={handleHealthParamChange}
                      error={errors.headCircumference}
                      placeholder="34"
                      unit="cm"
                      min={normalRanges.headCircumference.min}
                      max={normalRanges.headCircumference.max}
                    />
                  </div>

                  {/* Vital Signs */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                      Vital Signs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Temperature"
                        name="temperature"
                        value={healthParameters.temperature}
                        onChange={handleHealthParamChange}
                        error={errors.temperature}
                        placeholder="36.8"
                        unit="°C"
                        min={normalRanges.temperature.min}
                        max={normalRanges.temperature.max}
                      />
                      <InputField
                        label="Heart Rate"
                        name="heartRate"
                        value={healthParameters.heartRate}
                        onChange={handleHealthParamChange}
                        error={errors.heartRate}
                        placeholder="140"
                        unit="bpm"
                        min={normalRanges.heartRate.min}
                        max={normalRanges.heartRate.max}
                        step="1"
                      />
                      <InputField
                        label="Respiratory Rate"
                        name="respiratoryRate"
                        value={healthParameters.respiratoryRate}
                        onChange={handleHealthParamChange}
                        error={errors.respiratoryRate}
                        placeholder="45"
                        unit="bpm"
                        min={normalRanges.respiratoryRate.min}
                        max={normalRanges.respiratoryRate.max}
                        step="1"
                      />
                      <InputField
                        label="Oxygen Saturation"
                        name="oxygenSaturation"
                        value={healthParameters.oxygenSaturation}
                        onChange={handleHealthParamChange}
                        error={errors.oxygenSaturation}
                        placeholder="98"
                        unit="%"
                        min={normalRanges.oxygenSaturation.min}
                        max={normalRanges.oxygenSaturation.max}
                        step="1"
                      />
                    </div>
                  </div>

                  {/* Laboratory Values */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                      Laboratory Values
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Jaundice Level"
                        name="jaundiceLevel"
                        value={healthParameters.jaundiceLevel}
                        onChange={handleHealthParamChange}
                        error={errors.jaundiceLevel}
                        placeholder="5.0"
                        unit="mg/dL"
                        min={normalRanges.jaundiceLevel.min}
                        max={normalRanges.jaundiceLevel.max}
                      />
                      <InputField
                        label="Blood Glucose"
                        name="bloodGlucose"
                        value={healthParameters.bloodGlucose}
                        onChange={handleHealthParamChange}
                        error={errors.bloodGlucose}
                        placeholder="4.5"
                        unit="mmol/L"
                        min={normalRanges.bloodGlucose.min}
                        max={normalRanges.bloodGlucose.max}
                      />
                    </div>
                  </div>

                  {/* Assessment Scores */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                      Assessment Scores
                    </h3>
                    <InputField
                      label="APGAR Score"
                      name="apgarScore"
                      value={healthParameters.apgarScore}
                      onChange={handleHealthParamChange}
                      error={errors.apgarScore}
                      placeholder="9"
                      unit=""
                      min={0}
                      max={10}
                      step="1"
                    />
                  </div>

                  {/* Clinical Observations */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                      Clinical Observations
                    </h3>
                    <SelectField
                      label="Birth Defects Present?"
                      name="birthDefects"
                      value={healthParameters.birthDefects}
                      onChange={handleHealthParamChange}
                      error={errors.birthDefects}
                      options={[
                        { value: 'No', label: 'No' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'Some distress', label: 'Some distress' }
                      ]}
                    />
                    <SelectField
                      label="Normal Reflexes?"
                      name="normalReflexes"
                      value={healthParameters.normalReflexes}
                      onChange={handleHealthParamChange}
                      error={errors.normalReflexes}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                      ]}
                    />
                    <SelectField
                      label="Immunizations Completed?"
                      name="immunizations"
                      value={healthParameters.immunizations}
                      onChange={handleHealthParamChange}
                      error={errors.immunizations}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                      ]}
                    />
                  </div>

                  {/* Doctor Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor's Notes
                    </label>
                    <textarea
                      name="doctorNotes"
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Additional observations, concerns, or recommendations..."
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column - Action Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Actions
                  </h3>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full py-3 px-6 rounded-lg font-semibold mb-3
                      flex items-center justify-center transition-all
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-cyan-400 hover:bg-cyan-500 text-white shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Assess Health Risk
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Over
                  </button>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Important
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• All fields are required</li>
                      <li>• Values must be within valid ranges</li>
                      <li>• Double-check measurements</li>
                      <li>• Assessment is for {new Date(assessmentDate).toLocaleDateString()}</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default AssessmentFormPage;
                        