// Phone number validation for India
export const validateIndianPhone = (phoneNumber) => {
  // Remove all spaces and special characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it starts with +91
  if (cleaned.startsWith('+91')) {
    // Extract digits after +91
    const digits = cleaned.substring(3);
    
    if (digits.length < 10) {
      return {
        isValid: false,
        message: 'Phone number must have 10 digits after +91'
      };
    }
    
    if (digits.length > 10) {
      return {
        isValid: false,
        message: 'Phone number should have exactly 10 digits after +91'
      };
    }
    
    // Valid format: +91XXXXXXXXXX (10 digits)
    return { isValid: true };
  }
  
  // Check if it's just 10 digits (we'll auto-add +91)
  if (/^\d{10}$/.test(cleaned)) {
    return {
      isValid: true,
      formatted: `+91${cleaned}`
    };
  }
  
  return {
    isValid: false,
    message: 'Phone number must be in format +91XXXXXXXXXX (10 digits)'
  };
};

// Format phone number to +91XXXXXXXXXX
export const formatIndianPhone = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  
  return phoneNumber;
};