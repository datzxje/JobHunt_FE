'use client'

import { useDispatch, useSelector } from "react-redux";
import { addEmploymentType } from "../../../features/filter/filterSlice";

const EmploymentType = () => {
    const { jobList } = useSelector((state) => state.filter) || {};
    const dispatch = useDispatch();

    // Employment types từ backend enum
    const employmentTypes = [
        { value: "FULL_TIME", label: "Full Time" },
        { value: "PART_TIME", label: "Part Time" },
        { value: "CONTRACT", label: "Contract" },
        { value: "INTERNSHIP", label: "Internship" },
        { value: "TEMPORARY", label: "Temporary" },
        { value: "FREELANCER", label: "Freelancer" }
    ];

    // employment type handler
    const employmentTypeHandler = (e) => {
        dispatch(addEmploymentType(e.target.value));
    };

    return (
        <>
            <select
                className="form-select"
                value={jobList.employmentType}
                onChange={employmentTypeHandler}
            >
                <option value="">Choose job type</option>
                {employmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
            <span className="icon flaticon-briefcase"></span>
        </>
    );
};

export default EmploymentType; 