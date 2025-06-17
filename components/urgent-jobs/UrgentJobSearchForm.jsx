import { useState, useEffect } from 'react';

const jobCategories = [
  'Tất cả ngành nghề',
  'Dọn dẹp nhà cửa',
  'Sửa chữa điện nước',
  'Chuyển nhà',
  'Giao hàng',
  'Tài xế',
  'Phục vụ bàn',
  'Nấu ăn',
  'Chăm sóc trẻ em',
  'Chăm sóc người già',
  'Làm vườn',
  'Sơn nhà',
  'Thợ xây',
  'Massage',
  'Kế toán',
  'Gia sư',
  'Bán hàng',
];

const distances = [
  { label: 'Trong 1km', value: 1 },
  { label: 'Trong 3km', value: 3 },
  { label: 'Trong 5km', value: 5 },
  { label: 'Trong 10km', value: 10 },
  { label: 'Trong 20km', value: 20 },
];

const timeSlots = [
  'Bất kỳ lúc nào',
  'Sáng (6h-12h)',
  'Chiều (12h-18h)', 
  'Tối (18h-22h)',
  'Cuối tuần',
  'Ngay hôm nay',
  'Trong tuần này',
];

const salaryRanges = [
  'Tất cả mức lương',
  '100-300k/ngày',
  '300-500k/ngày',
  '500k-1tr/ngày',
  'Trên 1tr/ngày',
  '50-100k/giờ',
  'Theo thỏa thuận',
];

const UrgentJobSearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    location: '',
    category: 'Tất cả ngành nghề',
    distance: 5,
    timeSlot: 'Bất kỳ lúc nào',
    salaryRange: 'Tất cả mức lương',
    isUrgent: false,
    coordinates: null
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt không hỗ trợ định vị');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchData(prev => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude },
          location: 'Vị trí hiện tại'
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Không thể lấy vị trí';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối chia sẻ vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng';
            break;
          case error.TIMEOUT:
            errorMessage = 'Hết thời gian chờ lấy vị trí';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchData);
    }
  };

  // Auto-get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="mb-5">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center mb-2">
          <span className="badge bg-danger me-2 px-3 py-2" style={{fontSize: '0.9rem'}}>
            🔥 VIỆC LÀM THỜI VỤ
          </span>
          <span className="badge bg-success px-3 py-2" style={{fontSize: '0.9rem'}}>
            📍 TÌM GẦN BẠN
          </span>
        </div>
        <h3 className="text-white fw-bold mb-2" style={{
          fontSize: '1.5rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.7)'
        }}>
          Tìm việc làm gần nhà ngay hôm nay
        </h3>
        <p className="text-white-50 mb-0" style={{fontSize: '0.95rem'}}>
          Nhận việc nhanh - Làm ngay - Có lương hôm nay
        </p>
      </div>

      {/* Search Form */}
      <form
        className="urgent-job-search-form bg-white rounded-4 shadow-lg"
        style={{
          padding: '25px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
          border: '2px solid #e3f2fd',
        }}
        onSubmit={handleSubmit}
      >
        {/* Row 1: Main search */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-muted small">Tìm việc gì?</label>
            <div className="position-relative">
              <i className="fas fa-search position-absolute" style={{
                left: '15px', top: '50%', transform: 'translateY(-50%)',
                color: '#007bff', fontSize: '14px'
              }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="VD: dọn nhà, giao hàng, tài xế..."
                value={searchData.keyword}
                onChange={e => handleInputChange('keyword', e.target.value)}
                style={{
                  paddingLeft: '45px',
                  height: '50px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold text-muted small">Làm việc ở đâu?</label>
            <div className="position-relative">
              <i className="fas fa-map-marker-alt position-absolute" style={{
                left: '15px', top: '50%', transform: 'translateY(-50%)',
                color: '#28a745', fontSize: '14px'
              }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="VD: Quận 1, Phường Bến Nghé..."
                value={searchData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                style={{
                  paddingLeft: '45px',
                  paddingRight: '45px',
                  height: '50px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px'
                }}
              />
              <button
                type="button"
                className="btn btn-link position-absolute p-0"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                style={{
                  right: '10px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '14px', color: '#28a745'
                }}
                title="Lấy vị trí hiện tại"
              >
                {isGettingLocation ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-crosshairs"></i>
                )}
              </button>
            </div>
            {locationError && (
              <small className="text-danger mt-1 d-block">{locationError}</small>
            )}
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="row g-3 mb-3">
          <div className="col-md-3 col-6">
            <label className="form-label fw-semibold text-muted small">Ngành nghề</label>
            <select
              className="form-select"
              value={searchData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              style={{
                height: '45px',
                border: '2px solid #e9ecef',
                borderRadius: '10px'
              }}
            >
              {jobCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 col-6">
            <label className="form-label fw-semibold text-muted small">Khoảng cách</label>
            <select
              className="form-select"
              value={searchData.distance}
              onChange={e => handleInputChange('distance', Number(e.target.value))}
              style={{
                height: '45px',
                border: '2px solid #e9ecef',
                borderRadius: '10px'
              }}
            >
              {distances.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 col-6">
            <label className="form-label fw-semibold text-muted small">Thời gian</label>
            <select
              className="form-select"
              value={searchData.timeSlot}
              onChange={e => handleInputChange('timeSlot', e.target.value)}
              style={{
                height: '45px',
                border: '2px solid #e9ecef',
                borderRadius: '10px'
              }}
            >
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 col-6">
            <label className="form-label fw-semibold text-muted small">Mức lương</label>
            <select
              className="form-select"
              value={searchData.salaryRange}
              onChange={e => handleInputChange('salaryRange', e.target.value)}
              style={{
                height: '45px',
                border: '2px solid #e9ecef',
                borderRadius: '10px'
              }}
            >
              {salaryRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Urgent filter and submit */}
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="urgentFilter"
                checked={searchData.isUrgent}
                onChange={e => handleInputChange('isUrgent', e.target.checked)}
                style={{transform: 'scale(1.2)'}}
              />
              <label className="form-check-label fw-semibold" htmlFor="urgentFilter">
                <span className="text-danger">🚨 Chỉ việc CẦN GẤP</span>
                <small className="d-block text-muted">Việc cần người trong 24h</small>
              </label>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-4"
              style={{
                height: '55px',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #007bff, #0056b3)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                minWidth: '180px'
              }}
            >
              <i className="fas fa-bolt me-2"></i>
              Tìm việc ngay
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="row mt-4 pt-3 border-top">
          <div className="col-12">
            <div className="d-flex justify-content-center flex-wrap gap-4">
              <div className="text-center">
                <div className="fw-bold text-primary h5 mb-0">2,847</div>
                <small className="text-muted">Việc hôm nay</small>
              </div>
              <div className="text-center">
                <div className="fw-bold text-success h5 mb-0">156</div>
                <small className="text-muted">Việc cần gấp</small>
              </div>
              <div className="text-center">
                <div className="fw-bold text-warning h5 mb-0">89%</div>
                <small className="text-muted">Tỷ lệ nhận việc</small>
              </div>
              <div className="text-center">
                <div className="fw-bold text-info h5 mb-0">~45p</div>
                <small className="text-muted">Thời gian phản hồi</small>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style jsx global>{`
        .urgent-job-search-form .form-control:focus,
        .urgent-job-search-form .form-select:focus {
          border-color: #007bff !important;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.15) !important;
        }
        
        .urgent-job-search-form .form-control::placeholder {
          color: #adb5bd;
          opacity: 1;
        }
        
        .form-check-input:checked {
          background-color: #dc3545 !important;
          border-color: #dc3545 !important;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default UrgentJobSearchForm;