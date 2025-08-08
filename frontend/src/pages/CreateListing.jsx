import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const CreateListing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    engine: '',
    transmission: '',
    color: '',
    bodyType: '',
    location: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((file) => {
      formData.append('images', file);
    });
    try {
      await api.post('/api/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{t('createListing')}</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {['title','make','model','year','price','mileage','engine','transmission','color','bodyType','location'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={t(field) || field}
            value={form[field]}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required={['title','make','model','year','price','mileage','location'].includes(field)}
          />
        ))}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        <div>
          <label className="block mb-1">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="bg-primary text-white py-2 rounded">
          {t('create')}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;