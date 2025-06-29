'use client'

import { useDispatch, useSelector } from "react-redux";
import { addIsRemote } from "../../../features/filter/filterSlice";

const RemoteCheckbox = () => {
    const { jobList } = useSelector((state) => state.filter) || {};
    const dispatch = useDispatch();

    // remote handler
    const remoteHandler = (e) => {
        dispatch(addIsRemote(e.target.checked));
    };

    return (
        <div className="form-group remote-checkbox">
            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={jobList.isRemote}
                    onChange={remoteHandler}
                    className="remote-checkbox-input"
                />
                <span className="checkmark"></span>
                <span className="title">Remote Work</span>
                <span className="icon flaticon-home"></span>
            </label>
        </div>
    );
};

export default RemoteCheckbox; 