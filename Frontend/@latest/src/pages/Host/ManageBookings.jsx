import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/UI/Badge';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    api.get('/host/manage-bookings').then(res => setBookings(res.data.bookings));
  }, []);

  const handleAction = async (bookingId, status) => {
    await api.post('/host/manage-bookings', { bookingId, action: status });
    // Refresh bookings after action
    const res = await api.get('/host/manage-bookings');
    setBookings(res.data.bookings);
  };

  const pending = bookings.filter(b => b.status === 'Pending');
  const history = bookings.filter(b => b.status !== 'Pending');

  return (
    <main className="container mb-5" style={{ marginTop: '180px' }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold">Reservation Manager</h2>
        <div className="nav nav-pills bg-white p-1 rounded-pill shadow-sm border">
          <button className={`nav-link rounded-pill px-4 ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
            Requests <span className="badge bg-dark ms-2">{pending.length}</span>
          </button>
          <button className={`nav-link rounded-pill px-4 ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <div className="d-flex flex-column gap-4">
          {pending.map(b => (
            <div key={b._id} className="card border-0 shadow-sm rounded-4 overflow-hidden p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="fw-bold">{b.homeName}</h5>
                  <p className="text-muted">Guest: {b.userId.firstName} {b.userId.lastName}</p>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => handleAction(b._id, 'Confirmed')} className="btn btn-dark rounded-pill">Accept</button>
                  <button onClick={() => handleAction(b._id, 'Rejected')} className="btn btn-outline-danger rounded-pill">Decline</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="table">
          <thead><tr><th>Guest</th><th>Property</th><th>Status</th></tr></thead>
          <tbody>
            {history.map(b => (
              <tr key={b._id}>
                <td>{b.userId.firstName}</td>
                <td>{b.homeName}</td>
                <td><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default ManageBookings;