import Breadcrumb from "../../common/Breadcrumb";
import FilterTopBox from "./FilterTopBox";
import FilterSidebar from "./FilterSidebar";
import CommonLayout from "../../../layout/CommonLayout";

const index = () => {
  return (
    <CommonLayout>
      <Breadcrumb title="Companies" meta="Companies" />
      {/* <!--End Breadcrumb Start--> */}

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="filter-sidebar"
              aria-labelledby="offcanvasLabel"
            >
              <div className="filters-column hide-left">
                <FilterSidebar />
              </div>
            </div>
            {/* End filter column for tablet and mobile devices */}

            <div className="filters-column hidden-1023 col-lg-4 col-md-12 col-sm-12">
              <FilterSidebar />
            </div>
            {/* <!-- End Filters Column for destop and laptop --> */}

            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <div className="ls-outer">
                <FilterTopBox />
                {/* <!-- ls Switcher --> */}
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
