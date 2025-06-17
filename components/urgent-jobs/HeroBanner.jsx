import { useState } from 'react';

const heroImages = [
  '/images/hero/cleaner.png',
  '/images/hero/driver.png', 
  '/images/hero/mechanic.png',
];

const trendingSearches = [
  'Việc làm Quận 1',
  'Nhận viên massage', 
  'Việc làm Gò Vấp',
  'Tài xế Bình Chánh',
  'Kế toán quận 7'
];

const HeroBanner = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Toàn quốc');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, location });
    }
  };

  const handleTrendingClick = (term) => {
    setKeyword(term);
  };

  return (
    <section className="hero-banner position-relative" style={{ minHeight: '400px' }}>
      {/* Background Images */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
        <div className="d-flex w-100 h-100">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className="flex-fill"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2
        }}
      />

      {/* Main Content */}
      <div className="container position-relative" style={{ zIndex: 3, paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Title */}
            <h1 className="text-white fw-bold mb-4" style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              lineHeight: '1.2'
            }}>
              Việc tìm đúng người<br />
              Người tìm đúng việc
            </h1>

            {/* Search Form */}
            <div className="bg-white rounded-4 p-4 mb-4" style={{ 
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <form onSubmit={handleSearch}>
                <div className="row g-3 align-items-center">
                  <div className="col-md-5">
                    <div className="position-relative">
                      <i className="fas fa-search position-absolute" style={{
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#007bff',
                        fontSize: '16px'
                      }}></i>
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Nhập tên công việc, công ty..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{
                          paddingLeft: '45px',
                          height: '50px',
                          fontSize: '15px',
                          backgroundColor: '#f8f9fa'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="position-relative">
                      <i className="fas fa-map-marker-alt position-absolute" style={{
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#007bff',
                        fontSize: '16px'
                      }}></i>
                      <select
                        className="form-select border-0"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                          paddingLeft: '45px',
                          height: '50px',
                          fontSize: '15px',
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <option value="Toàn quốc">Toàn quốc</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP.HCM">TP.HCM</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 fw-bold"
                      style={{
                        height: '50px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #007bff, #0056b3)',
                        border: 'none'
                      }}
                    >
                      Tìm ngay
                    </button>
                  </div>
                </div>
              </form>

              {/* Trending Searches */}
              <div className="mt-4 text-start">
                <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>
                  Tìm kiếm nhiều nhất hôm nay:
                </span>
                <div className="mt-2">
                  {trendingSearches.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-link text-success p-0 me-3 mb-1"
                      onClick={() => handleTrendingClick(term)}
                      style={{
                        fontSize: '13px',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      #{term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
          border-color: #007bff !important;
        }
        
        .btn-link:hover {
          color: #28a745 !important;
        }
        
        @media (max-width: 768px) {
          .hero-banner {
            min-height: 350px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;