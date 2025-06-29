import GalleryBox from "./GalleryBox";

const JobDetailsDescriptions = ({ company }) => {
  if (!company) {
    return (
      <div className="job-detail">
        <h4>About Company</h4>
        <p>Loading company information...</p>
      </div>
    );
  }

  return (
    <div className="job-detail">
      <h4>About {company.name}</h4>
      {company.about ? (
        <p>{company.about}</p>
      ) : (
        <p>
          {company.name} is {company.industryType ? `a ${company.industryType.toLowerCase()} company` : 'a professional organization'} 
          {company.city && company.country ? ` based in ${company.city}, ${company.country}` : ''}.
          {company.establishmentYear ? ` Established in ${company.establishmentYear},` : ''} 
          {company.teamSize ? ` the company has a team size of ${company.teamSize} employees` : ''}.
        </p>
      )}
      
      {company.websiteUrl && (
        <p>
          For more information, visit our website at{' '}
          <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">
            {company.websiteUrl}
          </a>
        </p>
      )}

      <div className="row images-outer">
        <GalleryBox />
      </div>
    </div>
  );
};

export default JobDetailsDescriptions;
