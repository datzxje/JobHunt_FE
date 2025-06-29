'use client'

import { useDispatch, useSelector } from "react-redux";
import { addExperienceLevelNew } from "../../../features/filter/filterSlice";

const ExperienceLevel = () => {
    const { jobList } = useSelector((state) => state.filter) || {};
    const dispatch = useDispatch();

    // Experience levels
    const experienceLevels = [
        { value: "Fresh Graduate", label: "Fresh Graduate" },
        { value: "Junior", label: "Junior (1-2 years)" },
        { value: "Mid Level", label: "Mid Level (3-5 years)" },
        { value: "Senior", label: "Senior (5-10 years)" },
        { value: "Lead", label: "Lead (8+ years)" },
        { value: "Manager", label: "Manager (10+ years)" }
    ];

    // experience level handler
    const experienceLevelHandler = (e) => {
        dispatch(addExperienceLevelNew(e.target.value));
    };

    return (
        <>
            <select
                className="form-select"
                value={jobList.experienceLevel}
                onChange={experienceLevelHandler}
            >
                <option value="">Choose experience level</option>
                {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                        {level.label}
                    </option>
                ))}
            </select>
            <span className="icon flaticon-graduation-cap"></span>
        </>
    );
};

export default ExperienceLevel;
