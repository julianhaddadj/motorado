import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import CarCard from '../components/CarCard';

const Listings = () => {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    mileage: '',
    location: '',
    bodyType: '',
    color: '',
    sellerType: '',
    sort: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchListings = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/listings', { params });
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Remove empty values
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined)
    );
    fetchListings(params);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('listings')}</h2>
      <form onSubmit={handleSearch} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          name="make"
          placeholder={t('make')}
          value={filters.make}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <input
          name="model"
          placeholder={t('model')}
          value={filters.model}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <input
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          type="number"
        />
        <input
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          type="number"
        />
        <input
          name="minYear"
          placeholder="Min Year"
          value={filters.minYear}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          type="number"
        />
        <input
          name="maxYear"
          placeholder="Max Year"
          value={filters.maxYear}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          type="number"
        />
        <input
          name="mileage"
          placeholder={t('mileage')}
          value={filters.mileage}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          type="number"
        />
        <input
          name="location"
          placeholder={t('location')}
          value={filters.location}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <input
          name="bodyType"
          placeholder={t('bodyType')}
          value={filters.bodyType}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <input
          name="color"
          placeholder={t('color')}
          value={filters.color}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <select
          name="sellerType"
          value={filters.sellerType}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        >
          <option value="">{t('sellerType')}</option>
          <option value="dealer">{t('dealer')}</option>
          <option value="individual">{t('individual')}</option>
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        >
          <option value="">Sort</option>
          <option value="recent">Most Recent</option>
          <option value="priceLowHigh">Price Low→High</option>
          <option value="priceHighLow">Price High→Low</option>
        </select>
        <button type="submit" className="bg-primary text-white px-4 py-1 rounded">
          {t('search')}
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p>{t('noListings')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <CarCard key={listing._id} listing={listing} onFavoriteChange={() => fetchListings(filters)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;