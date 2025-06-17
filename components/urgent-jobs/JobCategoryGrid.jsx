const categories = [
  { icon: '🛒', name: 'Bán hàng', count: 8098 },
  { icon: '🚕', name: 'Lái xe, phụ xe', count: 2738 },
  { icon: '📦', name: 'Giao chở hàng', count: 5577 },
  { icon: '🧹', name: 'Giúp việc, tạp vụ', count: 2691 },
  { icon: '👷', name: 'Công nhân', count: 6285 },
  { icon: '🛡️', name: 'An ninh, bảo vệ', count: 2232 },
  { icon: '🔎', name: 'Tất cả ngành nghề', count: 20000 },
];

const JobCategoryGrid = () => (
  <section className="job-category-grid-section py-4">
    <div className="container">
      <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
        <div className="d-flex align-items-center mb-3">
          <span className="me-2" style={{fontSize:'1.5rem'}}>🔎</span>
          <span className="fw-bold" style={{fontSize:'1.15rem'}}>Tìm việc nhanh theo ngành nghề</span>
        </div>
        <div className="row g-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-6 col-md-3 col-lg-2 text-center">
              <div className="p-2 p-md-3 rounded-3 bg-light h-100 d-flex flex-column align-items-center justify-content-center border border-1 border-secondary-subtle">
                <div style={{fontSize:'2.2rem'}}>{cat.icon}</div>
                <div className="fw-bold mt-2 mb-1" style={{fontSize:'1.05rem'}}>{cat.name}</div>
                <div className="text-muted" style={{fontSize:'0.95rem'}}>{cat.count.toLocaleString()} công việc</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default JobCategoryGrid; 