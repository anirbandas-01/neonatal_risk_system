// frontend/src/components/GlobalSearchButton.jsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from '../context/SearchContext';

const GlobalSearchButton = () => {
  const { openSearch } = useSearchContext();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide button when scrolling down on mobile (optional UX improvement)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only on mobile
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide button
          setIsVisible(false);
        } else {
          // Scrolling up - show button
          setIsVisible(true);
        }
      } else {
        // Always visible on desktop
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Mobile & Tablet - Floating Button */}
      <button
        onClick={openSearch}
        className={`
          fixed z-50 
          bottom-6 right-6
          lg:hidden
          w-16 h-16
          bg-gradient-to-br from-blue-600 to-indigo-700
          hover:from-blue-700 hover:to-indigo-800
          text-white
          rounded-full
          shadow-2xl
          flex items-center justify-center
          transition-all duration-300 ease-out
          active:scale-95
          group
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        `}
        aria-label="Search patients"
        title="Search patients (Ctrl+K)"
      >
        {/* Animated pulse ring */}
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
        
        {/* Search icon */}
        <Search className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
        
        {/* Badge showing shortcut hint on desktop */}
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-lg">
          K
        </span>
      </button>

      {/* Desktop - Integrated in navbar (we'll add this to navbar separately) */}
      {/* This button is hidden on desktop because we'll integrate search into navbar */}
    </>
  );
};

export default GlobalSearchButton;