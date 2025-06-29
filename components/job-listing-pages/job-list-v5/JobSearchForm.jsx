'use client'

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  clearAllFilters, 
  addKeyword, 
  addLocation, 
  addCategory 
} from "../../../features/filter/filterSlice";
import { useJobSearch } from "../../../hooks/useJobSearch";

const JobSearchForm = () => {
  const { jobList } = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const { manualSearch, fullReset } = useJobSearch();

  // Local state for top form (không auto-dispatch)
  const [localForm, setLocalForm] = useState({
    keyword: "",
    location: "",
    category: ""
  });

  // Sync local state with Redux on mount (for navigation/URL params)
  useEffect(() => {
    setLocalForm({
      keyword: jobList.keyword || "",
      location: jobList.location || "",
      category: jobList.category || ""
    });
  }, []);

  // Sync when Redux state changes externally (e.g., Clear All)
  useEffect(() => {
    if (!jobList.keyword && !jobList.location && !jobList.category) {
      setLocalForm({ keyword: "", location: "", category: "" });
    }
  }, [jobList.keyword, jobList.location, jobList.category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Top form submitted with:', localForm);
    
    // Dispatch to Redux only on submit
    dispatch(addKeyword(localForm.keyword));
    dispatch(addLocation(localForm.location));
    dispatch(addCategory(localForm.category));
    
    // Trigger manual search
    manualSearch();
  };

  const handleClearAll = async () => {
    try {
      console.log('Clearing all filters...');
      
      // Clear local form first
      setLocalForm({ keyword: "", location: "", category: "" });
      
      // Clear Redux state
      dispatch(clearAllFilters());
      
      // Reset search state and load initial data
      await fullReset();
      
      console.log('All filters cleared successfully');
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  // Update local state when form inputs change
  const handleLocalChange = (field, value) => {
    setLocalForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form className="job-search-form" onSubmit={handleSubmit}>
      {/* Main Search Row */}
      <div className="row">
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="field_name"
            placeholder="Job title, keywords, or company"
            value={localForm.keyword}
            onChange={(e) => handleLocalChange('keyword', e.target.value)}
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <span className="icon flaticon-map-locator"></span>
          <input
            type="text"
            name="field_name"
            placeholder="City or postcode"
            value={localForm.location}
            onChange={(e) => handleLocalChange('location', e.target.value)}
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <span className="icon flaticon-briefcase"></span>
          <select
            className="form-select"
            value={localForm.category}
            onChange={(e) => handleLocalChange('category', e.target.value)}
          >
            <option value="">Choose a category</option>
            <option value="Technology">Technology</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Sales">Sales</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Design">Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>

        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one">
            Find Jobs
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobSearchForm;
