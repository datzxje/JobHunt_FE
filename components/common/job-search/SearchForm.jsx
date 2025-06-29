'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addKeyword, addLocation } from "../../../features/filter/filterSlice";

const SearchForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Update Redux state with search values
    dispatch(addKeyword(keyword));
    dispatch(addLocation(location));
    
    // Navigate to job list page
    router.push("/job-list-v5");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group col-lg-5 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="keyword"
            placeholder="Job title, keywords, or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="form-group col-lg-4 col-md-12 col-sm-12 location">
          <span className="icon flaticon-map-locator"></span>
          <input 
            type="text" 
            name="location" 
            placeholder="City or postcode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 btn-box">
          <button
            type="submit"
            className="theme-btn btn-style-one"
          >
            <span className="btn-title">Find Jobs</span>
          </button>
        </div>
      </div>
      {/* End .row */}
    </form>
  );
};

export default SearchForm;
