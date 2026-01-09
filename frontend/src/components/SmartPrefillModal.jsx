import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function SmartPrefillSection({ 
  title, 
  icon, 
  badge,
  defaultOpen = false,
  children 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {badge && (
              <span className="text-xs text-gray-600">{badge}</span>
            )}
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default SmartPrefillSection;