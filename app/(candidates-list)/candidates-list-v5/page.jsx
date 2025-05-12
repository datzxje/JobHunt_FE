import dynamic from "next/dynamic";

import CandidatesList from "@/components/candidates-listing-pages/candidates-list-v5";

export const metadata = {
  title: 'Candidates List V5 || JobHunt - Employment Marketplace',
  description:
    'JobHunt - Employment Marketplace',
  
}



const index = () => {
  return (
    <>
      
      <CandidatesList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
