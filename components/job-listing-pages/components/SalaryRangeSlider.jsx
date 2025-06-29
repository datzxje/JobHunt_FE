'use client'

import { useEffect, useState } from "react";
import InputRange from "react-input-range";
import { useDispatch, useSelector } from "react-redux";
import { addSalary } from "../../../features/filter/filterSlice";

const SalaryRangeSlider = () => {
    const { salary: getSalary } = useSelector((state) => state.filter.jobList) || {};
    const [salary, setSalary] = useState({
        min: getSalary?.min || 0,
        max: getSalary?.max || 10000,
    });

    const dispatch = useDispatch();

    const handleOnChange = (value) => {
        console.log('SalaryRangeSlider: User changed value to:', value);
        setSalary(value);
        
        // Only dispatch if the value is actually different from current Redux state
        const currentReduxSalary = getSalary || { min: 0, max: 100000 };
        if (value.min !== currentReduxSalary.min || value.max !== currentReduxSalary.max) {
            console.log('SalaryRangeSlider: Dispatching salary change');
            dispatch(addSalary(value));
        }
    };

    useEffect(() => {
        // Only update local state, don't dispatch (this is sync from Redux)
        if (getSalary) {
            const newSalary = {
                min: getSalary.min || 0,
                max: getSalary.max || 10000,
            };
            console.log('SalaryRangeSlider: Syncing from Redux:', newSalary);
            setSalary(newSalary);
        }
    }, [getSalary]);

    // Format currency display
    const formatCurrency = (value) => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`;
        }
        return `$${value}`;
    };



    return (
        <div className="salary-range-compact" style={{ width: '100%' }}>
            <div className="range-slider-one" style={{ width: '100%', minWidth: '200px' }}>
                <InputRange
                    formatLabel={(value) => formatCurrency(value)}
                    minValue={0}
                    maxValue={10000}
                    step={100}
                    value={salary}
                    onChange={(value) => handleOnChange(value)}
                />
            </div>
        </div>
    );
};

export default SalaryRangeSlider;
