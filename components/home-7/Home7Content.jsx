import About4 from "../about/About4";
import AddBlock from "../block/AddBlock";
import Funfact from "../fun-fact-counter/Funfact";
import JobCategorie1 from "../job-categories/JobCategorie1";
import JobFeatured12 from "../job-featured/JobFeatured12";
import JobFeatured1 from "../job-featured/JobFeatured1";
import UrgentJobs from "../job-featured/UrgentJobs";
import Testimonial2 from "../testimonial/Testimonial2";
import TopCompany2 from "../top-company/TopCompany2";
import Hero7 from "../hero/hero-7";
import Link from "next/link";
import Image from "next/image";

const Home7Content = () => {
  return (
    <>
      <Hero7 />
      
      {/* Urgent Jobs Section - Positioned prominently */}
      <section className="urgent-jobs-section" style={{marginTop: "-100px", paddingTop: "120px"}}>
        <div className="auto-container">
          <UrgentJobs />
        </div>
      </section>

      <section className="job-section pt-0" style={{marginTop: "20px"}}>
        <div className="auto-container">
          <div className="row mb-3" data-aos="fade-up">
            <JobFeatured1 />
          </div>
          <div className="btn-box">
            <Link
              href="/job-list-v5"
              className="theme-btn btn-style-one bg-blue"
            >
              <span className="btn-title">Load More Listing</span>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="top-companies" style={{marginTop: "-120px"}}>
        <div className="auto-container">
          <div className="sec-title">
            <h2>Top Company Registered</h2>
            <div className="text">Some of the companies we have helped recruit excellent applicants over the years.</div>
          </div>
          <div className="carousel-outer" data-aos="fade-up">
            <div className="companies-carousel">
              <TopCompany2 />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section style-two" style={{marginTop: "-100px"}}>
        <div className="auto-container">
          <div className="row">
            <About4 />
          </div>
          <div className="fun-fact-section">
            <div className="row">
              <Funfact />
            </div>
          </div>
        </div>
      </section>

      

      <section className="testimonial-section-two style-two" style={{marginTop: "-80px"}}>
        <div className="container-fluid">
          <div className="testimonial-left">
            <Image
              width={504}
              height={451}
              src="/images/resource/testimonial-left.png"
              alt="testimonial"
            />
          </div>
          <div className="testimonial-right">
            <Image
              width={504}
              height={451}
              src="/images/resource/testimonial-right.png"
              alt="testimonial"
            />
          </div>
          <div className="sec-title text-center">
            <h2>Testimonials From Our Customers</h2>
            <div className="text">Lorem ipsum dolor sit amet elit, sed do eiusmod tempor</div>
          </div>
          <div className="carousel-outer" data-aos="fade-up">
            <div className="testimonial-carousel">
              <Testimonial2 />
            </div>
          </div>
        </div>
      </section>

      <section className="job-categories" style={{marginTop: "-80px"}}>
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Popular Job Categories</h2>
            <div className="text">2020 jobs live - 293 added today.</div>
          </div>
          <div className="row" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            <JobCategorie1 />
          </div>
        </div>
      </section>

      <section className="job-section style-two" style={{marginTop: "-30px"}}>
        <div className="auto-container wow fadeInUp">
          <div className="sec-title text-center">
            <h2>Recent Jobs</h2>
            <div className="text">Know your worth and find the job that qualify your life</div>
          </div>
          <div className="job-carousel gap-x25">
            <JobFeatured12 />
          </div>
        </div>
      </section>

      <section className="ads-section" style={{marginTop: "-30px", marginBottom: "-100px"}}>
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <AddBlock />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home7Content; 