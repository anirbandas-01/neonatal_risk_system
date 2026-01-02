import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

function PrescriptionViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prescriptionId } = useParams();
  
  const [prescription, setPrescription] = useState(location.state?.prescription || null);
  const [loading, setLoading] = useState(!prescription);
  const [error, setError] = useState('');
  const [downloadMessage, setDownloadMessage] = useState('');

  useEffect(() => {
    if (!prescription && prescriptionId) {
      fetchPrescription();
    }
  }, [prescriptionId, prescription]);

  const fetchPrescription = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prescription/${prescriptionId}`);
      setPrescription(response.data.data);
    } catch (err) {
      setError('Failed to load prescription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadMessage('Generating PDF...');
      
      const response = await axios.get(
        `${API_BASE_URL}/prescription/${prescriptionId}/download`,
        { responseType: 'blob' }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${prescription.patient.baby_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setDownloadMessage('Download successful!');
      setTimeout(() => setDownloadMessage(''), 3000);
    } catch (err) {
      setDownloadMessage('Download failed');
      console.error(err);
      setTimeout(() => setDownloadMessage(''), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prescription Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load prescription'}</p>
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
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header - No Print */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Prescription View
              </h1>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print
                </button>
              </div>
            </div>
            
            {downloadMessage && (
              <div className="mt-4 text-center">
                <span className={`text-sm font-semibold ${
                  downloadMessage.includes('successful') ? 'text-green-600' : 
                  downloadMessage.includes('failed') ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {downloadMessage}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Prescription Document */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 print:shadow-none print:rounded-none">
          
          {/* Header - Doctor/Clinic Info */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {prescription.doctor.clinic_name}
            </h2>
            <p className="text-lg font-semibold text-gray-700">
              Dr. {prescription.doctor.name}
            </p>
            <p className="text-sm text-gray-600">
              Registration No: {prescription.doctor.registration_no}
            </p>
            
            <p className="text-sm text-gray-600">
              📞 Phone: {prescription.doctor.phone}
            </p>
            {/* {prescription.doctor.email && (
              <p className="text-sm text-gray-600">
                ✉️ Email: {prescription.doctor.email}
              </p>
            )} */}
           <p className="text-sm text-gray-600">
             ✉️ Email: {prescription.doctor.email || 'Not provided'}
           </p>
            {prescription.doctor.address && (
              <p className="text-sm text-gray-600">{prescription.doctor.address}</p>
            )}
          </div>

          {/* Date */}
          <div className="text-right mb-6">
            <p className="text-sm text-gray-600">
              Date: {new Date(prescription.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 underline">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Patient Name:</span> {prescription.patient.name}
              </div>
              <div>
                <span className="font-semibold">Baby ID:</span> {prescription.patient.baby_id}
              </div>
              <div>
                <span className="font-semibold">Age:</span> {prescription.patient.age_days} days
              </div>
              <div>
                <span className="font-semibold">Gender:</span> {prescription.patient.gender}
              </div>
              
              <div className="col-span-2">
                <span className="font-semibold">📞 Parent Contact:</span> {prescription.patient.parent_phone}
              </div>
              {prescription.patient.parent_email && prescription.patient.parent_email !== '' && (
                <div className="col-span-2">
                  <span className="font-semibold">✉️ Parent Email:</span> {prescription.patient.parent_email}
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 underline">
              Diagnosis
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {prescription.diagnosis_summary}
            </p>
          </div>

          {/* Prescription Symbol and Medicines */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ℞ Prescription
            </h3>
            
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="mb-5 pl-4 border-l-4 border-blue-500 bg-gray-50 p-4 rounded">
                <h4 className="font-bold text-gray-900 mb-2">
                  {index + 1}. {medicine.name}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 ml-4">
                  <div>
                    <span className="font-semibold">Dosage:</span> {medicine.dosage}
                  </div>
                  <div>
                    <span className="font-semibold">Frequency:</span> {medicine.frequency}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Timing:</span> {medicine.timing.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {medicine.duration}
                  </div>
                  {medicine.instructions && (
                    <div className="col-span-2">
                      <span className="font-semibold">Instructions:</span> {medicine.instructions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Medical Advice */}
          {prescription.advice && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 underline">
                Medical Advice
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {prescription.advice}
              </p>
            </div>
          )}

          {/* Doctor Signature */}
          <div className="mt-12 text-right">
            <div className="inline-block">
              <div className="border-t-2 border-gray-400 pt-2 min-w-[200px]">
                <p className="font-semibold text-gray-900">Dr. {prescription.doctor.name}</p>
                <p className="text-sm text-gray-600">Reg. No: {prescription.doctor.registration_no}</p>
              </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-12 text-center text-xs text-gray-500 italic border-t pt-6">
            <p>This is a computer-generated prescription. Please follow the instructions carefully.</p>
            <p>For any queries, contact the clinic.</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PrescriptionViewPage;