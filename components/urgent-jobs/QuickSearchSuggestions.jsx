const suggestions = [
  { label: 'Việc làm Quận 1', href: '#' },
  { label: 'Nhân viên massage', href: '#' },
  { label: 'Việc làm Gò Vấp', href: '#' },
  { label: 'Tài xế Bình Chánh', href: '#' },
  { label: 'Kế toán quận 7', href: '#' },
];

const QuickSearchSuggestions = () => (
  <div className="quick-search-suggestions d-flex flex-wrap justify-content-center gap-2 mb-4">
    <span className="fw-bold text-secondary me-2">Tìm kiếm nhiều nhất hôm nay:</span>
    {suggestions.map((s, idx) => (
      <a key={idx} href={s.href} className="text-success fw-bold px-2 py-1 rounded-pill bg-light border border-success text-decoration-none" style={{fontSize:'1rem'}}>
        #{s.label}
      </a>
    ))}
  </div>
);

export default QuickSearchSuggestions; 