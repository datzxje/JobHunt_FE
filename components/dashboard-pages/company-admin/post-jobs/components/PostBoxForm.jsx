'use client'

import { useState, useEffect } from "react";
import Select from "react-select";
import { api } from "@/utils/api";
import jobService from "@/services/jobService";

const PostBoxForm = () => {
  // State cho form data chính
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    employmentType: "",
    experienceLevel: "",
    careerLevel: "",
    location: "",
    country: "",
    city: "",
    address: "",
    isRemote: false,
    applicationDeadline: "",
    hoursPerWeek: "",
    genderPreference: "",
    minimumQualification: "",
    minimumAge: "",
    maximumAge: "",
    minimumExperienceYears: "",
    maximumExperienceYears: "",
    categories: [],
    requiredSkills: [],
    requiredLanguages: []
  });

  // State cho dropdown options từ backend
  const [options, setOptions] = useState({
    skills: [],
    categories: [],
    languages: []
  });

  // State cho requirements
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Employment types từ backend enum
  const employmentTypes = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "TEMPORARY", label: "Temporary" },
    { value: "FREELANCER", label: "Freelancer" }
  ];

  // Gender preferences từ backend enum
  const genderPreferences = [
    { value: "", label: "No Preference" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "ANY", label: "Any" }
  ];

  const experienceLevels = [
    { value: "Fresh Graduate", label: "Fresh Graduate" },
    { value: "1-2 Years", label: "1-2 Years" },
    { value: "3-5 Years", label: "3-5 Years" },
    { value: "5-10 Years", label: "5-10 Years" },
    { value: "10+ Years", label: "10+ Years" }
  ];

  const careerLevels = [
    { value: "Entry Level", label: "Entry Level" },
    { value: "Junior", label: "Junior" },
    { value: "Mid Level", label: "Mid Level" },
    { value: "Senior", label: "Senior" },
    { value: "Lead", label: "Lead" },
    { value: "Manager", label: "Manager" },
    { value: "Director", label: "Director" }
  ];

  const requirementTypes = [
    { value: "experience", label: "Experience Requirements" },
    { value: "age", label: "Age Requirements" },
    { value: "education", label: "Education Requirements" },
    { value: "skills", label: "Skills Requirements" },
    { value: "languages", label: "Language Requirements" },
    { value: "salary", label: "Salary Expectations" },
  ];

  // Load form data từ backend
  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      try {
        const formData = await jobService.getFormData();
        
        setOptions({
          skills: formData.skills.map(skill => ({
            value: skill.id,
            label: skill.name
          })),
          categories: formData.categories.map(category => ({
            value: category.id,
            label: category.name
          })),
          languages: formData.languages.map(language => ({
            value: language.id,
            label: language.name
          }))
        });
      } catch (error) {
        console.error('Error loading form data:', error);
        // Fallback to static options nếu API fail
        setOptions({
          skills: [
            { value: 1, label: "JavaScript" },
            { value: 2, label: "React" },
            { value: 3, label: "Node.js" },
            { value: 4, label: "Python" },
            { value: 5, label: "Java" }
          ],
          categories: [
            { value: 1, label: "Banking" },
            { value: 2, label: "Digital & Creative" },
            { value: 3, label: "Retail" },
            { value: 4, label: "Human Resources" }
          ],
          languages: [
            { value: 1, label: "English" },
            { value: 2, label: "Vietnamese" },
            { value: 3, label: "Chinese" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (name, selectedOptions) => {
    const names = selectedOptions ? selectedOptions.map(option => option.label || option.value) : [];
    setFormData(prev => ({
      ...prev,
      [name]: names
    }));
  };

  // Requirements management functions
  const addRequirement = (type) => {
    if (requirements.find(req => req.type === type)) {
      alert("This requirement type has already been added!");
      return;
    }

    const newRequirement = {
      id: Date.now(),
      type: type,
      data: {}
    };
    setRequirements([...requirements, newRequirement]);
  };

  const removeRequirement = (id) => {
    setRequirements(requirements.filter(req => req.id !== id));
  };

  const updateRequirement = (id, field, value) => {
    setRequirements(requirements.map(req => 
      req.id === id 
        ? { ...req, data: { ...req.data, [field]: value } }
        : req
    ));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Prepare job requirements as JSON string
      const jobRequirementsJson = requirements.length > 0 ? 
        JSON.stringify(requirements.map(req => ({
          type: req.type.toUpperCase(),
          description: `${req.type} requirement`,
          weight: parseInt(req.data.weight || 5),
          isMandatory: parseInt(req.data.weight || 5) >= 7,
          data: req.data
        }))) : null;

      // Prepare job data
      const jobData = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        minimumAge: formData.minimumAge ? parseInt(formData.minimumAge) : null,
        maximumAge: formData.maximumAge ? parseInt(formData.maximumAge) : null,
        minimumExperienceYears: formData.minimumExperienceYears ? parseInt(formData.minimumExperienceYears) : null,
        maximumExperienceYears: formData.maximumExperienceYears ? parseInt(formData.maximumExperienceYears) : null,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        jobRequirements: jobRequirementsJson
      };

      // Create job - Chỉ ADMIN có quyền tạo job
      const jobResponse = await jobService.createJob(jobData);
      console.log('Job created successfully by Admin:', jobResponse.data);

      alert('Job posted successfully!');
      
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
        employmentType: "",
        experienceLevel: "",
        careerLevel: "",
        location: "",
        country: "",
        city: "",
        address: "",
        isRemote: false,
        applicationDeadline: "",
        hoursPerWeek: "",
        genderPreference: "",
        minimumQualification: "",
        minimumAge: "",
        maximumAge: "",
        minimumExperienceYears: "",
        maximumExperienceYears: "",
        categoryIds: [],
        skillIds: [],
        languageIds: []
      });
      setRequirements([]);
      
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error posting job: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Render requirement component
  const renderRequirement = (requirement) => {
    const { id, type, data } = requirement;

    switch (type) {
      case "experience":
        return (
          <div key={id} className="requirement-block" style={{ border: "1px solid #e8ecef", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h6 style={{ marginBottom: "15px", color: "#202124", fontWeight: "600" }}>Experience Requirements</h6>
              </div>
              <div className="col-lg-2 col-md-2 text-right">
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRequirement(id)}
                  style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px" }}
                >
                  Remove
                </button>
              </div>
              
              <div className="form-group col-lg-4 col-md-12">
                <label>Minimum Experience (Years)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.minExperience || ""}
                  onChange={(e) => updateRequirement(id, "minExperience", e.target.value)}
                >
                  <option value="">No Requirement</option>
                  <option value="0-1">0-1 Years</option>
                  <option value="1-2">1-2 Years</option>
                  <option value="2-3">2-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5-7">5-7 Years</option>
                  <option value="7-10">7-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Maximum Experience (Years)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.maxExperience || ""}
                  onChange={(e) => updateRequirement(id, "maxExperience", e.target.value)}
                >
                  <option value="">No Limit</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                  <option value="7">7 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Weight (1-10)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.weight || "5"}
                  onChange={(e) => updateRequirement(id, "weight", e.target.value)}
                >
                  <option value="1">1 - Low Priority</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Medium Priority</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - High Priority</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div key={id} className="requirement-block" style={{ border: "1px solid #e8ecef", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h6 style={{ marginBottom: "15px", color: "#202124", fontWeight: "600" }}>Skills Requirements</h6>
              </div>
              <div className="col-lg-2 col-md-2 text-right">
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRequirement(id)}
                  style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px" }}
                >
                  Remove
                </button>
              </div>

              <div className="form-group col-lg-8 col-md-12">
                <label>Required Skills</label>
                <Select
                  isMulti
                  name="required-skills"
                  options={options.skills}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select required skills..."
                  value={data.skills || []}
                  onChange={(selectedOptions) => updateRequirement(id, "skills", selectedOptions)}
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Weight (1-10)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.weight || "5"}
                  onChange={(e) => updateRequirement(id, "weight", e.target.value)}
                >
                  <option value="1">1 - Low Priority</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Medium Priority</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - High Priority</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "languages":
        return (
          <div key={id} className="requirement-block" style={{ border: "1px solid #e8ecef", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h6 style={{ marginBottom: "15px", color: "#202124", fontWeight: "600" }}>Language Requirements</h6>
              </div>
              <div className="col-lg-2 col-md-2 text-right">
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRequirement(id)}
                  style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px" }}
                >
                  Remove
                </button>
              </div>

              <div className="form-group col-lg-8 col-md-12">
                <label>Required Languages</label>
                <Select
                  isMulti
                  name="required-languages"
                  options={options.languages}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select required languages..."
                  value={data.languages || []}
                  onChange={(selectedOptions) => updateRequirement(id, "languages", selectedOptions)}
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Weight (1-10)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.weight || "5"}
                  onChange={(e) => updateRequirement(id, "weight", e.target.value)}
                >
                  <option value="1">1 - Low Priority</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Medium Priority</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - High Priority</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "age":
        return (
          <div key={id} className="requirement-block" style={{ border: "1px solid #e8ecef", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h6 style={{ marginBottom: "15px", color: "#202124", fontWeight: "600" }}>Age Requirements</h6>
              </div>
              <div className="col-lg-2 col-md-2 text-right">
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRequirement(id)}
                  style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px" }}
                >
                  Remove
                </button>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Minimum Age</label>
                <select 
                  className="chosen-single form-select"
                  value={data.minAge || ""}
                  onChange={(e) => updateRequirement(id, "minAge", e.target.value)}
                >
                  <option value="">No Requirement</option>
                  <option value="18">18 Years</option>
                  <option value="20">20 Years</option>
                  <option value="22">22 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                  <option value="35">35 Years</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Maximum Age</label>
                <select 
                  className="chosen-single form-select"
                  value={data.maxAge || ""}
                  onChange={(e) => updateRequirement(id, "maxAge", e.target.value)}
                >
                  <option value="">No Limit</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                  <option value="35">35 Years</option>
                  <option value="40">40 Years</option>
                  <option value="45">45 Years</option>
                  <option value="50">50 Years</option>
                  <option value="60">60 Years</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Weight (1-10)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.weight || "5"}
                  onChange={(e) => updateRequirement(id, "weight", e.target.value)}
                >
                  <option value="1">1 - Low Priority</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Medium Priority</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - High Priority</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "education":
        return (
          <div key={id} className="requirement-block" style={{ border: "1px solid #e8ecef", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h6 style={{ marginBottom: "15px", color: "#202124", fontWeight: "600" }}>Education Requirements</h6>
              </div>
              <div className="col-lg-2 col-md-2 text-right">
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRequirement(id)}
                  style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px" }}
                >
                  Remove
                </button>
              </div>

              <div className="form-group col-lg-8 col-md-12">
                <label>Minimum Education Level</label>
                <select 
                  className="chosen-single form-select"
                  value={data.minEducation || ""}
                  onChange={(e) => updateRequirement(id, "minEducation", e.target.value)}
                >
                  <option value="">No Requirement</option>
                  <option value="High School">High School</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Weight (1-10)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.weight || "5"}
                  onChange={(e) => updateRequirement(id, "weight", e.target.value)}
                >
                  <option value="1">1 - Low Priority</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Medium Priority</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - High Priority</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "salary":
        return (
          <div key={id} className="requirement-block" style={{ border: "1px solid #e8ecef", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h6 style={{ marginBottom: "15px", color: "#202124", fontWeight: "600" }}>Salary Expectations</h6>
              </div>
              <div className="col-lg-2 col-md-2 text-right">
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRequirement(id)}
                  style={{ background: "#dc3545", border: "none", color: "white", padding: "5px 10px", borderRadius: "4px" }}
                >
                  Remove
                </button>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Expected Salary Range (Min)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.minSalary || ""}
                  onChange={(e) => updateRequirement(id, "minSalary", e.target.value)}
                >
                  <option value="">No Requirement</option>
                  <option value="20-30K">$20-30K</option>
                  <option value="30-40K">$30-40K</option>
                  <option value="40-50K">$40-50K</option>
                  <option value="50-70K">$50-70K</option>
                  <option value="70-100K">$70-100K</option>
                  <option value="100-150K">$100-150K</option>
                  <option value="150K+">$150K+</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Expected Salary Range (Max)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.maxSalary || ""}
                  onChange={(e) => updateRequirement(id, "maxSalary", e.target.value)}
                >
                  <option value="">No Limit</option>
                  <option value="40K">$40K</option>
                  <option value="50K">$50K</option>
                  <option value="70K">$70K</option>
                  <option value="100K">$100K</option>
                  <option value="150K">$150K</option>
                  <option value="200K">$200K</option>
                  <option value="300K+">$300K+</option>
                </select>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Weight (1-10)</label>
                <select 
                  className="chosen-single form-select"
                  value={data.weight || "5"}
                  onChange={(e) => updateRequirement(id, "weight", e.target.value)}
                >
                  <option value="1">1 - Low Priority</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Medium Priority</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - High Priority</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center" style={{ padding: "50px" }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading form data...</span>
        </div>
        <p className="mt-3">Loading form data...</p>
      </div>
    );
  }

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* Job Title */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title *</label>
          <input 
            type="text" 
            name="title" 
            placeholder="Enter job title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        {/* Job Description */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description *</label>
          <textarea 
            placeholder="Describe the job position, responsibilities, and requirements..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows="5"
            required
          />
        </div>

        {/* Job Requirements */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Requirements *</label>
          <textarea 
            placeholder="List the specific requirements for this position..."
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            rows="3"
            required
          />
        </div>

        {/* Employment Type */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Employment Type *</label>
          <select 
            className="chosen-single form-select"
            value={formData.employmentType}
            onChange={(e) => handleInputChange('employmentType', e.target.value)}
            required
          >
            <option value="">Select Employment Type</option>
            {employmentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience Level *</label>
          <select 
            className="chosen-single form-select"
            value={formData.experienceLevel}
            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
            required
          >
            <option value="">Select Experience Level</option>
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        {/* Career Level */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Career Level</label>
          <select 
            className="chosen-single form-select"
            value={formData.careerLevel}
            onChange={(e) => handleInputChange('careerLevel', e.target.value)}
          >
            <option value="">Select Career Level</option>
            {careerLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        {/* Gender Preference */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender Preference</label>
          <select 
            className="chosen-single form-select"
            value={formData.genderPreference}
            onChange={(e) => handleInputChange('genderPreference', e.target.value)}
          >
            {genderPreferences.map(pref => (
              <option key={pref.value} value={pref.value}>{pref.label}</option>
            ))}
          </select>
        </div>

        {/* Salary Range */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Minimum Salary ($)</label>
          <input 
            type="number" 
            name="salaryMin" 
            placeholder="e.g. 50000"
            value={formData.salaryMin}
            onChange={(e) => handleInputChange('salaryMin', e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Maximum Salary ($)</label>
          <input 
            type="number" 
            name="salaryMax" 
            placeholder="e.g. 80000"
            value={formData.salaryMax}
            onChange={(e) => handleInputChange('salaryMax', e.target.value)}
            min="0"
          />
        </div>

        {/* Location */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Location *</label>
          <input 
            type="text" 
            name="location" 
            placeholder="e.g. Ho Chi Minh City, Vietnam"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            required
          />
        </div>

        {/* Remote Work */}
        <div className="form-group col-lg-6 col-md-12">
          <label style={{ display: 'block', marginBottom: '10px' }}>Work Arrangement</label>
          <div>
            <input 
              type="checkbox" 
              id="isRemote"
              checked={formData.isRemote}
              onChange={(e) => handleInputChange('isRemote', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="isRemote" style={{ fontWeight: 'normal' }}>Remote work allowed</label>
          </div>
        </div>

        {/* Job Categories */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Categories</label>
          <Select
            isMulti
            name="categories"
            options={options.categories}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select job categories..."
            onChange={(selectedOptions) => handleMultiSelectChange('categories', selectedOptions)}
            value={options.categories.filter(cat => formData.categories.includes(cat.label || cat.value))}
          />
        </div>

        {/* Required Skills */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Required Skills</label>
          <Select
            isMulti
            name="skills"
            options={options.skills}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select required skills..."
            onChange={(selectedOptions) => handleMultiSelectChange('requiredSkills', selectedOptions)}
            value={options.skills.filter(skill => formData.requiredSkills.includes(skill.label || skill.value))}
          />
        </div>

        {/* Required Languages */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Required Languages</label>
          <Select
            isMulti
            name="languages"
            options={options.languages}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select required languages..."
            onChange={(selectedOptions) => handleMultiSelectChange('requiredLanguages', selectedOptions)}
            value={options.languages.filter(lang => formData.requiredLanguages.includes(lang.label || lang.value))}
          />
        </div>

        {/* Application Deadline */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Application Deadline</label>
          <input 
            type="datetime-local" 
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
          />
        </div>

        {/* Dynamic Requirements Section */}
        <div className="form-group col-lg-12 col-md-12">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <h5 style={{ marginBottom: "20px", color: "#202124", fontWeight: "600" }}>
                Candidate Requirements & Filtering Criteria
              </h5>
              <p style={{ fontSize: "14px", color: "#696969", marginBottom: "25px" }}>
                Add specific requirements for candidates and assign weights to prioritize different criteria (1-10 scale).
              </p>
            </div>
            <div className="col-lg-4 col-md-4 text-right">
              <div className="form-group">
                <label>Add Requirement</label>
                <select 
                  className="chosen-single form-select"
                  onChange={(e) => {
                    if (e.target.value) {
                      addRequirement(e.target.value);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">Choose requirement type...</option>
                  {requirementTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Render Dynamic Requirements */}
          <div className="requirements-container">
            {requirements.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#696969", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "2px dashed #dee2e6" }}>
                <i className="la la-plus-circle" style={{ fontSize: "48px", marginBottom: "15px", color: "#adb5bd" }}></i>
                <p style={{ fontSize: "16px", margin: "0" }}>No requirements added yet. Use the dropdown above to add candidate requirements.</p>
              </div>
            ) : (
              requirements.map(requirement => renderRequirement(requirement))
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button 
            type="submit" 
            className="theme-btn btn-style-one"
            disabled={submitLoading}
          >
            {submitLoading ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm; 