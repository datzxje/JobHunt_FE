'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Select from "react-select";

const ApplyJobModalContent = ({ jobId }) => {
  const [candidateProfile, setCandidateProfile] = useState({});
  const [jobRequirements, setJobRequirements] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API endpoints
      const [jobReqResponse, profileResponse] = await Promise.all([
        fetch(`/api/jobs/${jobId}/requirements`),
        fetch(`/api/candidate/profile`)
      ]);

      const requirements = jobReqResponse.ok ? await jobReqResponse.json() : [];
      const profile = profileResponse.ok ? await profileResponse.json() : {};

      setJobRequirements(requirements.data || []);
      setCandidateProfile(profile.data || {});
      
      // Initialize form data with existing profile data
      setFormData({
        experience: profile.data?.experience || "",
        age: profile.data?.age || "",
        education: profile.data?.education || "",
        skills: profile.data?.skills || [],
        languages: profile.data?.languages || [],
        expectedSalary: profile.data?.expectedSalary || "",
        message: ""
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Fallback when APIs are not ready
      setJobRequirements([]);
      setCandidateProfile({});
      setFormData({
        experience: "",
        age: "",
        education: "",
        skills: [],
        languages: [],
        expectedSalary: "",
        message: ""
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const applicationData = {
      jobId,
      candidateData: formData,
      cv: e.target.upload.files[0]
    };

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        // Close modal or redirect
      } else {
        throw new Error('Failed to submit application');
      }
      
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  const getRequiredFields = () => {
    return jobRequirements.map(req => req.type);
  };

  const isFieldRequired = (fieldType) => {
    return getRequiredFields().includes(fieldType);
  };

  const hasData = (fieldType) => {
    switch (fieldType) {
      case "experience":
        return candidateProfile.experience;
      case "age":
        return candidateProfile.age;
      case "education":
        return candidateProfile.education;
      case "skills":
        return candidateProfile.skills && candidateProfile.skills.length > 0;
      case "languages":
        return candidateProfile.languages && candidateProfile.languages.length > 0;
      case "salary":
        return candidateProfile.expectedSalary;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: "40px" }}>
        <div className="spinner-border" role="status" style={{ color: "var(--primary-color)" }}>
          <span className="sr-only">Loading...</span>
        </div>
        <p style={{ marginTop: "15px", color: "#696969" }}>Preparing your application...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxHeight: "70vh", 
      overflowY: "auto",
      overflowX: "hidden",
      paddingRight: "10px"
    }}>
      <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      <div className="row">
          {/* CV Upload */}
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="uploading-outer apply-cv-outer">
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="image/*, application/pdf"
                id="upload"
                multiple=""
                required
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                Upload CV (doc, docx, pdf)
              </label>
            </div>
          </div>
        </div>

          {/* Dynamic Profile Information Section */}
          {getRequiredFields().length > 0 && (
            <div className="col-lg-12 col-md-12 col-sm-12 form-group">
              <div style={{ 
                backgroundColor: "#f8f9fa", 
                padding: "20px", 
                borderRadius: "8px", 
                border: "1px solid #e9ecef",
                marginBottom: "20px"
              }}>
                <h6 style={{ 
                  color: "#202124", 
                  marginBottom: "15px", 
                  fontWeight: "600" 
                }}>
                  Complete Your Profile Information
                </h6>
                <p style={{ 
                  fontSize: "14px", 
                  color: "#696969", 
                  marginBottom: "20px" 
                }}>
                  Please complete or verify your profile information to strengthen your application.
                </p>

                <div className="row">
                  {/* Experience Field */}
                  {isFieldRequired("experience") && (
                    <div className="col-lg-6 col-md-12 form-group">
                      <label>
                        Years of Experience
                        {hasData("experience") && (
                          <span style={{ color: "#28a745", fontSize: "12px", marginLeft: "5px" }}>
                            ✓ Already provided
                          </span>
                        )}
                      </label>
                      <select 
                        className="chosen-single form-select"
                        value={formData.experience}
                        onChange={(e) => updateFormData("experience", e.target.value)}
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="0-1 Years">0-1 Years</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="2-3 Years">2-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5-7 Years">5-7 Years</option>
                        <option value="7-10 Years">7-10 Years</option>
                        <option value="10+ Years">10+ Years</option>
                      </select>
                    </div>
                  )}

                  {/* Age Field */}
                  {isFieldRequired("age") && (
                    <div className="col-lg-6 col-md-12 form-group">
                      <label>
                        Age
                        {hasData("age") && (
                          <span style={{ color: "#28a745", fontSize: "12px", marginLeft: "5px" }}>
                            ✓ Already provided
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        min="18"
                        max="65"
                        required
                      />
                    </div>
                  )}

                  {/* Education Field */}
                  {isFieldRequired("education") && (
                    <div className="col-lg-6 col-md-12 form-group">
                      <label>
                        Education Level
                        {hasData("education") && (
                          <span style={{ color: "#28a745", fontSize: "12px", marginLeft: "5px" }}>
                            ✓ Already provided
                          </span>
                        )}
                      </label>
                      <select 
                        className="chosen-single form-select"
                        value={formData.education}
                        onChange={(e) => updateFormData("education", e.target.value)}
                        required
                      >
                        <option value="">Select education level</option>
                        <option value="High School">High School</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                  )}

                  {/* Expected Salary Field */}
                  {isFieldRequired("salary") && (
                    <div className="col-lg-6 col-md-12 form-group">
                      <label>
                        Expected Salary Range
                        {hasData("salary") && (
                          <span style={{ color: "#28a745", fontSize: "12px", marginLeft: "5px" }}>
                            ✓ Already provided
                          </span>
                        )}
                      </label>
                      <select 
                        className="chosen-single form-select"
                        value={formData.expectedSalary}
                        onChange={(e) => updateFormData("expectedSalary", e.target.value)}
                        required
                      >
                        <option value="">Select salary range</option>
                        <option value="20-30K">$20-30K</option>
                        <option value="30-40K">$30-40K</option>
                        <option value="40-50K">$40-50K</option>
                        <option value="50-70K">$50-70K</option>
                        <option value="70-100K">$70-100K</option>
                        <option value="100-150K">$100-150K</option>
                        <option value="150K+">$150K+</option>
                      </select>
                    </div>
                  )}

                  {/* Skills Field */}
                  {isFieldRequired("skills") && (
                    <div className="col-lg-12 col-md-12 form-group">
                      <label>
                        Technical Skills
                        {hasData("skills") && (
                          <span style={{ color: "#28a745", fontSize: "12px", marginLeft: "5px" }}>
                            ✓ Some skills provided
                          </span>
                        )}
                      </label>
                      <Select
                        isMulti
                        name="skills"
                        options={skillsOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select your skills..."
                        value={formData.skills}
                        onChange={(selectedOptions) => updateFormData("skills", selectedOptions)}
                        required
                      />
                    </div>
                  )}

                  {/* Languages Field */}
                  {isFieldRequired("languages") && (
                    <div className="col-lg-12 col-md-12 form-group">
                      <label>
                        Languages
                        {hasData("languages") && (
                          <span style={{ color: "#28a745", fontSize: "12px", marginLeft: "5px" }}>
                            ✓ Some languages provided
                          </span>
                        )}
                      </label>
                      <Select
                        isMulti
                        name="languages"
                        options={languageOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select languages you speak..."
                        value={formData.languages}
                        onChange={(selectedOptions) => updateFormData("languages", selectedOptions)}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message Field */}
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <textarea
            className="darma"
            name="message"
              placeholder="Cover Letter / Message (Optional)"
              value={formData.message}
              onChange={(e) => updateFormData("message", e.target.value)}
              rows="4"
          ></textarea>
        </div>

          {/* Terms and Conditions */}
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="rememberMe" required />
            <label htmlFor="rememberMe" className="remember">
              <span className="custom-checkbox"></span> You accept our{" "}
              <span data-bs-dismiss="modal">
                <Link href="/terms">
                  Terms and Conditions and Privacy Policy
                </Link>
              </span>
            </label>
          </div>
        </div>

          {/* Submit Button */}
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button
            className="theme-btn btn-style-one w-100"
            type="submit"
            name="submit-form"
          >
              Submit Application
          </button>
          </div>
        </div>
      </form>
      </div>
  );
};

export default ApplyJobModalContent;
