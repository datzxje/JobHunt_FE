'use client'

import { useState, useEffect } from "react";
import Select from "react-select";
import api from "@/utils/api";
import jobUtils from "@/utils/jobUtils";
import jobRequirementUtils from "@/utils/jobRequirementUtils";

const PostBoxForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    employmentType: '',
    experienceLevel: '',
    careerLevel: '',
    location: '',
    country: '',
    city: '',
    address: '',
    isRemote: false,
    applicationDeadline: '',
    hoursPerWeek: '',
    genderPreference: 'NO_PREFERENCE',
    minimumQualification: '',
    minimumAge: '',
    maximumAge: '',
    minimumExperienceYears: '',
    maximumExperienceYears: '',
    categoryIds: [],
    skillIds: [],
    languageIds: []
  });

  // API data state
  const [apiData, setApiData] = useState({
    skills: [],
    categories: [],
    languages: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);

  // Fetch form data from APIs
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        const data = await jobUtils.getJobFormData();
        setApiData(data);
      } catch (error) {
        console.error('Error fetching form data:', error);
        // Fallback to static data if API fails
        setApiData({
          skills: [
            { value: 1, label: "JavaScript" },
            { value: 2, label: "React" },
            { value: 3, label: "Node.js" },
            { value: 4, label: "Python" },
            { value: 5, label: "Java" },
            { value: 6, label: "PHP" },
            { value: 7, label: "Angular" },
            { value: 8, label: "Vue.js" },
            { value: 9, label: "CSS" },
            { value: 10, label: "HTML" },
          ],
          categories: [
            { value: 1, label: "Technology" },
            { value: 2, label: "Banking" },
            { value: 3, label: "FinTech" },
            { value: 4, label: "Digital & Creative" },
            { value: 5, label: "Engineering" },
            { value: 6, label: "Healthcare" },
            { value: 7, label: "Education" },
            { value: 8, label: "Retail" },
          ],
          languages: [
            { value: 1, label: "English" },
            { value: 2, label: "Vietnamese" },
            { value: 3, label: "Chinese" },
            { value: 4, label: "Japanese" },
            { value: 5, label: "Korean" },
            { value: 6, label: "French" },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Select changes for multi-select fields
  const handleSelectChange = (name, selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  // Submit form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Validate form data first
      const validation = jobUtils.validateJobData(formData);
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join('\n');
        alert(`Please fix the following errors:\n${errorMessages}`);
        return;
      }

      // Prepare the request body according to JobRequest DTO
      const requestBody = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        careerLevel: formData.careerLevel,
        location: formData.location,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        isRemote: formData.isRemote,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        hoursPerWeek: formData.hoursPerWeek,
        genderPreference: formData.genderPreference,
        minimumQualification: formData.minimumQualification,
        minimumAge: formData.minimumAge ? parseInt(formData.minimumAge) : null,
        maximumAge: formData.maximumAge ? parseInt(formData.maximumAge) : null,
        minimumExperienceYears: formData.minimumExperienceYears ? parseInt(formData.minimumExperienceYears) : null,
        maximumExperienceYears: formData.maximumExperienceYears ? parseInt(formData.maximumExperienceYears) : null,
        categoryIds: formData.categoryIds,
        skillIds: formData.skillIds,
        languageIds: formData.languageIds
      };

      const result = await api.createJob(requestBody);
      console.log('Job created:', result.data);
      
      // Get the created job ID from response
      const createdJobId = result.data?.data?.id;
      
      if (!createdJobId) {
        console.error('No job ID returned from create job API');
        alert('Job created but failed to get job ID for saving requirements');
        resetForm();
        return;
      }

      // Save job requirements if any exist
      if (requirements && requirements.length > 0) {
        try {
          console.log('Saving job requirements for job ID:', createdJobId);
          
          // Validate requirements before saving
          const validation = jobRequirementUtils.validateRequirements(requirements);
          if (!validation.isValid) {
            console.warn('Requirements validation failed:', validation.errors);
            alert(`Job created successfully, but some requirements have issues:\n${validation.errors.join('\n')}\n\nPlease edit the job to fix these issues.`);
          } else {
            // Save requirements to backend
            await jobRequirementUtils.saveJobRequirements(createdJobId, requirements);
            console.log('Job requirements saved successfully');
          }
        } catch (requirementError) {
          console.error('Error saving job requirements:', requirementError);
          alert(`Job created successfully, but failed to save requirements: ${requirementError.message}\n\nYou can add requirements later by editing the job.`);
        }
      }
      
      alert('Job posted successfully!');
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error submitting job:', error);
      alert(`Failed to submit job: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      salaryMin: '',
      salaryMax: '',
      employmentType: '',
      experienceLevel: '',
      careerLevel: '',
      location: '',
      country: '',
      city: '',
      address: '',
      isRemote: false,
      applicationDeadline: '',
      hoursPerWeek: '',
      genderPreference: 'NO_PREFERENCE',
      minimumQualification: '',
      minimumAge: '',
      maximumAge: '',
      minimumExperienceYears: '',
      maximumExperienceYears: '',
      categoryIds: [],
      skillIds: [],
      languageIds: []
    });
    setRequirements([]);
  };

  const specialisms = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Management", label: "Management" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
    { value: "FinTech", label: "FinTech" },
    { value: "Technology", label: "Technology" },
    { value: "Engineering", label: "Engineering" },
    { value: "Product Design", label: "Product Design" },
  ];

  const skillsOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "PHP", label: "PHP" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "CSS", label: "CSS" },
    { value: "HTML", label: "HTML" },
    { value: "SQL", label: "SQL" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Design", label: "Design" },
    { value: "Photoshop", label: "Photoshop" },
    { value: "Sketch", label: "Sketch" },
    { value: "InVision", label: "InVision" },
    { value: "Framer X", label: "Framer X" },
    { value: "Jira", label: "Jira" },
    { value: "Confluence", label: "Confluence" },
    { value: "UX Design", label: "UX Design" },
    { value: "Product Management", label: "Product Management" },
    { value: "Agile", label: "Agile" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Vietnamese", label: "Vietnamese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Spanish", label: "Spanish" },
  ];

  const requirementTypes = [
    { value: "experience", label: "Experience Requirements" },
    { value: "age", label: "Age Requirements" },
    { value: "education", label: "Education Requirements" },
    { value: "skills", label: "Skills Requirements" },
    { value: "languages", label: "Language Requirements" },
    { value: "salary", label: "Salary Expectations" },
  ];

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

  // Helper function to render weight and mandatory controls
  const renderWeightAndMandatory = (id, data, colSize = "col-lg-3") => (
    <>
      <div className={`form-group ${colSize} col-md-12`}>
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

      <div className="form-group col-lg-1 col-md-12" style={{ paddingTop: "30px" }}>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={data.isMandatory || false}
            onChange={(e) => updateRequirement(id, "isMandatory", e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          <label className="form-check-label" style={{ fontSize: "12px", fontWeight: "600" }}>
            Mandatory
          </label>
        </div>
      </div>
    </>
  );

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

              {renderWeightAndMandatory(id, data)}
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

              {renderWeightAndMandatory(id, data)}
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

              {renderWeightAndMandatory(id, data)}
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
                  options={loading ? [] : apiData.skills}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder={loading ? "Loading skills..." : "Select required skills..."}
                  value={data.skills || []}
                  onChange={(selectedOptions) => updateRequirement(id, "skills", selectedOptions)}
                  isLoading={loading}
                />
              </div>

              {renderWeightAndMandatory(id, data)}
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
                  options={loading ? [] : apiData.languages}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder={loading ? "Loading languages..." : "Select required languages..."}
                  value={data.languages || []}
                  onChange={(selectedOptions) => updateRequirement(id, "languages", selectedOptions)}
                  isLoading={loading}
                />
              </div>

              {renderWeightAndMandatory(id, data)}
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

              {renderWeightAndMandatory(id, data)}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* <!-- Job Title --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="e.g. Software Engineer (Android), Libraries"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        {/* <!-- Job Description --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>
          <textarea 
            placeholder="As a Product Designer, you will work within a Product Delivery Team fused with UX, engineering, product and data talent. You will help the team design beautiful interfaces that solve business challenges for our clients. We work with a number of Tier 1 banks on building web-based applications for AML, KYC and Sanctions List management workflows..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />
        </div>

        {/* <!-- Job Responsibilities & General Requirements --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Responsibilities & General Requirements</label>
          <textarea 
            placeholder="Describe key responsibilities, general qualifications, and what the candidate will be expected to do in this role..."
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            required
          />
        </div>

        {/* <!-- Specialisms --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms</label>
          <Select
            isMulti
            name="categoryIds"
            options={loading ? [] : apiData.categories}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder={loading ? "Loading categories..." : "Select specialisms..."}
            onChange={(selectedOptions) => handleSelectChange('categoryIds', selectedOptions)}
            isLoading={loading}
          />
        </div>

        {/* <!-- Job Type --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <select 
            className="chosen-single form-select" 
            name="employmentType"
            value={formData.employmentType}
            onChange={(e) => handleInputChange('employmentType', e.target.value)}
            required
          >
            <option value="">Select Job Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="FREELANCER">Freelancer</option>
            <option value="TEMPORARY">Temporary</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        {/* <!-- Salary Range --> */}
        <div className="form-group col-lg-3 col-md-6">
          <label>Minimum Salary</label>
          <input 
            type="number" 
            name="salaryMin" 
            placeholder="25000"
            value={formData.salaryMin}
            onChange={(e) => handleInputChange('salaryMin', e.target.value)}
          />
        </div>

        <div className="form-group col-lg-3 col-md-6">
          <label>Maximum Salary</label>
          <input 
            type="number" 
            name="salaryMax" 
            placeholder="45000"
            value={formData.salaryMax}
            onChange={(e) => handleInputChange('salaryMax', e.target.value)}
          />
        </div>

        {/* <!-- Career Level --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Career Level</label>
          <select 
            className="chosen-single form-select" 
            name="careerLevel"
            value={formData.careerLevel}
            onChange={(e) => handleInputChange('careerLevel', e.target.value)}
          >
            <option value="">Select Career Level</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead">Lead</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
          </select>
        </div>

        {/* <!-- Experience --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience Required</label>
          <select 
            className="chosen-single form-select" 
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
            required
          >
            <option value="">Select Experience</option>
            <option value="Fresh">Fresh Graduate</option>
            <option value="1 Year">1 Year</option>
            <option value="2 Year">2 Years</option>
            <option value="3 Year">3 Years</option>
            <option value="4 Year">4 Years</option>
            <option value="5+ Year">5+ Years</option>
            <option value="10+ Year">10+ Years</option>
          </select>
        </div>



        {/* <!-- Minimum Qualification --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Minimum Qualification</label>
          <select 
            className="chosen-single form-select" 
            name="minimumQualification"
            value={formData.minimumQualification}
            onChange={(e) => handleInputChange('minimumQualification', e.target.value)}
          >
            <option value="">Select Qualification</option>
            <option value="High School">High School</option>
            <option value="Certificate">Certificate</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor's Degree</option>
            <option value="Master">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* <!-- Gender Preference --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender Preference</label>
          <select 
            className="chosen-single form-select" 
            name="genderPreference"
            value={formData.genderPreference}
            onChange={(e) => handleInputChange('genderPreference', e.target.value)}
          >
            <option value="NO_PREFERENCE">No Preference</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>



        {/* <!-- Location --> */}
        <div className="form-group col-lg-4 col-md-12">
          <label>Main Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. London, UK"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            required
          />
        </div>

        {/* <!-- Country --> */}
        <div className="form-group col-lg-4 col-md-6">
          <label>Country</label>
          <input
            type="text"
            name="country"
            placeholder="e.g. United Kingdom"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
          />
        </div>

        {/* <!-- City --> */}
        <div className="form-group col-lg-4 col-md-6">
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. London"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>

        {/* <!-- Complete Address --> */}
        <div className="form-group col-lg-8 col-md-8">
          <label>Complete Address</label>
          <input
            type="text"
            name="address"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>

        {/* <!-- Remote Work --> */}
        <div className="form-group col-lg-4 col-md-4">
          <label>Remote Work</label>
          <select
            className="chosen-single form-select"
            name="isRemote"
            value={formData.isRemote}
            onChange={(e) => handleInputChange('isRemote', e.target.value === 'true')}
          >
            <option value={false}>Office-based</option>
            <option value={true}>Remote Allowed</option>
          </select>
        </div>

        {/* <!-- Dynamic Candidate Requirements Section --> */}
        <div className="form-group col-lg-12 col-md-12">
          <div className="widget-content" style={{ marginTop: "30px", border: "1px solid #e8ecef", padding: "25px", borderRadius: "8px" }}>
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

            {/* Additional Requirements Text Area */}
            {requirements.length > 0 && (
              <div className="form-group col-lg-12 col-md-12" style={{ marginTop: "20px" }}>
                <label>Additional Requirements or Notes</label>
                <textarea 
                  placeholder="Any additional requirements, certifications, or special criteria for candidates..."
                  rows="3"
                />
              </div>
            )}
          </div>
        </div>

        {/* <!-- Application Deadline --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
          />
        </div>

        {/* <!-- Hours per Week --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Hours per Week</label>
          <select
            className="chosen-single form-select"
            name="hoursPerWeek"
            value={formData.hoursPerWeek}
            onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
          >
            <option value="">Select Hours</option>
            <option value="20h / week">20h / week</option>
            <option value="30h / week">30h / week</option>
            <option value="40h / week">40h / week</option>
            <option value="50h / week">50h / week</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        {/* <!-- Submit Button --> */}
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
  