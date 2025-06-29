
'use client'
import { useDispatch, useSelector } from "react-redux";
import {
    addDatePosted,
    addExperienceSelect,
    addJobTypeSelect,
} from "../../../features/filter/filterSlice";
import SalaryRangeSlider from "./SalaryRangeSlider";

export default function JobSelect() {
    const { jobList } = useSelector((state) => state.filter);
    const dispatch = useDispatch();

    // API-compatible employment types (matches backend enum)
    const employmentTypes = [
        { value: "FULL_TIME", label: "Full Time" },
        { value: "PART_TIME", label: "Part Time" },
        { value: "CONTRACT", label: "Contract" },
        { value: "INTERNSHIP", label: "Internship" },
        { value: "TEMPORARY", label: "Temporary" },
        { value: "FREELANCER", label: "Freelancer" }
    ];

    // API-compatible experience levels
    const experienceLevels = [
        { value: "Fresh Graduate", label: "Fresh Graduate" },
        { value: "Junior", label: "Junior (1-2 years)" },
        { value: "Mid Level", label: "Mid Level (3-5 years)" },
        { value: "Senior", label: "Senior (5-10 years)" },
        { value: "Lead", label: "Lead (8+ years)" },
        { value: "Manager", label: "Manager (10+ years)" }
    ];

    // Date posted options (keep existing)
    const datePostedOptions = [
        { value: "", label: "All Time" },
        { value: "last-hour", label: "Last Hour" },
        { value: "last-24-hour", label: "Last 24 Hours" },
        { value: "last-7-days", label: "Last 7 Days" },
        { value: "last-14-days", label: "Last 14 Days" },
        { value: "last-30-days", label: "Last 30 Days" }
    ];

    // job type handler
    const jobTypeHandler = (e) => {
        dispatch(addJobTypeSelect(e.target.value));
    };

    // date post handler
    const datePostHandler = (e) => {
        dispatch(addDatePosted(e.target.value));
    };

    // experience handler
    const experienceHandler = (e) => {
        dispatch(addExperienceSelect(e.target.value));
    };



    return (
        <>
            <div className="showing-result">
                <div className="top-filters" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div className="form-group">
                        <select
                            onChange={jobTypeHandler}
                            className="chosen-single form-select"
                            value={jobList?.jobTypeSelect || ""}
                        >
                            <option value="">Job Type</option>
                            {employmentTypes.map((type) => (
                                <option value={type.value} key={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* End job type filter */}

                    <div className="form-group">
                        <select
                            onChange={datePostHandler}
                            className="chosen-single form-select"
                            value={jobList?.datePosted || ""}
                        >
                            {datePostedOptions.map((option) => (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* End date posted filter */}

                    <div className="form-group">
                        <select
                            onChange={experienceHandler}
                            className="chosen-single form-select"
                            value={jobList?.experienceSelect || ""}
                        >
                            <option value="">Experience Level</option>
                            {experienceLevels.map((level) => (
                                <option value={level.value} key={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* End experience level filter */}

                    <div className="form-group" style={{ flex: '2', minWidth: '250px' }}>
                        <SalaryRangeSlider />
                    </div>
                    {/* End salary range filter */}
                </div>
            </div>
        </>
    );
}
