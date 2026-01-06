
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDoctorAuth } from '../context/DoctorAuthContext';
import { useSearchContext } from '../context/SearchContext';


import { Heart, Home,Search , LayoutDashboard, FileText, User, LogOut, Menu, X, Settings } from 'lucide-react';


function DoctorNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor, logout } = useDoctorAuth();
  const { openSearch } = useSearchContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  
  // Check if we're on the HomePage
  const isOnHomePage = location.pathname === '/HomePage';

  // Navigation items - will be hidden on HomePage
  const navItems = [
    { path: '/HomePage', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/assessment', label: 'New Assessment', icon: <FileText className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> }
  ];
   useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [openSearch]);



  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Always clickable to HomePage */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => navigate('/HomePage')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-gray-900">Clinical Portal</h1>
              <p className="text-xs text-gray-600 font-medium">Neonatal Assessment System</p>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <button
              onClick={openSearch}
              className="w-full flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition-colors group"
            >
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-gray-500 flex-1 text-left">
                Search patients...
              </span>
              <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono text-gray-600">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Desktop Nav - Conditional rendering based on page */}
          <div className="hidden md:flex items-center space-x-2">
            {!isOnHomePage && (
              <>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Doctor Profile Section */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                Dr. {doctor.name}
              </p>
              <p className="text-xs text-green-600 flex items-center justify-end">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Online
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition-shadow"
              >
                {doctor.name.charAt(0).toUpperCase()}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">Dr. {doctor.name}</p>
                    <p className="text-xs text-gray-600">{doctor.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            {!isOnHomePage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only show if not on HomePage */}
        {!isOnHomePage && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg font-semibold ${
                  isActive(item.path)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default DoctorNavbar;