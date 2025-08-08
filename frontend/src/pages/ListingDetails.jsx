import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';

const ListingDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, addFavorite, removeFavorite } = React.useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const isFavorited = user && user.favorites && user.favorites.includes(id);

  const handleFavoriteClick = async () => {
    if (!user) return;
    try {
      if (isFavorited) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!listing) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">{listing.title}</h2>
      {listing.images && listing.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {listing.images.map((img) => (
            <img key={img.url} src={img.url} alt={listing.title} className="w-full h-40 object-cover" />
          ))}
        </div>
      )}
      <p className="font-bold text-lg text-primary mb-2">AED {listing.price.toLocaleString()}</p>
      <p className="mb-1">{listing.make} {listing.model} • {listing.year} • {listing.mileage.toLocaleString()} km</p>
      <p className="mb-1">{t('location')}: {listing.location}</p>
      <p className="mb-1">{t('bodyType')}: {listing.bodyType}</p>
      <p className="mb-1">{t('color')}: {listing.color}</p>
      <p className="mb-1">Engine: {listing.engine}</p>
      <p className="mb-1">Transmission: {listing.transmission}</p>
      <p className="mb-4">{listing.description}</p>
      <div className="p-4 border rounded mb-4">
        <h3 className="font-semibold mb-2">Seller Info</h3>
        <p>Name: {listing.seller?.name}</p>
        <p>Type: {listing.seller?.sellerType}</p>
        <p>Phone: {listing.seller?.phoneNumber || 'N/A'}</p>
      </div>
      {user ? (
        <button onClick={handleFavoriteClick} className="bg-primary text-white px-4 py-2 rounded">
          {isFavorited ? 'Remove Favourite' : 'Add Favourite'}
        </button>
      ) : (
        <p className="text-sm text-gray-600">{t('loginToFavorite')}</p>
      )}
    </div>
  );
};

export default ListingDetails;