'use client'

import { useState } from 'react';
import api from '../../../../utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import './signup-enhancements.css';

const FormContent = ({ userType = 'candidate' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    // Company fields for employers
    companyOption: '', // 'existing', 'new', 'join'
    selectedCompanyId: '',
    companyName: '',
    companyEmail: '',
    companyWebsite: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Company Selection (for employers)
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const router = useRouter();
  const { login } = useAuth();

  // Mock existing companies data - replace with API call
  const mockCompanies = [
    { id: 1, name: 'Google', email: 'hr@google.com', website: 'google.com' },
    { id: 2, name: 'Microsoft', email: 'jobs@microsoft.com', website: 'microsoft.com' },
    { id: 3, name: 'Apple', email: 'careers@apple.com', website: 'apple.com' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error when user makes changes
    if (error) {
      setError('');
    }

    // Check for duplicate company when typing company name
    if (name === 'companyName' && value.length > 2) {
      checkDuplicateCompany(value);
    }
  };

  const checkDuplicateCompany = (companyName) => {
    const duplicate = mockCompanies.find(company => 
      company.name.toLowerCase().includes(companyName.toLowerCase())
    );
    
    if (duplicate) {
      setDuplicateWarning(`Company "${duplicate.name}" already exists. Consider joining instead.`);
      setExistingCompanies([duplicate]);
    } else {
      setDuplicateWarning('');
      setExistingCompanies([]);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 6 characters
    return password.length >= 6;
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation - at least 10 digits
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };
  
  const validateStep1 = () => {
    const errors = {};
    let hasErrors = false;

    // Validate firstName
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
      hasErrors = true;
    }

    // Validate lastName
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
      hasErrors = true;
    }

    // Validate username
    if (!formData.username || formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
      hasErrors = true;
    }

    // Validate email
    if (!formData.email) {
      errors.email = 'Email address is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    // Validate phone number
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
      hasErrors = true;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)';
      hasErrors = true;
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
      hasErrors = true;
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      hasErrors = true;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    setFieldErrors(errors);

    if (hasErrors) {
      setError('Please fix all field errors before continuing');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (userType !== 'employer') return true;

    const errors = {};
    let hasErrors = false;

    if (!formData.companyOption) {
      setError('Please select a company option');
      return false;
    }

    if (formData.companyOption === 'existing' && !formData.selectedCompanyId) {
      setError('Please select an existing company');
      return false;
    }

    if (formData.companyOption === 'new') {
      if (!formData.companyName || formData.companyName.trim().length < 2) {
        errors.companyName = 'Company name must be at least 2 characters';
        hasErrors = true;
      }

      if (!formData.companyEmail) {
        errors.companyEmail = 'Company email is required';
        hasErrors = true;
      } else if (!validateEmail(formData.companyEmail)) {
        errors.companyEmail = 'Please enter a valid company email';
        hasErrors = true;
      }

      setFieldErrors(errors);

      if (hasErrors) {
        setError('Please fix all company information errors');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    // Clear previous errors
    setError('');
    setFieldErrors({});
    
    if (step === 1) {
      // Validate personal information thoroughly
      if (!validateStep1()) {
        // Validation failed, don't proceed to step 2
        console.log('Step 1 validation failed, staying on step 1');
        return;
      }
      
      // Only proceed if validation passes
      if (userType === 'employer') {
        setStep(2);
        console.log('Moving to step 2 - Company Selection');
      } else {
        // For candidates, proceed to submit
        handleSubmit();
      }
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
    setFieldErrors({});
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    setFieldErrors({});
    
    // Validate current step
    if (step === 1) {
      if (!validateStep1()) {
        console.log('Final validation failed on step 1');
        return;
      }
    }
    
    if (step === 2) {
      if (!validateStep2()) {
        console.log('Final validation failed on step 2');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Prepare signup data according to API specification
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber.trim(),
        role: userType.toUpperCase() // Convert 'candidate'/'employer' to 'CANDIDATE'/'EMPLOYER'
      };

      // Add company data for employers
      if (userType === 'employer') {
        signupData.companyData = {
          option: formData.companyOption,
          selectedCompanyId: formData.selectedCompanyId,
          companyName: formData.companyName?.trim(),
          companyEmail: formData.companyEmail?.trim(),
          companyWebsite: formData.companyWebsite?.trim()
        };
      }
      
      console.log('Attempting to register with:', {
        ...signupData,
        password: "***hidden***",
        confirmPassword: "***hidden***"
      });
      
      // Call the registration API
      const response = await api.register(signupData);
      
      console.log('Registration successful:', response);
      setSuccess('Registration successful! Logging you in...');
      
      // Backend automatically calls login, so we get user data in response
      // Extract user data from response.data if it exists
      const userData = response.user || response.data || {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        username: formData.username,
        role: userType.toUpperCase(),
        avatar: "/images/resource/candidate-1.png"
      };
      
      // Update auth context with the logged-in user
      login(userData);
      
      // Close register modal and redirect after a short delay
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const modalCloseButton = document.querySelector('[data-bs-dismiss="modal"]');
          if (modalCloseButton) {
            modalCloseButton.click();
          }
        }
        
        // Redirect based on user type
        if (userType === 'employer') {
          router.push('/employers-dashboard/dashboard');
        } else {
          router.push('/candidates-dashboard/dashboard');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Personal Information
  const renderStep1 = () => (
    <>
      <div className="form-group">
          <label>First Name <span className="required">*</span></label>
          <input 
            type="text" 
            name="firstName" 
            placeholder="Enter first name" 
            required 
            value={formData.firstName}
            onChange={handleChange}
          className={fieldErrors.firstName ? 'error' : ''}
          />
        {fieldErrors.firstName && (
          <span className="field-error">{fieldErrors.firstName}</span>
        )}
        </div>
        
      <div className="form-group">
          <label>Last Name <span className="required">*</span></label>
          <input 
            type="text" 
            name="lastName" 
            placeholder="Enter last name" 
            required 
            value={formData.lastName}
            onChange={handleChange}
          className={fieldErrors.lastName ? 'error' : ''}
          />
        {fieldErrors.lastName && (
          <span className="field-error">{fieldErrors.lastName}</span>
        )}
      </div>
      
      <div className="form-group">
        <label>Username <span className="required">*</span></label>
        <input 
          type="text" 
          name="username" 
          placeholder="Choose username" 
          required 
          value={formData.username}
          onChange={handleChange}
          className={fieldErrors.username ? 'error' : ''}
        />
        {fieldErrors.username && (
          <span className="field-error">{fieldErrors.username}</span>
        )}
      </div>
      
      <div className="form-group">
        <label>Email Address <span className="required">*</span></label>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter email address" 
          required 
          value={formData.email}
          onChange={handleChange}
          className={fieldErrors.email ? 'error' : ''}
        />
        {fieldErrors.email && (
          <span className="field-error">{fieldErrors.email}</span>
        )}
      </div>
      
      <div className="form-group">
        <label>Phone Number <span className="required">*</span></label>
        <input 
          type="text" 
          name="phoneNumber" 
          placeholder="Enter phone number" 
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          className={fieldErrors.phoneNumber ? 'error' : ''}
        />
        {fieldErrors.phoneNumber && (
          <span className="field-error">{fieldErrors.phoneNumber}</span>
        )}
      </div>

      <div className="form-group">
        <label>Password <span className="required">*</span></label>
        <input
          type="password"
          name="password"
          placeholder="Create password (min 6 characters)"
          required
          value={formData.password}
          onChange={handleChange}
          className={fieldErrors.password ? 'error' : ''}
        />
        {fieldErrors.password && (
          <span className="field-error">{fieldErrors.password}</span>
        )}
      </div>
      
      <div className="form-group">
        <label>Confirm Password <span className="required">*</span></label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className={fieldErrors.confirmPassword ? 'error' : ''}
        />
        {fieldErrors.confirmPassword && (
          <span className="field-error">{fieldErrors.confirmPassword}</span>
        )}
      </div>

      <div className="form-group">
        <button 
          className="theme-btn btn-style-one" 
          type="button"
          onClick={handleNextStep}
          disabled={isLoading}
        >
          {userType === 'employer' ? 'Next: Company Selection' : 'Register as Candidate'}
        </button>
      </div>
    </>
  );

  // Step 2: Company Selection (for employers only)
  const renderStep2 = () => (
    <>
      <div className="form-group">
        <h5>Company Information</h5>
        <p>How would you like to handle your company profile?</p>
      </div>

      <div className="form-group">
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="companyOption"
              value="new"
              checked={formData.companyOption === 'new'}
              onChange={handleChange}
            />
            <span>Create new company profile</span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="companyOption"
              value="existing"
              checked={formData.companyOption === 'existing'}
              onChange={handleChange}
            />
            <span>Join existing company</span>
          </label>
        </div>
      </div>

      {formData.companyOption === 'new' && (
        <>
          <div className="form-group">
            <label>Company Name <span className="required">*</span></label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              required
              value={formData.companyName}
              onChange={handleChange}
              className={fieldErrors.companyName ? 'error' : ''}
            />
            {fieldErrors.companyName && (
              <span className="field-error">{fieldErrors.companyName}</span>
            )}
            {duplicateWarning && (
              <div className="alert alert-warning mt-2">
                <small>{duplicateWarning}</small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Company Email <span className="required">*</span></label>
            <input
              type="email"
              name="companyEmail"
              placeholder="Enter company email"
              required
              value={formData.companyEmail}
              onChange={handleChange}
              className={fieldErrors.companyEmail ? 'error' : ''}
            />
            {fieldErrors.companyEmail && (
              <span className="field-error">{fieldErrors.companyEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label>Company Website</label>
            <input
              type="text"
              name="companyWebsite"
              placeholder="Enter company website"
              value={formData.companyWebsite}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      {formData.companyOption === 'existing' && (
        <div className="form-group">
          <label>Select Company <span className="required">*</span></label>
          <select
            name="selectedCompanyId"
            className="form-select"
            required
            value={formData.selectedCompanyId}
            onChange={handleChange}
          >
            <option value="">Choose a company...</option>
            {mockCompanies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name} ({company.website})
              </option>
            ))}
          </select>
          <small className="text-muted">
            Don't see your company? Choose "Create new company profile" instead.
          </small>
        </div>
      )}

      <div className="form-group">
        <div className="d-flex gap-3">
          <button 
            className="theme-btn btn-style-three" 
            type="button"
            onClick={handlePrevStep}
            disabled={isLoading}
          >
            Back
          </button>
          <button 
            className="theme-btn btn-style-one" 
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || success}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registering...
            </>
          ) : success ? (
            <>
              <i className="icon-check me-2"></i>
              Registered!
            </>
          ) : (
              'Complete Registration'
          )}
        </button>
        </div>
      </div>
    </>
  );

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Progress indicator for employers */}
      {userType === 'employer' && (
        <div className="signup-progress mb-4">
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span> Personal Info
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span> Company
            </div>
          </div>
        </div>
      )}

      {step === 1 ? renderStep1() : renderStep2()}
    </form>
  );
};

export default FormContent;
