function SelectField({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  error,
  required = true,
  disabled = false
}) {
  
  const isError = error && error.length > 0;
  
  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Select Dropdown */}
      <select
        name={name}
        value={value}
        onChange={onChange}
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
          appearance-none bg-white
          cursor-pointer
        `}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom Dropdown Arrow */}
      <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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
    </div>
  );
}

export default SelectField;