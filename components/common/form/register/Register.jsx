'use client'

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import Form from "./FormContent";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  // Theo dõi loại người dùng đang được chọn
  const [userType, setUserType] = useState("candidate");

  const handleTabSelect = (index) => {
    // Cập nhật userType dựa trên tab được chọn
    setUserType(index === 0 ? "candidate" : "employer");
  };

  return (
    <div className="form-inner">
      <h3>Create a Free JobHunt Account</h3>

      <Tabs onSelect={handleTabSelect}>
        <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
          </TabList>
        </div>
        {/* End .form-group */}

        <TabPanel>
          <Form userType="candidate" />
        </TabPanel>
        {/* End cadidates Form */}

        <TabPanel>
          <Form userType="employer" />
        </TabPanel>
        {/* End Employer Form */}
      </Tabs>
      {/* End form-group */}

      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link
            href="#"
            className="call-modal login"
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
            data-bs-target="#loginPopupModal"
          >
            LogIn
          </Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default Register;
