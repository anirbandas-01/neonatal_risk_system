function InputField({ 
  label, 
  name, 
  type = "number", 
  value, 
  onChange,
  onBlur, 
  error, 
  placeholder,
  unit,
  min,
  max,
  step = "0.1",
  required = true,
  disabled = false
}) {
  
  // Determine if value is in normal range (for visual feedback)
  const isError = error && error.length > 0;
  
  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Input Container */}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${isError 
              ? 'border-red-500 focus:border-red-600 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${unit ? 'pr-16' : ''}
          `}
        />
        
        {/* Unit Display */}
        {unit && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
            {unit}
          </span>
        )}
      </div>
      
      {/* Error Message */}
      {isError && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper text - Range info */}
      {!isError && min && max && (
        <p className="mt-1 text-xs text-gray-500">
          Normal range: {min} - {max} {unit}
        </p>
      )}
    </div>
  );
}

export default InputField;