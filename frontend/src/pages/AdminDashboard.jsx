import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('listings');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, userRes] = await Promise.all([
        api.get('/api/admin/listings'),
        api.get('/api/admin/users'),
      ]);
      setListings(listRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id) => {
    await api.put(`/api/admin/listings/${id}/approve`);
    fetchData();
  };

  const handleReject = async (id) => {
    await api.put(`/api/admin/listings/${id}/reject`);
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/admin/listings/${id}`);
    fetchData();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('adminDashboard')}</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTab('listings')}
          className={`px-3 py-1 rounded ${tab === 'listings' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Listings
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
      </div>
      {tab === 'listings' && (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Seller</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id} className="border-b">
                <td className="p-2 border">{listing.title}</td>
                <td className="p-2 border">{listing.seller?.name}</td>
                <td className="p-2 border">{listing.status}</td>
                <td className="p-2 border space-x-1">
                  {listing.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApprove(listing._id)} className="bg-green-500 text-white px-2 py-1 rounded">
                        {t('approve')}
                      </button>
                      <button onClick={() => handleReject(listing._id)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        {t('reject')}
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(listing._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === 'users' && (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Seller Type</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">{u.sellerType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;