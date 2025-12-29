import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Search, Plus, Baby, Sparkles } from 'lucide-react';
import BabyInfoForm from '../components/BabyInfoForm';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import { validateField, validationRanges, normalRanges } from '../utils/validation';
import { generateBabyId, formatDate } from '../utils/helpers';
import { assessmentAPI, babyAPI } from '../services/api';

function AssessmentFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/HomePage';

  
  const existingBaby = location.state?.baby;
  
  const [step, setStep] = useState(existingBaby ? 3 : 1);
  const [babyType, setBabyType] = useState(existingBaby ? 'existing' : null);
  
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const [selectedBaby, setSelectedBaby] = useState(existingBaby || null);
  const [babyId, setBabyId] = useState(existingBaby?.babyId || '');
  
  const [babyInfo, setBabyInfo] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: 'Unknown'
  });
  
  const [parentInfo, setParentInfo] = useState({
    motherName: '',
    fatherName: '',
    contactNumber: '',
    email: '',
    address: ''
  });
  
  // Updated health parameters matching model
  const [healthParameters, setHealthParameters] = useState({
    gestationalAgeWeeks: '',
    birthWeightKg: '',
    birthLengthCm: '',
    birthHeadCircumferenceCm: '',
    ageDays: '',
    weightKg: '',
    lengthCm: '',
    headCircumferenceCm: '',
    temperatureC: '',
    heartRateBpm: '',
    respiratoryRateBpm: '',
    oxygenSaturation: '',
    feedingType: '',
    feedingFrequencyPerDay: '',
    urineOutputCount: '',
    stoolCount: '',
    jaundiceLevelMgDl: '',
    apgarScore: '',
    immunizationsDone: '',
    reflexesNormal: ''
  });
  
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [doctorNotes, setDoctorNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleBabyTypeSelect = (type) => {
    setBabyType(type);
    if (type === 'new') {
      setBabyId(generateBabyId());
      setStep(2);
    } else {
      setStep(2);
    }
  };

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
    
    if (!healthParameters.feedingType) paramErrors.feedingType = 'This field is required';
    if (!healthParameters.immunizationsDone) paramErrors.immunizationsDone = 'This field is required';
    if (!healthParameters.reflexesNormal) paramErrors.reflexesNormal = 'This field is required';
    
    return paramErrors;
  };

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
          gestationalAgeWeeks: parseFloat(healthParameters.gestationalAgeWeeks),
          birthWeightKg: parseFloat(healthParameters.birthWeightKg),
          birthLengthCm: parseFloat(healthParameters.birthLengthCm),
          birthHeadCircumferenceCm: parseFloat(healthParameters.birthHeadCircumferenceCm),
          ageDays: parseInt(healthParameters.ageDays),
          weightKg: parseFloat(healthParameters.weightKg),
          lengthCm: parseFloat(healthParameters.lengthCm),
          headCircumferenceCm: parseFloat(healthParameters.headCircumferenceCm),
          temperatureC: parseFloat(healthParameters.temperatureC),
          heartRateBpm: parseInt(healthParameters.heartRateBpm),
          respiratoryRateBpm: parseInt(healthParameters.respiratoryRateBpm),
          oxygenSaturation: parseFloat(healthParameters.oxygenSaturation),
          feedingType: healthParameters.feedingType,
          feedingFrequencyPerDay: parseInt(healthParameters.feedingFrequencyPerDay),
          urineOutputCount: parseInt(healthParameters.urineOutputCount),
          stoolCount: parseInt(healthParameters.stoolCount),
          jaundiceLevelMgDl: parseFloat(healthParameters.jaundiceLevelMgDl),
          apgarScore: parseInt(healthParameters.apgarScore),
          immunizationsDone: healthParameters.immunizationsDone,
          reflexesNormal: healthParameters.reflexesNormal
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
      gestationalAgeWeeks: '',
      birthWeightKg: '',
      birthLengthCm: '',
      birthHeadCircumferenceCm: '',
      ageDays: '',
      weightKg: '',
      lengthCm: '',
      headCircumferenceCm: '',
      temperatureC: '',
      heartRateBpm: '',
      respiratoryRateBpm: '',
      oxygenSaturation: '',
      feedingType: '',
      feedingFrequencyPerDay: '',
      urineOutputCount: '',
      stoolCount: '',
      jaundiceLevelMgDl: '',
      apgarScore: '',
      immunizationsDone: '',
      reflexesNormal: ''
    });
    setAssessmentDate(new Date().toISOString().split('T')[0]);
    setDoctorNotes('');
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 py-8" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd1dc' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header with playful design */}
        <div className="mb-8">
          <button
            //onClick={() => navigate('/HomePage')}
            onClick={() => navigate(from)}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Previous Page
          </button>
          
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full -ml-12 -mb-12 opacity-50"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white flex items-center">
                <Baby className="w-10 h-10 mr-3 animate-bounce" />
                Newborn Health Assessment
                <Sparkles className="w-8 h-8 ml-3 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-white text-lg mt-3 font-medium">
                {step === 1 && '✨ Choose baby type to get started'}
                {step === 2 && babyType === 'new' && '📝 Enter baby information'}
                {step === 2 && babyType === 'existing' && '🔍 Search for existing baby'}
                {step === 3 && '🏥 Enter health parameters for today'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl shadow-xl p-6 flex items-center animate-pulse">
            <CheckCircle className="w-10 h-10 text-white mr-4" />
            <div>
              <p className="font-bold text-white text-xl">Assessment Created Successfully! 🎉</p>
              <p className="text-white text-lg">Redirecting to results...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 bg-gradient-to-r from-red-400 to-red-500 rounded-2xl shadow-xl p-6 flex items-center">
            <AlertCircle className="w-10 h-10 text-white mr-4" />
            <div>
              <p className="font-bold text-white text-xl">Error</p>
              <p className="text-white text-lg">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Choose Baby Type */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
                <span className="mr-3">👶</span>
                Select Baby Type
                <span className="ml-3">🌟</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* New Baby Card */}
                <button
                  onClick={() => handleBabyTypeSelect('new')}
                  className="group p-10 border-4 border-pink-300 hover:border-pink-500 rounded-3xl transition-all hover:shadow-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                      <Plus className="w-14 h-14 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">New Baby</h3>
                    <p className="text-gray-600 text-lg">
                      Create a new baby record with parent information
                    </p>
                  </div>
                </button>

                {/* Existing Baby Card */}
                <button
                  onClick={() => handleBabyTypeSelect('existing')}
                  className="group p-10 border-4 border-blue-300 hover:border-blue-500 rounded-3xl transition-all hover:shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                      <Search className="w-14 h-14 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Existing Baby</h3>
                    <p className="text-gray-600 text-lg">
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
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center">
                  <span className="mr-3">👶</span>
                  Baby Information
                </h2>
                <p className="text-gray-600 text-lg">Enter details for the new baby</p>
              </div>

              {/* Baby ID Display */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border-4 border-purple-300 shadow-lg">
                <label className="block text-lg font-bold text-purple-800 mb-3">
                  🆔 Baby ID (Auto-generated)
                </label>
                <input
                  type="text"
                  value={babyId}
                  disabled
                  className="w-full px-6 py-4 bg-white border-3 border-purple-300 rounded-xl text-gray-800 font-mono font-bold text-xl shadow-inner"
                />
              </div>

              <BabyInfoForm
                babyInfo={babyInfo}
                parentInfo={parentInfo}
                onChange={handleBabyInfoChange}
                errors={errors}
              />

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 border-3 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                >
                  ← Back
                </button>
                <button
                  onClick={handleProceedToAssessment}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Proceed to Assessment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2B: Baby Search (Existing Baby) */}
        {step === 2 && babyType === 'existing' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                <Search className="w-8 h-8 mr-3 text-blue-500" />
                Search Existing Baby
              </h2>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter Baby ID (e.g., BABY-001)"
                    className="w-full px-6 py-4 pl-14 border-3 border-blue-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all shadow-lg text-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl flex items-center"
                >
                  {searching ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>

              {searchError && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-400 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mr-4 flex-shrink-0" />
                    <p className="text-yellow-900 font-semibold text-lg">{searchError}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 border-3 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Health Parameters Form - Continued in next artifact due to length */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Baby Info Summary with Enhanced Previous Assessments */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Baby className="w-7 h-7 mr-3 text-purple-500" />
                    Baby Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-base mb-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                      <p className="text-purple-600 font-semibold mb-1">Baby ID</p>
                      <p className="font-mono font-bold text-gray-800 text-lg">{babyId}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                      <p className="text-blue-600 font-semibold mb-1">Name</p>
                      <p className="font-bold text-gray-800 text-lg">
                        {selectedBaby?.babyInfo?.name || babyInfo.name}
                      </p>
                    </div>
                    {selectedBaby && (
                      <>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                          <p className="text-green-600 font-semibold mb-1">Total Visits</p>
                          <p className="font-bold text-gray-800 text-lg">{selectedBaby.totalVisits}</p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl">
                          <p className="text-orange-600 font-semibold mb-1">Current Risk</p>
                          <p className={`font-bold text-lg ${
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
                  
                  {/* Enhanced Previous Assessments Display */}
                  {selectedBaby && selectedBaby.assessments && selectedBaby.assessments.length > 0 && (
                    <div className="mt-6 pt-6 border-t-4 border-purple-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">📋</span>
                        Previous Assessments History
                      </h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {selectedBaby.assessments.slice().reverse().map((assessment, index) => {
                          const assessmentNumber = selectedBaby.assessments.length - index;
                          return (
                            <div key={index} className="relative pl-8 pb-6">
                              {/* Timeline line */}
                              {index < selectedBaby.assessments.length - 1 && (
                                <div className="absolute left-3 top-8 w-0.5 h-full bg-gradient-to-b from-purple-400 to-blue-400"></div>
                              )}
                              
                              {/* Timeline dot */}
                              <div className={`absolute left-0 top-2 w-6 h-6 rounded-full shadow-lg ${
                                assessment.riskAssessment.finalRisk === 'Low Risk' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                assessment.riskAssessment.finalRisk === 'Medium Risk' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                'bg-gradient-to-br from-red-400 to-red-600'
                              }`}></div>
                              
                              {/* Assessment Card */}
                              <div className={`bg-gradient-to-r p-5 rounded-2xl shadow-lg border-l-4 ${
                                assessment.riskAssessment.finalRisk === 'Low Risk' ? 'from-green-50 to-green-100 border-green-500' :
                                assessment.riskAssessment.finalRisk === 'Medium Risk' ? 'from-yellow-50 to-yellow-100 border-yellow-500' :
                                'from-red-50 to-red-100 border-red-500'
                              }`}>
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="text-sm font-bold text-gray-600 mb-1">
                                      Assessment #{assessmentNumber}
                                    </p>
                                    <p className="text-lg font-bold text-gray-800">
                                      📅 {formatDate(assessment.assessmentDate)}
                                    </p>
                                  </div>
                                  <span className={`px-4 py-2 rounded-xl font-bold text-sm shadow-md ${
                                    assessment.riskAssessment.finalRisk === 'Low Risk' ? 'bg-green-500 text-white' :
                                    assessment.riskAssessment.finalRisk === 'Medium Risk' ? 'bg-yellow-500 text-white' :
                                    'bg-red-500 text-white'
                                  }`}>
                                    {assessment.riskAssessment.finalRisk}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-4 gap-3 text-sm">
                                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                                    <p className="text-gray-600 font-semibold">Weight</p>
                                    <p className="font-bold text-gray-800">{assessment.healthParameters.weightKg} kg</p>
                                  </div>
                                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                                    <p className="text-gray-600 font-semibold">Temp</p>
                                    <p className="font-bold text-gray-800">{assessment.healthParameters.temperatureC} °C</p>
                                  </div>
                                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                                    <p className="text-gray-600 font-semibold">O₂ Sat</p>
                                    <p className="font-bold text-gray-800">{assessment.healthParameters.oxygenSaturation}%</p>
                                  </div>
                                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                                    <p className="text-gray-600 font-semibold">APGAR</p>
                                    <p className="font-bold text-gray-800">{assessment.healthParameters.apgarScore}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-3 text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded-lg">
                                  <p><strong>Confidence:</strong> {(assessment.riskAssessment.confidence * 100).toFixed(0)}%</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/baby/${babyId}/history`)}
                        className="mt-4 w-full text-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                      >
                        View Complete History →
                      </button>
                    </div>
                  )}
                </div>

                {/* Assessment Date */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">📅</span>
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
                  <p className="text-base text-gray-600 mt-3 font-semibold">
                    Today: {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Health Parameters */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="mr-3">🏥</span>
                    Health Parameters
                  </h2>

                  {/* Birth Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-purple-700 mb-5 pb-3 border-b-4 border-purple-300 flex items-center">
                      <span className="mr-2">👶</span>
                      Birth Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Gestational Age"
                        name="gestationalAgeWeeks"
                        value={healthParameters.gestationalAgeWeeks}
                        onChange={handleHealthParamChange}
                        error={errors.gestationalAgeWeeks}
                        placeholder="38"
                        unit="weeks"
                        min={normalRanges.gestationalAgeWeeks.min}
                        max={normalRanges.gestationalAgeWeeks.max}
                        step="1"
                      />
                      <InputField
                        label="Birth Weight"
                        name="birthWeightKg"
                        value={healthParameters.birthWeightKg}
                        onChange={handleHealthParamChange}
                        error={errors.birthWeightKg}
                        placeholder="3.2"
                        unit="kg"
                        min={normalRanges.birthWeightKg.min}
                        max={normalRanges.birthWeightKg.max}
                      />
                      <InputField
                        label="Birth Length"
                        name="birthLengthCm"
                        value={healthParameters.birthLengthCm}
                        onChange={handleHealthParamChange}
                        error={errors.birthLengthCm}
                        placeholder="50"
                        unit="cm"
                        min={normalRanges.birthLengthCm.min}
                        max={normalRanges.birthLengthCm.max}
                      />
                      <InputField
                        label="Birth Head Circumference"
                        name="birthHeadCircumferenceCm"
                        value={healthParameters.birthHeadCircumferenceCm}
                        onChange={handleHealthParamChange}
                        error={errors.birthHeadCircumferenceCm}
                        placeholder="34"
                        unit="cm"
                        min={normalRanges.birthHeadCircumferenceCm.min}
                        max={normalRanges.birthHeadCircumferenceCm.max}
                      />
                    </div>
                  </div>

                  {/* Current Measurements */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-blue-700 mb-5 pb-3 border-b-4 border-blue-300 flex items-center">
                      <span className="mr-2">📏</span>
                      Current Measurements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Age (Days)"
                        name="ageDays"
                        value={healthParameters.ageDays}
                        onChange={handleHealthParamChange}
                        error={errors.ageDays}
                        placeholder="5"
                        unit="days"
                        min={normalRanges.ageDays.min}
                        max={normalRanges.ageDays.max}
                        step="1"
                      />
                      <InputField
                        label="Current Weight"
                        name="weightKg"
                        value={healthParameters.weightKg}
                        onChange={handleHealthParamChange}
                        error={errors.weightKg}
                        placeholder="3.1"
                        unit="kg"
                        min={normalRanges.weightKg.min}
                        max={normalRanges.weightKg.max}
                      />
                      <InputField
                        label="Current Length"
                        name="lengthCm"
                        value={healthParameters.lengthCm}
                        onChange={handleHealthParamChange}
                        error={errors.lengthCm}
                        placeholder="50.5"
                        unit="cm"
                        min={normalRanges.lengthCm.min}
                        max={normalRanges.lengthCm.max}
                      />
                      <InputField
                        label="Current Head Circumference"
                        name="headCircumferenceCm"
                        value={healthParameters.headCircumferenceCm}
                        onChange={handleHealthParamChange}
                        error={errors.headCircumferenceCm}
                        placeholder="34.2"
                        unit="cm"
                        min={normalRanges.headCircumferenceCm.min}
                        max={normalRanges.headCircumferenceCm.max}
                      />
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-green-700 mb-5 pb-3 border-b-4 border-green-300 flex items-center">
                      <span className="mr-2">💓</span>
                      Vital Signs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Temperature"
                        name="temperatureC"
                        value={healthParameters.temperatureC}
                        onChange={handleHealthParamChange}
                        error={errors.temperatureC}
                        placeholder="36.8"
                        unit="°C"
                        min={normalRanges.temperatureC.min}
                        max={normalRanges.temperatureC.max}
                      />
                      <InputField
                        label="Heart Rate"
                        name="heartRateBpm"
                        value={healthParameters.heartRateBpm}
                        onChange={handleHealthParamChange}
                        error={errors.heartRateBpm}
                        placeholder="140"
                        unit="bpm"
                        min={normalRanges.heartRateBpm.min}
                        max={normalRanges.heartRateBpm.max}
                        step="1"
                      />
                      <InputField
                        label="Respiratory Rate"
                        name="respiratoryRateBpm"
                        value={healthParameters.respiratoryRateBpm}
                        onChange={handleHealthParamChange}
                        error={errors.respiratoryRateBpm}
                        placeholder="40"
                        unit="bpm"
                        min={normalRanges.respiratoryRateBpm.min}
                        max={normalRanges.respiratoryRateBpm.max}
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
                      />
                    </div>
                  </div>

                  {/* Feeding & Care */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-orange-700 mb-5 pb-3 border-b-4 border-orange-300 flex items-center">
                      <span className="mr-2">🍼</span>
                      Feeding & Daily Care
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <SelectField
                        label="Feeding Type"
                        name="feedingType"
                        value={healthParameters.feedingType}
                        onChange={handleHealthParamChange}
                        error={errors.feedingType}
                        options={[
                          { value: 'breast', label: 'Breast' },
                          { value: 'formula', label: 'Formula' },
                          { value: 'mixed', label: 'Mixed' }
                        ]}
                      />
                      <InputField
                        label="Feeding Frequency"
                        name="feedingFrequencyPerDay"
                        value={healthParameters.feedingFrequencyPerDay}
                        onChange={handleHealthParamChange}
                        error={errors.feedingFrequencyPerDay}
                        placeholder="8"
                        unit="times/day"
                        min={normalRanges.feedingFrequencyPerDay.min}
                        max={normalRanges.feedingFrequencyPerDay.max}
                        step="1"
                      />
                      <InputField
                        label="Urine Output Count"
                        name="urineOutputCount"
                        value={healthParameters.urineOutputCount}
                        onChange={handleHealthParamChange}
                        error={errors.urineOutputCount}
                        placeholder="6"
                        unit="times/day"
                        min={normalRanges.urineOutputCount.min}
                        max={normalRanges.urineOutputCount.max}
                        step="1"
                      />
                      <InputField
                        label="Stool Count"
                        name="stoolCount"
                        value={healthParameters.stoolCount}
                        onChange={handleHealthParamChange}
                        error={errors.stoolCount}
                        placeholder="4"
                        unit="times/day"
                        min={normalRanges.stoolCount.min}
                        max={normalRanges.stoolCount.max}
                        step="1"
                      />
                    </div>
                  </div>

                  {/* Laboratory & Assessment */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-pink-700 mb-5 pb-3 border-b-4 border-pink-300 flex items-center">
                      <span className="mr-2">🔬</span>
                      Laboratory & Assessment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Jaundice Level"
                        name="jaundiceLevelMgDl"
                        value={healthParameters.jaundiceLevelMgDl}
                        onChange={handleHealthParamChange}
                        error={errors.jaundiceLevelMgDl}
                        placeholder="8.5"
                        unit="mg/dL"
                        min={normalRanges.jaundiceLevelMgDl.min}
                        max={normalRanges.jaundiceLevelMgDl.max}
                      />
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
                  </div>

                  {/* Clinical Observations */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-indigo-700 mb-5 pb-3 border-b-4 border-indigo-300 flex items-center">
                      <span className="mr-2">👁️</span>
                      Clinical Observations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <SelectField
                        label="Immunizations Done?"
                        name="immunizationsDone"
                        value={healthParameters.immunizationsDone}
                        onChange={handleHealthParamChange}
                        error={errors.immunizationsDone}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                      <SelectField
                        label="Reflexes Normal?"
                        name="reflexesNormal"
                        value={healthParameters.reflexesNormal}
                        onChange={handleHealthParamChange}
                        error={errors.reflexesNormal}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Doctor Notes */}
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      📝 Doctor's Notes
                    </label>
                    <textarea
                      name="doctorNotes"
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Additional observations, concerns, or recommendations..."
                      rows="5"
                      className="w-full px-6 py-4 rounded-2xl border-3 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all shadow-lg text-base"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column - Action Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-8 sticky top-8 border-4 border-purple-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
                    Actions
                  </h3>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full py-4 px-6 rounded-2xl font-bold text-lg mb-4
                      flex items-center justify-center transition-all shadow-xl
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white hover:shadow-2xl transform hover:scale-105'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 mr-3" />
                        Assess Health Risk
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-lg border-3 border-gray-300 text-gray-700 hover:bg-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Over
                  </button>

                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-3 border-blue-300 shadow-lg">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center text-lg">
                      <AlertCircle className="w-6 h-6 mr-2" />
                      Important
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2 font-medium">
                      <li className="flex items-start">
                        <span className="mr-2">✅</span>
                        All fields are required
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">📊</span>
                        Values must be within valid ranges
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🔍</span>
                        Double-check measurements
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">📅</span>
                        Assessment for {new Date(assessmentDate).toLocaleDateString()}
                      </li>
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