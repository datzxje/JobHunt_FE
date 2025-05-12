import CommonLayout from "../../../layout/CommonLayout";
import FilterJobBox from "./FilterJobBox";
import JobSearchForm from "./JobSearchForm";

const index = () => {
  return (
    <CommonLayout>
      <section className="page-title style-two">
        <div className="auto-container">
          <JobSearchForm />
          {/* <!-- Job Search Form --> */}
        </div>
      </section>
      {/* <!--End Page Title--> */}

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            <div className="content-column col-lg-12">
              <div className="ls-outer">
                <FilterJobBox />
              </div>
            </div>
            {/* <!-- End Content Column --> */}
          </div>
          {/* End row */}
        </div>
        {/* End container */}
      </section>
      {/* <!--End Listing Page Section --> */}
    </CommonLayout>
  );
};

export default index;
