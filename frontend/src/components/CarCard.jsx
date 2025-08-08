import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';

const CarCard = ({ listing, onFavoriteChange }) => {
  const { t } = useTranslation();
  const { user, addFavorite, removeFavorite } = React.useContext(AuthContext);
  const isFavorited = user && user.favorites && user.favorites.includes(listing._id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (isFavorited) {
      await removeFavorite(listing._id);
    } else {
      await addFavorite(listing._id);
    }
    if (onFavoriteChange) onFavoriteChange();
  };

  return (
    <Link to={`/listings/${listing._id}`} className="block border rounded overflow-hidden hover:shadow-lg">
      {listing.images && listing.images.length > 0 && (
        <img src={listing.images[0].url} alt={listing.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
        <p className="text-sm text-gray-600">
          {listing.make} {listing.model} • {listing.year} • {listing.mileage.toLocaleString()} km
        </p>
        <p className="text-primary font-bold text-lg mt-2">AED {listing.price.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{listing.location}</p>
        {user && (
          <button
            onClick={handleFavoriteClick}
            className={`mt-2 text-sm ${isFavorited ? 'text-red-500' : 'text-blue-500'} underline`}
          >
            {isFavorited ? 'Remove Favourite' : 'Add Favourite'}
          </button>
        )}
      </div>
    </Link>
  );
};

export default CarCard;