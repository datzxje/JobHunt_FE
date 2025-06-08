'use client'

import { useState } from "react";
import Select from "react-select";

const PostBoxForm = () => {
  const [requirements, setRequirements] = useState([]);

  const specialisms = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Managemnet", label: "Managemnet" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
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
                  options={skillsOptions}
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
                  options={languageOptions}
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

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input type="text" name="name" placeholder="Title" />
        </div>

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>
          <textarea placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"></textarea>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email Address</label>
          <input type="text" name="name" placeholder="" />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Username</label>
          <input type="text" name="name" placeholder="" />
        </div>

        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms </label>
          <Select
            defaultValue={[specialisms[2]]}
            isMulti
            name="colors"
            options={specialisms}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>$1500</option>
            <option>$2000</option>
            <option>$2500</option>
            <option>$3500</option>
            <option>$4500</option>
            <option>$5000</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Career Level</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Industry</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Qualification</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Application Deadline Date</label>
          <input type="text" name="name" placeholder="06.04.2020" />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <select className="chosen-single form-select">
            <option>Australia</option>
            <option>Pakistan</option>
            <option>Chaina</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          <select className="chosen-single form-select">
            <option>Melbourne</option>
            <option>Pakistan</option>
            <option>Chaina</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          />
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

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button className="theme-btn btn-style-one">Next</button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm;
