'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCity } from "../../../features/filter/filterSlice";

const CityBox = () => {
    const { jobList } = useSelector((state) => state.filter);
    const [getCity, setCity] = useState(jobList.city);
    const dispatch = useDispatch();

    // city handler
    const cityHandler = (e) => {
        dispatch(addCity(e.target.value));
    };

    useEffect(() => {
        setCity(jobList.city);
    }, [setCity, jobList]);

    return (
        <>
            <input
                type="text"
                name="city-search"
                placeholder="City (e.g. Ho Chi Minh)"
                value={getCity}
                onChange={cityHandler}
            />
            <span className="icon flaticon-map-locator"></span>
        </>
    );
};

export default CityBox; 