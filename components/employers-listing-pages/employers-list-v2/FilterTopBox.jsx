'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import companyService from "../../../services/companyService";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDestination,
  addFoundationDate,
  addKeyword,
  addLocation,
  addPerPage,
  addSort,
} from "../../../features/filter/employerFilterSlice";
import Image from "next/image";

const FilterTopBox = () => {
  const {
    keyword,
    location,
    destination,
    category,
    foundationDate,
    sort,
    perPage,
  } = useSelector((state) => state.employerFilter) || {};
  const dispatch = useDispatch();

  // API state
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    total: 0,
    pages: 0
  });

  // Fetch companies from API
  const fetchCompanies = async (page = 0, size = 12) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        size
      };

      console.log('Fetching companies with params:', params);
      const response = await companyService.getAllCompanies(params);
      console.log('API Response:', response);

      if (response.data) {
        const mappedCompanies = response.data.map(companyService.mapCompanyData);
        setCompanies(mappedCompanies);
        
        if (response.meta) {
          setPagination({
            page: response.meta.page,
            size: response.meta.size,
            total: response.meta.total,
            pages: response.meta.pages
          });
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies(pagination.page, pagination.size);
  }, []);

  // keyword filter
  const keywordFilter = (item) =>
    keyword !== ""
      ? item?.name?.toLowerCase().includes(keyword?.toLowerCase()) && item
      : item;

  // location filter
  const locationFilter = (item) =>
    location !== ""
      ? item?.location?.toLowerCase().includes(location?.toLowerCase())
      : item;

  // destination filter
  const destinationFilter = (item) =>
    item?.destination?.min >= destination?.min &&
    item?.destination?.max <= destination?.max;

  // category filter
  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLocaleLowerCase() === category?.toLocaleLowerCase()
      : item;

  // foundation date filter
  const foundationDataFilter = (item) =>
    item?.foundationDate?.min >= foundationDate?.min &&
    item?.foundationDate?.max <= foundationDate?.max;

  // sort filter
  const sortFilter = (a, b) =>
    sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1;

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading companies...</span>
        </div>
        <p className="mt-3">Loading companies...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger text-center py-5">
        <h5>Oops! Something went wrong</h5>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => fetchCompanies(pagination.page, pagination.size)}
        >
          Try Again
        </button>
      </div>
    );
  }

  let content = companies
    ?.filter(keywordFilter)
    ?.filter(locationFilter)
    ?.filter(destinationFilter)
    ?.filter(categoryFilter)
    ?.filter(foundationDataFilter)
    ?.sort(sortFilter)
    ?.map((company) => (
      <div
        className="company-block-four col-xl-4 col-lg-6 col-md-6 col-sm-12"
        key={company.id}
      >
        <div className="inner-box">
          <button className="bookmark-btn">
            <span className="flaticon-bookmark"></span>
          </button>

          <div className="content-inner">
            <span className="featured">Featured</span>
            <span className="company-logo">
              <Image
                width={50}
                height={50}
                src={company.img}
                alt="company brand"
              />
            </span>
            <h4>
              <Link href={`/company/single/${company.id}`}>
                {company.name}
              </Link>
            </h4>
            <ul className="job-info flex-column">
              <li className="me-0">
                <span className="icon flaticon-map-locator"></span>
                {company.location}
              </li>
              <li className="me-0">
                <span className="icon flaticon-briefcase"></span>
                {company.industryType || company.jobType}
              </li>
            </ul>
          </div>

          <div className="job-type me-0">Open Jobs – {company.jobNumber}</div>
        </div>
      </div>
    ));

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
    
    // Update pagination size and refetch
    const newSize = pageData.end === 0 ? 12 : pageData.end;
    fetchCompanies(0, newSize); // Reset to first page with new size
  };

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // clear handler
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(addFoundationDate({ min: 1900, max: 2028 }));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
    
    // Refetch data after clearing filters
    fetchCompanies(0, 12);
  };
  return (
    <>
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="text">
            <strong>{content?.length}</strong> companies
          </div>
        </div>
        {/* End showing-result */}
        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          destination.min !== 0 ||
          destination.max !== 100 ||
          category !== "" ||
          foundationDate.min !== 1900 ||
          foundationDate.max !== 2028 ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 0 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{
                minHeight: "45px",
                marginBottom: "15px",
              }}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 24,
              })}
            >
              24 per page
            </option>
          </select>
          {/* End select */}
        </div>
      </div>
      {/* End top filter bar box */}

      <div className="row">{content}</div>
      {/* End .row */}

      <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={(page) => fetchCompanies(page, pagination.size)}
        loading={loading}
      />
      {/* <!-- Pagination --> */}
    </>
  );
};

export default FilterTopBox;
