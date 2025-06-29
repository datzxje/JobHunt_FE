const JobOverView2 = ({ job }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to format employment type
  const formatEmploymentType = (type) => {
    const typeMap = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time', 
      'CONTRACT': 'Contract',
      'TEMPORARY': 'Temporary',
      'INTERNSHIP': 'Internship'
    };
    return typeMap[type] || type;
  };

  // Helper function to format salary
  const formatSalary = () => {
    if (job?.salaryMin && job?.salaryMax) {
      return `$${job.salaryMin} - $${job.salaryMax}`;
    } else if (job?.salaryMin) {
      return `$${job.salaryMin}+`;
    }
    return 'Negotiable';
  };

  // Default fallback if no job data
  if (!job) {
    return (
      <ul>
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Loading...</h5>
          <span>Please wait</span>
        </li>
      </ul>
    );
  }

  return (
    <ul>
      <li>
        <i className="icon icon-calendar"></i>
        <h5>Date Posted:</h5>
        <span>{formatDate(job.createdAt)}</span>
      </li>
      <li>
        <i className="icon icon-expiry"></i>
        <h5>Expiration date:</h5>
        <span>{job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Open'}</span>
      </li>
      <li>
        <i className="icon icon-location"></i>
        <h5>Location:</h5>
        <span>{job.location}</span>
      </li>
      <li>
        <i className="icon icon-salary"></i>
        <h5>Salary:</h5>
        <span>{formatSalary()}</span>
      </li>
    </ul>
  );
};

export default JobOverView2;
