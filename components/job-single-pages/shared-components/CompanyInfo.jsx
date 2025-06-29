import Social from "../social/Social";

const CompanyInfo = ({ company }) => {
  if (!company) {
    return (
      <ul className="company-info">
        <li>Loading company information...</li>
      </ul>
    );
  }

  return (
    <ul className="company-info">
      <li>
        Primary industry: <span>{company.industryType || 'Software'}</span>
      </li>
      <li>
        Company size: <span>{company.teamSize || '501-1,000'}</span>
      </li>
      <li>
        Founded in: <span>2011</span>
      </li>
      <li>
        Phone: <span>123 456 7890</span>
      </li>
      <li>
        Email: <span>info@{company.name?.toLowerCase().replace(/\s+/g, '') || 'company'}.com</span>
      </li>
      <li>
        Location: <span>{company.city && company.country ? `${company.city}, ${company.country}` : 'Ho Chi Minh City, Vietnam'}</span>
      </li>
      {company.averageRating > 0 && (
        <li>
          Rating: <span>{company.averageRating.toFixed(1)}/5.0 ({company.totalReviews} reviews)</span>
        </li>
      )}
      <li>
        Social media:
        <Social />
      </li>
    </ul>
  );
};

export default CompanyInfo;


