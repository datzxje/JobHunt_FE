'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSkill } from "../../../features/filter/filterSlice";
import jobService from "../../../services/jobService";

const Skills = () => {
    const { jobList } = useSelector((state) => state.filter) || {};
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    // Load skills from API
    useEffect(() => {
        const loadSkills = async () => {
            try {
                setLoading(true);
                const formData = await jobService.getFormData();
                setSkills(formData.skills || []);
            } catch (error) {
                console.error('Error loading skills:', error);
                // Use fallback skills if API fails
                setSkills([
                    { id: 1, name: "JavaScript" },
                    { id: 2, name: "React" },
                    { id: 3, name: "Node.js" },
                    { id: 4, name: "Python" },
                    { id: 5, name: "Java" },
                    { id: 6, name: "SQL" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadSkills();
    }, []);

    // skill handler
    const skillHandler = (e) => {
        dispatch(addSkill(e.target.value));
    };

    return (
        <>
            <select
                className="form-select"
                value={jobList.skill}
                onChange={skillHandler}
                disabled={loading}
            >
                <option value="">Choose a skill</option>
                {skills.map((skill) => (
                    <option key={skill.id} value={skill.name}>
                        {skill.name}
                    </option>
                ))}
            </select>
            <span className="icon flaticon-skills"></span>
        </>
    );
};

export default Skills; 