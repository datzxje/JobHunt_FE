'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Mock data for ranking
const mockRankedApplications = [
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

const WidgetTopFilterBox = ({ onRankedApplicationsChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRankAndFilter = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Use mock data directly
      onRankedApplicationsChange(mockRankedApplications);
    } catch (error) {
      console.error('Error ranking applications:', error);
      alert('Failed to rank applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chosen-outer">
      <select className="chosen-single form-select chosen-container">
        <option>Select Jobs</option>
        <option>Last 12 Months</option>
        <option>Last 16 Months</option>
        <option>Last 24 Months</option>
        <option>Last 5 year</option>
      </select>
      {/* <!--Tabs Box--> */}

      <select className="chosen-single form-select chosen-container">
        <option>All Status</option>
        <option>Last 12 Months</option>
        <option>Last 16 Months</option>
        <option>Last 24 Months</option>
        <option>Last 5 year</option>
      </select>
      {/* <!--Tabs Box--> */}

      <button 
        className="theme-btn btn-style-one"
        onClick={handleRankAndFilter}
        disabled={isLoading}
        style={{ marginLeft: '15px' }}
      >
        {isLoading ? 'Ranking...' : 'Rank and Filter'}
      </button>
    </div>
  );
};

export default WidgetTopFilterBox;
