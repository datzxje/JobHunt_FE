
'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../features/filter/filterSlice";
import jobService from "../../../services/jobService";

const Categories = () => {
    const { jobList } = useSelector((state) => state.filter) || {};
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    // Load categories from API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const formData = await jobService.getFormData();
                setCategories(formData.categories || []);
            } catch (error) {
                console.error('Error loading categories:', error);
                // Use fallback categories if API fails
                setCategories([
                    { id: 1, name: "Technology" },
                    { id: 2, name: "Marketing" },
                    { id: 3, name: "Design" },
                    { id: 4, name: "Sales" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    // category handler
    const categoryHandler = (e) => {
        dispatch(addCategory(e.target.value));
    };

    return (
        <>
            <select
                className="form-select"
                value={jobList.category}
                onChange={categoryHandler}
                disabled={loading}
            >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
            <span className="icon flaticon-briefcase"></span>
        </>
    );
};

export default Categories;
