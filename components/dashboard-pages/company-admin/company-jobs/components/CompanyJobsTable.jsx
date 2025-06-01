import Link from "next/link";
import jobs from "../../../../../data/job-featured.js";
import Image from "next/image.js";

const CompanyJobsTable = () => {
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Company Job Listings</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Applications</th>
                <th>Created & Expired</th>
                <th>Status</th>
                <th>Posted By</th>
              </tr>
            </thead>

            <tbody>
              {jobs.slice(0, 8).map((item) => (
                <tr key={item.id}>
                  <td>
                    {/* <!-- Job Block --> */}
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <span className="company-logo">
                            <Image
                              width={50}
                              height={49}
                              src={item.logo}
                              alt="logo"
                            />
                          </span>
                          <h4>
                            <Link href={`/job-single-v3/${item.id}`}>
                              {item.jobTitle}
                            </Link>
                          </h4>
                          <ul className="job-info">
                            <li>
                              <span className="icon flaticon-briefcase"></span>
                              {item.company}
                            </li>
                            <li>
                              <span className="icon flaticon-map-locator"></span>
                              {item.location}
                            </li>
                            <li>
                              <span className="icon flaticon-money"></span>
                              {item.salary}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    <a href="#">{Math.floor(Math.random() * 10) + 1}+ Applied</a>
                  </td>
                  <td>
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} <br />
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="status">
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <div className="posted-by">
                      <div className="author-info">
                        <span className="name">HR Team</span>
                        <span className="designation">Human Resources</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default CompanyJobsTable; 