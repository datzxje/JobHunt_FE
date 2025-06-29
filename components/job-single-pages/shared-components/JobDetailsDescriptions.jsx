const JobDetailsDescriptions = ({ job }) => {
  // Helper function to parse JSON fields safely
  const parseJsonField = (field) => {
    if (!field) return [];
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (error) {
        console.warn('Failed to parse JSON field:', field);
        return [];
      }
    }
    return Array.isArray(field) ? field : [];
  };

  // Helper function to format requirements text to list
  const formatRequirements = (requirementsText) => {
    if (!requirementsText) return [];
    // Split by bullet points or line breaks
    return requirementsText
      .split(/[•\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // Default fallback if no job data
  if (!job) {
    return (
      <div className="job-detail">
        <h4>Loading job details...</h4>
        <p>Please wait while we load the job information.</p>
      </div>
    );
  }

  const requiredSkills = parseJsonField(job.requiredSkills);
  const requiredLanguages = parseJsonField(job.requiredLanguages);
  const requirements = formatRequirements(job.requirements);

  return (
    <div className="job-detail">
      <h4>Job Description</h4>
      <div dangerouslySetInnerHTML={{ __html: job.description }} />
      
      {requirements.length > 0 && (
        <>
          <h4>Requirements</h4>
          <ul className="list-style-three">
            {requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </>
      )}

      {requiredSkills.length > 0 && (
        <>
          <h4>Required Skills</h4>
          <ul className="list-style-three">
            {requiredSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </>
      )}

      {requiredLanguages.length > 0 && (
        <>
          <h4>Language Requirements</h4>
          <ul className="list-style-three">
            {requiredLanguages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
        </>
      )}

      {job.experienceLevel && (
        <>
          <h4>Experience Level</h4>
          <p>
            This position requires <strong>{job.experienceLevel.toLowerCase()}</strong> level experience.
            {job.minimumExperienceYears && job.maximumExperienceYears && (
              <span> Minimum {job.minimumExperienceYears} to {job.maximumExperienceYears} years of experience required.</span>
            )}
          </p>
        </>
      )}

      {(job.minimumQualification || job.careerLevel) && (
        <>
          <h4>Education & Career Level</h4>
          <ul className="list-style-three">
            {job.minimumQualification && (
              <li>Minimum education: {job.minimumQualification}</li>
            )}
            {job.careerLevel && (
              <li>Career level: {job.careerLevel}</li>
            )}
            {job.minimumAge && job.maximumAge && (
              <li>Age requirement: {job.minimumAge} - {job.maximumAge} years old</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default JobDetailsDescriptions;
