'use client'

import CommonLayout from "../../layout/CommonLayout";
import UrgentJobList from '../../components/urgent-jobs/UrgentJobList';
import HeroBanner from '../../components/urgent-jobs/HeroBanner';
import QuickSearchSuggestions from '../../components/urgent-jobs/QuickSearchSuggestions';
import JobCategoryGrid from '../../components/urgent-jobs/JobCategoryGrid';

// Mock data for urgent jobs
const mockJobs = [
  {
    id: 1,
    title: 'Urgent Plumbing Repair',
    description: 'Leaking pipe in bathroom needs immediate repair',
    location: '123 Nguyen Hue, District 1, HCMC',
    budget: '500,000 VND',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    tags: ['Plumbing', 'Emergency', 'Repair'],
    provider: {
      name: 'Fast Plumbing Co.',
      avatar: '/images/resource/company-logo/1-1.png',
      rating: 4.5,
      reviewCount: 128
    },
    latitude: 10.762622,
    longitude: 106.660172
  },
  {
    id: 2,
    title: 'Electrical System Check',
    description: 'Power outage in office building, need urgent inspection',
    location: '456 Le Loi, District 1, HCMC',
    budget: '300,000 VND',
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    tags: ['Electrical', 'Inspection', 'Safety'],
    provider: {
      name: 'Safe Electric Services',
      avatar: '/images/resource/company-logo/1-2.png',
      rating: 4.8,
      reviewCount: 256
    },
    latitude: 10.772622,
    longitude: 106.670172
  },
  {
    id: 3,
    title: 'AC Repair Needed',
    description: 'Office AC not working, temperature rising',
    location: '789 Dong Khoi, District 1, HCMC',
    budget: '800,000 VND',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    tags: ['HVAC', 'Repair', 'Office'],
    provider: {
      name: 'Cool Solutions',
      avatar: '/images/resource/company-logo/1-3.png',
      rating: 4.7,
      reviewCount: 189
    },
    latitude: 10.782622,
    longitude: 106.680172
  },
  {
    id: 4,
    title: 'Emergency Locksmith',
    description: 'Locked out of apartment, need immediate help',
    location: '321 Bui Vien, District 1, HCMC',
    budget: '400,000 VND',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    tags: ['Locksmith', 'Emergency', 'Residential'],
    provider: {
      name: 'Quick Lock Services',
      avatar: '/images/resource/company-logo/1-4.png',
      rating: 4.9,
      reviewCount: 312
    },
    latitude: 10.792622,
    longitude: 106.690172
  }
];

const UrgentJobsPage = () => {
  // For now, just log the search/filter values
  const handleSearch = (values) => {
    // You can implement filter logic here later
    console.log('Search/filter values:', values);
  };

  return (
    <CommonLayout>
      <HeroBanner onSearch={handleSearch} />
      <JobCategoryGrid />
      <section className="ls-section">
        <div className="auto-container">
          <div className="ls-outer">
            <UrgentJobList jobs={mockJobs} />
          </div>
        </div>
      </section>
    </CommonLayout>
  );
};

export default UrgentJobsPage; 