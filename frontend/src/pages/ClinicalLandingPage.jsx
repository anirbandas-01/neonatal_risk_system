import React, { useState } from 'react';
import { Heart, Shield, Clock, TrendingUp, Users, Award, CheckCircle, ArrowRight, Activity, Brain, Database, Lock, History, Stethoscope, FileCheck, AlertCircle, Mail, Linkedin, Github, User, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDoctorAuth } from '../context/DoctorAuthContext';
import { validateIndianPhone } from '../utils/phoneValidation'; 

export default function ClinicalLandingPage() {
  const navigate = useNavigate();
  
  const { doctor, login, register, logout, isAuthenticated } = useDoctorAuth();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registration_no: '',
    clinic_name: '',
    phone: '',
    address: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Handle signup with phone auto-formatting
    if (authMode === 'signup') {
      const phoneValidation = validateIndianPhone(formData.phone);
      if (!phoneValidation.isValid) {
        setAuthError(phoneValidation.message);
        return;
      }
      
      // Auto-format phone number before sending to backend
      const formattedPhone = phoneValidation.formatted || formData.phone;
      
      setAuthLoading(true);
      
      const result = await register({
        ...formData,
        phone: formattedPhone  // Send formatted phone
      });
      
      setAuthLoading(false);

      if (result.success) {
        setShowAuthModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          registration_no: '',
          clinic_name: '',
          phone: '',
          address: ''
        });
      } else {
        setAuthError(result.message);
      }
    } else {
      // Login logic
      setAuthLoading(true);
      const result = await login(formData.email, formData.password);
      setAuthLoading(false);

      if (result.success) {
        setShowAuthModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          registration_no: '',
          clinic_name: '',
          phone: '',
          address: ''
        });
      } else {
        setAuthError(result.message);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleStartAssessment = () => {
    if (isAuthenticated()) {
      navigate('/HomePage');
    } else {
      setShowAuthModal(true);
      setAuthMode('login');
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Professional Medical Header */}
      <header className="bg-white shadow-md border-b-2 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Newborn Health Monitor</h1>
                <p className="text-xs text-gray-600 font-medium">Clinical Decision Support System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated() ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {doctor.name}
                    </p>
                    <p className="text-xs text-green-600 flex items-center justify-end">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Authenticated
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Authorized Clinical Use</p>
                  <button
                    onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                    className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md font-semibold"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Doctor Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Clinical Focus */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-95"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-blue-800 bg-opacity-40 rounded-full mb-6 border-2 border-blue-300 shadow-lg">
              <Shield className="w-5 h-5 text-blue-100 mr-2" />
              <span className="text-white text-sm font-semibold tracking-wide">Clinical-Grade AI • HIPAA Compliant</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI-Assisted Newborn Health<br />Risk Assessment System
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              A clinical decision support tool designed to assist pediatricians and neonatologists 
              in early identification of potential newborn health risks using machine learning.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={handleStartAssessment}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-700 rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105 flex items-center"
              >
                <Activity className="w-6 h-6 mr-3" />
                {isAuthenticated() ? 'Go to Dashboard' : 'Login to Start'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => scrollToSection('capabilities')}
                className="px-8 py-4 bg-transparent hover:bg-white hover:bg-opacity-10 text-white border-2 border-white rounded-xl font-bold text-lg transition-all flex items-center backdrop-blur-sm"
              >
                <Stethoscope className="w-6 h-6 mr-3" />
                View System Capabilities
              </button>
            </div>
            
            <p className="text-blue-100 text-sm font-medium">
              Designed exclusively for pediatric clinical use • Supports informed medical decision-making
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-red-50 rounded-full mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-900 font-semibold">Clinical Challenge</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Clinical Challenge in Newborn Risk Assessment
              </h2>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Early identification of health risks in newborns is critical for timely intervention 
                and improved clinical outcomes. Traditional assessment methods rely heavily on manual 
                evaluation of multiple parameters, which may not always reveal hidden risk patterns.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                This system provides AI-assisted insights to support pediatricians by analyzing 
                structured newborn clinical data and highlighting potential risk indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Capabilities Section */}
      <section id="capabilities" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Clinical Capabilities</h2>
            <p className="text-xl text-gray-600">Advanced features designed for medical professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Machine Learning–Based Risk Prediction",
                description: "Evaluates newborn health parameters using trained machine learning models to estimate potential risk levels.",
                color: "blue"
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Structured Clinical Input",
                description: "Accepts standard neonatal parameters such as gestational age, birth weight, and physiological indicators for consistent assessment.",
                color: "indigo"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Rapid Decision Support",
                description: "Generates instant predictive insights to assist clinicians during time-sensitive evaluations.",
                color: "green"
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Clinical Data Security",
                description: "Ensures secure handling of sensitive medical data in alignment with clinical data protection practices.",
                color: "purple"
              },
              {
                icon: <History className="w-8 h-8" />,
                title: "Assessment History Tracking",
                description: "Stores historical newborn assessments to support follow-up analysis and clinical review.",
                color: "orange"
              },
              {
                icon: <Stethoscope className="w-8 h-8" />,
                title: "Hospital-Ready Interface",
                description: "Designed for efficient use in hospitals, clinics, and pediatric care environments.",
                color: "teal"
              }
            ].map((capability, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-300 group">
                <div className={`w-16 h-16 bg-${capability.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-${capability.color}-600`}>
                  {capability.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{capability.title}</h3>
                <p className="text-gray-600 leading-relaxed">{capability.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 max-w-4xl mx-auto bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 shadow-md">
            <p className="text-gray-800 font-semibold text-lg leading-relaxed">
              ℹ️ The system is specifically designed for neonatal parameters and is not intended for adult or general health assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Workflow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Clinical Workflow Overview</h2>
            <p className="text-xl text-gray-600">Simple, efficient process for clinical assessment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: "1",
                title: "Enter Clinical Parameters",
                description: "Input newborn clinical parameters after routine examination"
              },
              {
                step: "2",
                title: "Submit for Evaluation",
                description: "Submit data for AI-assisted risk evaluation"
              },
              {
                step: "3",
                title: "Review Risk Assessment",
                description: "Review generated risk assessment results"
              },
              {
                step: "4",
                title: "Clinical Decision Support",
                description: "Use predictive insights alongside professional judgment"
              }
            ].map((workflow, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl text-white transform transition-all hover:scale-105 hover:shadow-3xl border border-blue-400">
                  <div className="w-20 h-20 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center mb-5 shadow-xl border-4 border-blue-300 border-opacity-50">
                    <span className="text-4xl font-black text-white drop-shadow-lg">{workflow.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{workflow.title}</h3>
                  <p className="text-blue-50 leading-relaxed text-base">{workflow.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-10 h-10 text-blue-300 drop-shadow-lg" strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-700 mr-4 flex-shrink-0 mt-1" />
              <div>
                <p className="text-yellow-900 font-semibold text-lg">
                  This system is intended to assist clinicians and does not replace professional medical diagnosis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Transparency Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Clinician-Controlled AI Assistance</h2>
            </div>
            
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2 border-indigo-200">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Risk predictions are generated using machine learning models trained on structured datasets. 
                  The final medical decision remains entirely with the clinician.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  This system functions as a decision support tool and not as an autonomous diagnostic system.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t-2 border-gray-200">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">Model trained on structured datasets</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">Supports explainable indicators</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">Designed for clinical evaluation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intended Users Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Intended Clinical Users</h2>
            <p className="text-xl text-gray-600">Designed for medical professionals in pediatric care</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <Stethoscope className="w-8 h-8" />, title: "Pediatricians" },
              { icon: <Heart className="w-8 h-8" />, title: "Neonatologists" },
              { icon: <Activity className="w-8 h-8" />, title: "Child Health Specialists" },
              { icon: <FileCheck className="w-8 h-8" />, title: "Clinical Researchers" },
              { icon: <Award className="w-8 h-8" />, title: "Academic Institutions" }
            ].map((user, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition-all border-2 border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {user.icon}
                </div>
                <p className="font-bold text-gray-900">{user.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Development & Research Team</h2>
            <p className="text-xl text-gray-600">Dedicated researchers building clinical solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Developer 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-32"></div>
              <div className="relative px-8 pb-8">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white group-hover:scale-110 transition-transform">
                    <User className="w-16 h-16" />
                  </div>
                </div>
                <div className="pt-20 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Name</h3>
                  <p className="text-blue-600 font-semibold mb-4">Full Stack Developer</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Passionate about building healthcare solutions with AI and modern web technologies.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                      <Github className="w-5 h-5 text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-all group">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 h-32"></div>
              <div className="relative px-8 pb-8">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white group-hover:scale-110 transition-transform">
                    <User className="w-16 h-16" />
                  </div>
                </div>
                <div className="pt-20 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Friend's Name</h3>
                  <p className="text-indigo-600 font-semibold mb-4">ML Engineer & Backend Developer</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Specializing in machine learning models and robust backend architectures for healthcare.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="w-10 h-10 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors">
                      <Linkedin className="w-5 h-5 text-indigo-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors">
                      <Github className="w-5 h-5 text-indigo-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Disclaimer */}
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-900 bg-opacity-30 border-2 border-yellow-600 rounded-xl p-8 mb-12">
            <div className="flex items-start">
              <AlertCircle className="w-8 h-8 text-yellow-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">Medical Disclaimer</h3>
                <p className="text-yellow-100 leading-relaxed mb-2">
                  This application is developed for academic and clinical decision support purposes only.
                </p>
                <p className="text-yellow-100 leading-relaxed">
                  It does not replace professional medical diagnosis or treatment.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">© 2024 Newborn Health Monitor. All rights reserved.</p>
            <p>Clinical Decision Support System • For Medical Professionals Only</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                {authMode === 'login' ? 'Doctor Login' : 'Doctor Registration'}
              </h2>
              <p className="text-blue-100">
                {authMode === 'login' 
                  ? 'Access clinical assessment tools' 
                  : 'Create your professional account'}
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="p-6">
              {authError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {authError}
                </div>
              )}

              {authMode === 'signup' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hospital/Clinic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clinic_name}
                      onChange={(e) => setFormData({...formData, clinic_name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="City Medical Center"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medical License Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.registration_no}
                      onChange={(e) => setFormData({...formData, registration_no: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="MED-123456"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      onBlur={(e) => {
                        // Auto-format phone number on blur
                        const validation = validateIndianPhone(e.target.value);
                        if (validation.isValid && validation.formatted) {
                          setFormData({...formData, phone: validation.formatted});
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="+91XXXXXXXXXX"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 10 digits (e.g., 8101733466) or full format (+918101733466)
                    </p>
                  </div>

                  {/* <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Clinic/Hospital Address * 
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="123 Medical Plaza"
                    />
                  </div> */}
                  <div className="mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Clinic/Hospital Address *
  </label>
  <textarea
    type="text"
    required
    value={formData.address}
    onChange={(e) => setFormData({...formData, address: e.target.value})}
    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
    placeholder="123 Medical Plaza, City, State, Pincode"
    rows="3"
  />
  <p className="text-xs text-gray-500 mt-1">Full clinic address including city and pincode</p>
</div>
                </>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="doctor@hospital.com"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                  minLength={6}
                />
                {authMode === 'signup' && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  authMode === 'login' ? 'Login to Dashboard' : 'Register Account'
                )}
              </button>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setAuthError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Login'}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthError('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}