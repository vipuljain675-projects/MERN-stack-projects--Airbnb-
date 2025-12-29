import React from 'react';

const Badge = ({ status, type = 'status' }) => {
  // 1. Logic for "Guest Favourite"
  if (type === 'favourite') {
    return (
      <div className="position-absolute top-0 start-0 m-2 px-2 py-1 bg-white rounded-pill shadow-sm border" 
           style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.95, zIndex: 10 }}>
        Guest favourite
      </div>
    );
  }

  // 2. Logic for Booking Statuses
  let badgeClass = "";
  let text = status;

  switch (status) {
    case 'Confirmed':
      badgeClass = "bg-success bg-opacity-10 text-success border border-success";
      text = "Accepted"; 
      break;
    case 'Rejected':
      badgeClass = "bg-danger bg-opacity-10 text-danger border border-danger";
      text = "Declined"; 
      break;
    case 'Cancelled':
      badgeClass = "bg-secondary bg-opacity-10 text-secondary border border-secondary";
      text = "Cancelled";
      break;
    case 'Pending':
      badgeClass = "bg-warning bg-opacity-10 text-dark border border-warning";
      text = "Pending";
      break;
    default:
      badgeClass = "bg-light text-dark border";
  }

  return (
    <span className={`badge rounded-pill px-3 py-2 ${badgeClass}`} style={{ fontSize: '0.8rem' }}>
      {text}
    </span>
  );
};

export default Badge;