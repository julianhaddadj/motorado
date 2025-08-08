import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import CarCard from '../components/CarCard';

const Favorites = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !user.favorites || user.favorites.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }
      try {
        const promises = user.favorites.map((id) => api.get(`/api/listings/${id}`));
        const results = await Promise.all(promises);
        setListings(results.map((res) => res.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  if (!listings || listings.length === 0) return <p>{t('noListings')}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('favorites')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <CarCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;