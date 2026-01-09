import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import BabySearch from '../components/BabySearch';
import BabyInfoForm from '../components/BabyInfoForm';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import { validateField, validationRanges, normalRanges } from '../utils/validation';
import { generateBabyId } from '../utils/helpers';
import { assessmentAPI } from '../services/api';

function AssessmentFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from baby history (to add new assessment)
  const existingBaby = location.state?.baby;
  
  const [mode, setMode] = useState(existingBaby ? 'existing' : 'search'); // 'search', 'new', 'existing'
  //const [foundBaby, setFoundBaby] = useState(existingBaby || null);
  
  // Baby ID state
  const [babyId, setBabyId] = useState(existingBaby?.babyId || '');
  
  // Baby info state
  const [babyInfo, setBabyInfo] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: 'Unknown'
  });
  
  // Parent info state
  const [parentInfo, setParentInfo] = useState({
    motherName: '',
    fatherName: '',
    contactNumber: '',
    email: '',
    address: ''
  });
  
  // Health parameters state
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

  // If coming from history page, show existing baby info
/*   useEffect(() => {
    if (existingBaby) {
      setFoundBaby(existingBaby);
      setBabyId(existingBaby.babyId);
      setMode('existing');
    }
  }, [existingBaby]); */
  // If coming from history page, show existing baby info
useEffect(() => {
  if (existingBaby) {
    setSelectedBaby(existingBaby);
    setBabyId(existingBaby.babyId);
    setBabyType('existing');
    setStep(3);
    
    // ✅ ADD THIS: Auto-fill from last assessment
    if (existingBaby.assessments && existingBaby.assessments.length > 0) {
      const lastAssmt = existingBaby.assessments[0]; // Most recent
      setLastAssessment(lastAssmt);
      
      // Pre-fill all fields
      const prefilledData = prefillFromLastAssessment(lastAssmt, existingBaby.babyInfo);
      setHealthParameters(prefilledData);
      setAutoFilled(true);
    }
  }
}, [existingBaby]);

  const handleBabyFound = (baby) => {
    setFoundBaby(baby);
    setBabyId(baby.babyId);
    setMode('existing');

    if (baby.assessments && baby.assessments.length > 0) {
    const lastAssmt = baby.assessments[0]; // Most recent
    setLastAssessment(lastAssmt);
    
    // Pre-fill all fields
    const prefilledData = prefillFromLastAssessment(lastAssmt, baby.babyInfo);
    setHealthParameters(prefilledData);
    setAutoFilled(true);
  }
  };

  const handleNewBaby = (suggestedId) => {
    setMode('new');
    setBabyId(suggestedId || generateBabyId());
    //setFoundBaby(null);
    setSelectedBaby(null);
  };

  const handleBabyInfoChange = (section, name, value) => {
    if (section === 'babyInfo') {
      setBabyInfo(prev => ({ ...prev, [name]: value }));
    } else if (section === 'parentInfo') {
      setParentInfo(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
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
    
    // Validate field if it has validation rules
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
    
    if (mode === 'new') {
      // Validate baby info
      if (!babyInfo.name.trim()) babyErrors.name = 'Baby name is required';
      if (!babyInfo.dateOfBirth) babyErrors.dateOfBirth = 'Date of birth is required';
      if (!babyInfo.gender) babyErrors.gender = 'Gender is required';
      
      // Validate parent info
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
    
    // Validate dropdown fields
    if (!healthParameters.birthDefects) paramErrors.birthDefects = 'This field is required';
    if (!healthParameters.normalReflexes) paramErrors.normalReflexes = 'This field is required';
    if (!healthParameters.immunizations) paramErrors.immunizations = 'This field is required';
    
    return paramErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const { babyErrors, parentErrors } = validateBabyInfo();
    const paramErrors = validateHealthParameters();
    
    const allErrors = {
      ...paramErrors,
      ...(Object.keys(babyErrors).length > 0 && { babyInfo: babyErrors }),
      ...(Object.keys(parentErrors).length > 0 && { parentInfo: parentErrors })
    };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const assessmentData = {
        isNewBaby: mode === 'new',
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
      
      // Add baby and parent info if new baby
      if (mode === 'new') {
        assessmentData.babyInfo = babyInfo;
        assessmentData.parentInfo = parentInfo;
      }
      
      console.log('Submitting assessment:', assessmentData);
      
      const response = await assessmentAPI.createOrUpdate(assessmentData);
      
      console.log('Assessment created:', response);
      setSubmitSuccess(true);
      
      // Navigate to results after 1.5 seconds
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
    setMode('search');
    setFoundBaby(null);
    setBabyId('');
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
              {mode === 'new' ? 'Creating new baby record' : 
               mode === 'existing' ? 'Adding assessment to existing baby' : 
               'Search or create baby record'}
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Baby Search/Selection */}
              {mode === 'search' && (
                <BabySearch 
                  onBabyFound={handleBabyFound}
                  onNewBaby={handleNewBaby}
                />
              )}

              {/* Baby ID Display */}
              {(mode === 'new' || mode === 'existing') && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Baby ID</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {mode === 'new' ? 'New baby record' : 'Existing baby - adding new assessment'}
                      </p>
                    </div>
                    {mode !== 'existing' && (
                      <button
                        type="button"
                        onClick={() => setMode('search')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold underline"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={babyId}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-700 font-mono font-semibold text-lg"
                  />
                  
                  {foundBaby && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Name:</strong> {foundBaby.babyInfo.name} | 
                        <strong className="ml-2">Previous Visits:</strong> {foundBaby.totalVisits} |
                        <strong className="ml-2">Current Risk:</strong> <span className={`${
                          foundBaby.currentRiskLevel === 'Low Risk' ? 'text-green-600' :
                          foundBaby.currentRiskLevel === 'Medium Risk' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{foundBaby.currentRiskLevel}</span>
                      </p>
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
              )}

              {/* Baby & Parent Info (only for new baby) */}
              {mode === 'new' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <BabyInfoForm
                    babyInfo={babyInfo}
                    parentInfo={parentInfo}
                    onChange={handleBabyInfoChange}
                    errors={errors}
                  />
                </div>
              )}

              {/* Assessment Date */}
              {(mode === 'new' || mode === 'existing') && (
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
                </div>
              )}

              {/* Health Parameters */}
              {(mode === 'new' || mode === 'existing') && (
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
              )}

            </div>

            {/* Right Column - Action Panel */}
            {(mode === 'new' || mode === 'existing') && (
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
                        {mode === 'new' ? 'Create & Assess' : 'Add Assessment'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Form
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
                      <li>• AI will analyze risk level</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </form>

      </div>
    </div>
  );
}

export default AssessmentFormPage;