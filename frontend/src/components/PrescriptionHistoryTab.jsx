// frontend/src/components/PrescriptionHistoryTab.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Pill,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { prescriptionService } from '../services/prescriptionService';

const PrescriptionHistoryTab = ({ baby }) => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [baby.babyId]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await prescriptionService.getByBabyId(baby.babyId);
      if (response.success) {
        setPrescriptions(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
      setError('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (prescriptionId) => {
    navigate(`/prescription/view/${prescriptionId}`);
  };

  const handleDownload = async (prescriptionId) => {
    setDownloadingId(prescriptionId);
    
    try {
      const blob = await prescriptionService.downloadPDF(prescriptionId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${baby.babyId}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download prescription');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-3 text-gray-600">Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-center">
        <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-semibold mb-2">
          No Prescriptions Yet
        </p>
        <p className="text-gray-500 text-sm">
          Prescriptions created for this patient will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Prescription History ({prescriptions.length})
        </h3>
      </div>

      {prescriptions.map((prescription) => (
        <div
          key={prescription._id}
          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Prescription #{prescription._id.slice(-6)}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleView(prescription._id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => handleDownload(prescription._id)}
                disabled={downloadingId === prescription._id}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:bg-gray-400"
              >
                {downloadingId === prescription._id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                PDF
              </button>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1 font-semibold">Diagnosis</p>
            <p className="text-gray-800">{prescription.diagnosis_summary}</p>
          </div>

          {/* Medicines */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-purple-600" />
              <p className="font-semibold text-gray-900">
                Medicines ({prescription.medicines.length})
              </p>
            </div>
            <div className="space-y-2">
              {prescription.medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{medicine.name}</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>
                        <strong>Dose:</strong> {medicine.dosage} • 
                        <strong className="ml-2">Frequency:</strong> {medicine.frequency}
                      </p>
                      <p>
                        <strong>Duration:</strong> {medicine.duration}
                      </p>
                      {medicine.instructions && (
                        <p className="text-xs italic">{medicine.instructions}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          {prescription.advice && (
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1 font-semibold">Medical Advice</p>
              <p className="text-gray-800">{prescription.advice}</p>
            </div>
          )}

          {/* Doctor Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p>
              <strong>Prescribed by:</strong> Dr. {prescription.doctor.name} • 
              <strong className="ml-2">Reg No:</strong> {prescription.doctor.registration_no}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionHistoryTab;