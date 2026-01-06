// frontend/src/components/MobileChartWrapper.jsx
import React from 'react';

const MobileChartWrapper = ({ children, title, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[300px] sm:min-w-0 px-4 sm:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileChartWrapper;