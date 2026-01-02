import InputField from './InputField';
import SelectField from './SelectField';
import { validateIndianPhone, formatIndianPhone } from '../utils/phoneValidation';
import { useState } from 'react'; 


function BabyInfoForm({ babyInfo, parentInfo, onChange, errors, disabled = false }) {
  const [phoneError, setPhoneError] = useState('');
  
  const handleChange = (e, section) => {
    const { name, value } = e.target;


     if (name === 'contactNumber' && section === 'parentInfo') {
      const validation = validateIndianPhone(value);
      
      if (value && !validation.isValid) {
        setPhoneError(validation.message);
      } else {
        setPhoneError('');
        // Auto-format if valid
        if (validation.formatted) {
          onChange(section, name, validation.formatted);
          return;
        }
      }
    }

    onChange(section, name, value);
  };

  return (
    <div className="space-y-6">
      {/* Baby Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          Baby Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Baby Name"
            name="name"
            type="text"
            value={babyInfo.name}
            onChange={(e) => handleChange(e, 'babyInfo')}
            error={errors?.babyInfo?.name}
            placeholder="John Doe"
            disabled={disabled}
          />
          
          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={babyInfo.dateOfBirth}
            onChange={(e) => handleChange(e, 'babyInfo')}
            error={errors?.babyInfo?.dateOfBirth}
            disabled={disabled}
          />
          
          <SelectField
            label="Gender"
            name="gender"
            value={babyInfo.gender}
            onChange={(e) => handleChange(e, 'babyInfo')}
            error={errors?.babyInfo?.gender}
            disabled={disabled}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          
          <SelectField
            label="Blood Group"
            name="bloodGroup"
            value={babyInfo.bloodGroup}
            onChange={(e) => handleChange(e, 'babyInfo')}
            error={errors?.babyInfo?.bloodGroup}
            disabled={disabled}
            required={false}
            options={[
              { value: 'Unknown', label: 'Unknown' },
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' }
            ]}
          />
        </div>
      </div>

      {/* Parent Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          Parent Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Mother's Name"
            name="motherName"
            type="text"
            value={parentInfo.motherName}
            onChange={(e) => handleChange(e, 'parentInfo')}
            error={errors?.parentInfo?.motherName}
            placeholder="Jane Doe"
            disabled={disabled}
          />
          
          <InputField
            label="Father's Name"
            name="fatherName"
            type="text"
            value={parentInfo.fatherName}
            onChange={(e) => handleChange(e, 'parentInfo')}
            error={errors?.parentInfo?.fatherName}
            placeholder="John Doe Sr."
            required={false}
            disabled={disabled}
          />
          
          <InputField
                label="Contact Number"
                name="contactNumber"
                type="tel"
                value={parentInfo.contactNumber}
                onChange={(e) => handleChange(e, 'parentInfo')}
                onBlur={(e) => {
                  // ✅ AUTO-FORMAT ON BLUR
                  const validation = validateIndianPhone(e.target.value);
                  if (validation.isValid && validation.formatted) {
                    onChange('parentInfo', 'contactNumber', validation.formatted);
                  }
                }}
                error={phoneError || errors?.parentInfo?.contactNumber}
                placeholder="+91XXXXXXXXXX"
                disabled={disabled}
              />
              {/* ✅ ADD HELPER TEXT */}
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Enter 10 digits or full format with +91
              </p>
          
          <InputField
            label="Email"
            name="email"
            type="email"
            value={parentInfo.email}
            onChange={(e) => handleChange(e, 'parentInfo')}
            error={errors?.parentInfo?.email}
            placeholder="parent@example.com"
            required={false}
            disabled={disabled}
          />
          
          <div className="md:col-span-2">
            <InputField
              label="Address"
              name="address"
              type="text"
              value={parentInfo.address}
              onChange={(e) => handleChange(e, 'parentInfo')}
              error={errors?.parentInfo?.address}
              placeholder="123 Main St, City, Country"
              required={false}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BabyInfoForm;