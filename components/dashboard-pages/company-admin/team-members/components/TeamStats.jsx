const TeamStats = () => {
  const stats = [
    {
      id: 1,
      title: "Total Members",
      count: "18",
      icon: "la la-users",
      color: "text-primary",
      bgColor: "bg-primary-light"
    },
    {
      id: 2, 
      title: "Company Admins",
      count: "2",
      icon: "la la-user-shield",
      color: "text-danger",
      bgColor: "bg-danger-light"
    },
    {
      id: 3,
      title: "HR Members",
      count: "16",
      icon: "la la-user-tie", 
      color: "text-success",
      bgColor: "bg-success-light"
    },
    {
      id: 4,
      title: "Pending Requests",
      count: "5",
      icon: "la la-clock",
      color: "text-warning",
      bgColor: "bg-warning-light"
    }
  ];

  return (
    <>
      {stats.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className="ui-item">
            <div className={`left ${item.bgColor}`}>
              <i className={`icon ${item.icon} ${item.color}`}></i>
            </div>
            <div className="right">
              <h4>{item.count}</h4>
              <p>{item.title}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TeamStats; 