"use client";

import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import Image from "next/image";

// Mock data for initial display
const initialApplications = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/images/resource/candidate-1.png",
    designation: "Senior Product Designer",
    location: "New York, USA",
    hourlyRate: 45,
    status: "APPROVED",
    matchScore: 95,
    tags: ["UI/UX", "Figma", "Adobe XD", "Product Design"],
    skills: ["UI Design", "UX Research", "Prototyping", "User Testing"],
    experience: "8 years",
    education: "Master in Design",
    languages: ["English", "Spanish"]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/images/resource/candidate-2.png",
    designation: "Product Designer",
    location: "London, UK",
    hourlyRate: 40,
    status: "APPROVED",
    matchScore: 88,
    tags: ["UI Design", "Sketch", "InVision", "Design Systems"],
    skills: ["UI Design", "Design Systems", "User Research", "Prototyping"],
    experience: "5 years",
    education: "Bachelor in Design",
    languages: ["English", "French"]
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "/images/resource/candidate-3.png",
    designation: "UX Designer",
    location: "San Francisco, USA",
    hourlyRate: 42,
    status: "REJECTED",
    matchScore: 75,
    tags: ["UX Design", "Research", "User Testing", "Wireframing"],
    skills: ["UX Research", "User Testing", "Wireframing", "Prototyping"],
    experience: "6 years",
    education: "Master in HCI",
    languages: ["English", "Mandarin"]
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "/images/resource/candidate-4.png",
    designation: "UI/UX Designer",
    location: "Berlin, Germany",
    hourlyRate: 38,
    status: "REJECTED",
    matchScore: 82,
    tags: ["UI Design", "UX Design", "Figma", "Design Systems"],
    skills: ["UI Design", "UX Design", "Design Systems", "User Research"],
    experience: "4 years",
    education: "Bachelor in Design",
    languages: ["English", "German"]
  },
  {
    id: 5,
    name: "David Kim",
    avatar: "/images/resource/candidate-5.png",
    designation: "Product Designer",
    location: "Seoul, South Korea",
    hourlyRate: 35,
    status: "REJECTED",
    matchScore: 78,
    tags: ["Product Design", "UI Design", "Figma", "Prototyping"],
    skills: ["Product Design", "UI Design", "Prototyping", "User Research"],
    experience: "3 years",
    education: "Bachelor in Design",
    languages: ["English", "Korean"]
  },
  {
    id: 6,
    name: "Lisa Anderson",
    avatar: "/images/resource/candidate-6.png",
    designation: "Senior UX Designer",
    location: "Toronto, Canada",
    hourlyRate: 45,
    status: "REJECTED",
    matchScore: 85,
    tags: ["UX Design", "Research", "User Testing", "Design Systems"],
    skills: ["UX Research", "User Testing", "Design Systems", "Prototyping"],
    experience: "7 years",
    education: "Master in Design",
    languages: ["English", "French"]
  }
];

const NormalApplicantCard = ({ candidate }) => (
  <div className="candidate-block-three col-lg-6 col-md-12 col-sm-12">
    <div className="inner-box">
      <div className="content">
        <figure className="image">
          <Image
            width={90}
            height={90}
            src={candidate.avatar}
            alt="candidates"
          />
        </figure>
        <h4 className="name">
          <Link href={`/candidates-single-v1/${candidate.id}`}>
            {candidate.name}
          </Link>
        </h4>

        <ul className="candidate-info">
          <li className="designation">
            {candidate.designation}
          </li>
          <li>
            <span className="icon flaticon-map-locator"></span>{" "}
            {candidate.location}
          </li>
          <li>
            <span className="icon flaticon-money"></span> $
            {candidate.hourlyRate} / hour
          </li>
        </ul>

        <ul className="post-tags">
          {candidate.tags?.map((val, i) => (
            <li key={i}>
              <a href="#">{val}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="option-box">
        <ul className="option-list">
          <li>
            <button data-text="View Aplication">
              <span className="la la-eye"></span>
            </button>
          </li>
          <li>
            <button data-text="Approve Aplication">
              <span className="la la-check"></span>
            </button>
          </li>
          <li>
            <button data-text="Reject Aplication">
              <span className="la la-times-circle"></span>
            </button>
          </li>
          <li>
            <button data-text="Delete Aplication">
              <span className="la la-trash"></span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const RankedApplicantCard = ({ candidate }) => (
  <div className="candidate-block-three">
    <div className="inner-box" style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e4e4e4' }}>
      <div style={{ width: '60px', marginRight: '20px' }}>
        <Image
          width={60}
          height={60}
          src={candidate.avatar}
          alt="candidates"
          style={{ borderRadius: '50%' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 className="name" style={{ margin: 0 }}>
            <Link href={`/candidates-single-v1/${candidate.id}`}>
              {candidate.name}
            </Link>
          </h4>
          <div style={{ 
            backgroundColor: candidate.status === 'APPROVED' ? '#28a745' : '#dc3545',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {candidate.status}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '5px 0', color: '#666' }}>{candidate.designation}</p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <span className="icon flaticon-map-locator"></span> {candidate.location}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '5px 10px',
              borderRadius: '4px',
              marginBottom: '5px'
            }}>
              Match Score: <strong>{candidate.matchScore}%</strong>
            </div>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <span className="icon flaticon-money"></span> ${candidate.hourlyRate}/hour
            </p>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <ul className="post-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: 0, padding: 0 }}>
            {candidate.tags?.map((val, i) => (
              <li key={i} style={{ 
                backgroundColor: '#f8f9fa',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '12px'
              }}>
                {val}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="option-box" style={{ marginLeft: '20px' }}>
        <ul className="option-list" style={{ display: 'flex', gap: '10px', margin: 0, padding: 0 }}>
          <li>
            <button data-text="View Aplication">
              <span className="la la-eye"></span>
            </button>
          </li>
          <li>
            <button data-text="Approve Aplication">
              <span className="la la-check"></span>
            </button>
          </li>
          <li>
            <button data-text="Reject Aplication">
              <span className="la la-times-circle"></span>
            </button>
          </li>
          <li>
            <button data-text="Delete Aplication">
              <span className="la la-trash"></span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const WidgetContentBox = ({ rankedApplications }) => {
  const [applications, setApplications] = useState(initialApplications);
  const [totalCount, setTotalCount] = useState(6);
  const [approvedCount, setApprovedCount] = useState(2);
  const [rejectedCount, setRejectedCount] = useState(4);
  const [isRankedView, setIsRankedView] = useState(false);

  useEffect(() => {
    if (rankedApplications) {
      // Sort applications by match score in descending order
      const sortedApplications = [...rankedApplications].sort((a, b) => b.matchScore - a.matchScore);
      setApplications(sortedApplications);
      setIsRankedView(true);
      // Update counts based on ranked applications
      setTotalCount(rankedApplications.length);
      setApprovedCount(rankedApplications.filter(app => app.status === 'APPROVED').length);
      setRejectedCount(rankedApplications.filter(app => app.status === 'REJECTED').length);
    } else {
      // Reset to initial state when rankedApplications is null
      setApplications(initialApplications);
      setIsRankedView(false);
      setTotalCount(6);
      setApprovedCount(2);
      setRejectedCount(4);
    }
  }, [rankedApplications]);

  return (
    <div className="widget-content">
      <div className="tabs-box">
        <Tabs>
          <div className="aplicants-upper-bar">
            <h6>Senior Product Designer</h6>

            <TabList className="aplicantion-status tab-buttons clearfix">
              <Tab className="tab-btn totals"> Total(s): {totalCount}</Tab>
              <Tab className="tab-btn approved"> Approved: {approvedCount}</Tab>
              <Tab className="tab-btn rejected"> Rejected(s): {rejectedCount}</Tab>
            </TabList>
          </div>

          <div className="tabs-content">
            <TabPanel>
              <div className={isRankedView ? "candidates-list" : "row"}>
                {applications.map(candidate => 
                  isRankedView ? (
                    <RankedApplicantCard key={candidate.id} candidate={candidate} />
                  ) : (
                    <NormalApplicantCard key={candidate.id} candidate={candidate} />
                  )
                )}
              </div>
            </TabPanel>
            {/* End total applicants */}

            <TabPanel>
              <div className={isRankedView ? "candidates-list" : "row"}>
                {applications
                  .filter(app => app.status === 'APPROVED')
                  .map(candidate => 
                    isRankedView ? (
                      <RankedApplicantCard key={candidate.id} candidate={candidate} />
                    ) : (
                      <NormalApplicantCard key={candidate.id} candidate={candidate} />
                    )
                  )}
              </div>
            </TabPanel>
            {/* End approved applicants */}

            <TabPanel>
              <div className={isRankedView ? "candidates-list" : "row"}>
                {applications
                  .filter(app => app.status === 'REJECTED')
                  .map(candidate => 
                    isRankedView ? (
                      <RankedApplicantCard key={candidate.id} candidate={candidate} />
                    ) : (
                      <NormalApplicantCard key={candidate.id} candidate={candidate} />
                    )
                  )}
              </div>
            </TabPanel>
            {/* End rejected applicants */}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WidgetContentBox;
