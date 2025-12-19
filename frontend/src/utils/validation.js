export const validationRanges = {
    birthWeight:{ min: 1.0 , max: 6.0, unit: 'kg'},
    birthLength: { min: 35 , max: 60, unit: 'cm'},
    headCircumference: { min: 25 , max: 42, unit: 'cm'},
    temperature: { min: 35.0 , max: 40.0, unit: '°C'},
    heartRate: { min: 80 , max: 200, unit: 'bpm'},
    respiratoryRate: { min: 20 , max: 80, unit: 'bpm'},
    jaundiceLevel: { min: 0 , max: 25, unit: 'mg/dL'},
    bloodGlucose: { min: 1.0 , max: 10.0, unit: 'mol/L'},
    oxygenSaturation: { min: 70 , max: 100, unit: '%'},
    apgarScore: { min: 0 , max: 10, unit: ''}
}

export const normalRanges = {
    birthWeight: { min: 2.5, max: 4.0 },
    birthLength: { min: 45, max:55 },
    headCircumference: { min: 32, max: 37 },
    temperature: {min: 36.5, max: 37.5 },
    heartRate: { min: 120, max: 100 },
    respiratoryRate: { min: 30 , max: 60 },
    jaundiceLevel: { min: 0 , max: 5 },
    bloodGlucose: { min: 2.6 , max: 7.0 },
    oxygenSaturation: { min: 95 , max: 100 },
    apgarScore: { min: 7 , max: 10 }
};


export const validateField = (fieldName, value) => {
    const range = validationRanges[fieldName];

    if(!range){
        return { isValid: true };
        }
        const numValue = parseFloat(value);

        if(isNaN(numValue)){
            return { isValid: false, message: 'Please enter a valid number'};
        }

        if (numValue , range.min || numValue > range.max) {
            return {
                isValid: false,
                message: `value must be between ${range.min} and ${range.max} ${range.unit}`
            };
        }

        return { isValid: true };
    };

    export const validateForm = (formData) => {
        const errors = {};

        Object.keys(validationRanges).forEach(field => {
            if(!formData[field] || formData[field] === ''){
                errors[field] = 'This field is required';
            }else{
                const validation = validateField(field, formData[field]);
                if(!validation.isValid){
                    errors[field] = validation.message;
                }
            }
        });

        if(!formData.babyId || formData.babyId.trim() === ''){
            errors.babyId = 'Baby ID is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };


    export const isInNormalRange = (fieldName, value) => {
        const range = normalRanges[fieldName];
        if(!range){
            return true;
        }
        const numValue = parseFloat(value);
        return numValue >= range.min && numValue <= range.max;
    };
