import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const CreateListing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  /**
   * Form state holds all the values for the listing fields.  We initialise
   * values to empty strings except where a default makes sense.  Many of
   * these fields are now controlled by dropdowns or selectors rather than
   * free‑form text inputs.
   */
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

  // Data for car makes, models and years.  This is a small sample dataset
  // intended to demonstrate dynamic dropdowns.  In a real application you
  // might fetch this from an API or store a more comprehensive list.
  const carData = {
    Toyota: {
      Corolla: [2020, 2021, 2022, 2023, 2024],
      Camry: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      Yaris: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    },
    Honda: {
      Civic: [2019, 2020, 2021, 2022, 2023, 2024],
      Accord: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      CRV: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    },
    Nissan: {
      Altima: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      Sentra: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      Patrol: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    },
  };

  // Predefined options for mileage ranges, engines, transmissions, colours,
  // body types and cities.  These arrays drive the dropdowns and selectors.
  // Note: mileage is now a numeric input; we no longer use predefined ranges.
  const engineOptions = ['Petrol', 'Electric', 'Diesel'];
  const transmissionOptions = ['Automatic', 'Manual'];
  const colourOptions = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Silver', value: '#c0c0c0' },
    { name: 'Blue', value: '#1e3a8a' },
    { name: 'Red', value: '#b91c1c' },
    { name: 'Green', value: '#065f46' },
    { name: 'Yellow', value: '#ca8a04' },
    // The "Other" option allows the user to pick a custom colour via a colour picker
    { name: 'Other', value: null, custom: true },
  ];
  // Show colour picker for custom colours
  const [showColourPicker, setShowColourPicker] = useState(false);
  const bodyOptions = [
    { name: 'Sedan', icon: '🚗' },
    { name: 'SUV', icon: '🚙' },
    { name: 'Convertible', icon: '🏎️' },
    { name: 'Hatchback', icon: '🚘' },
    { name: 'Coupe', icon: '🚕' },
  ];
  const cityOptions = [
    'Dubai',
    'Sharjah',
    'Abu Dhabi',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah',
  ];

  // Derived options based on selected make and model
  const makes = Object.keys(carData);
  const models = form.make ? Object.keys(carData[form.make]) : [];
  const years = form.make && form.model ? carData[form.make][form.model] : [];

  // Determine whether the currently selected colour is custom (i.e. not one
  // of the predefined swatches).  This is used to highlight the "Other"
  // option when a custom colour is chosen.
  const isCustomColour = form.color && !colourOptions.some((c) => !c.custom && c.value === form.color);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle price input separately to ensure only numbers are entered.  We
  // allow empty string so the field can be cleared.  Any non‑digit
  // characters are ignored.
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setForm({ ...form, price: value });
    }
  };

  // Handlers for dropdowns and selectors.  For make/model/year we reset
  // dependent fields when the parent changes.
  const handleMakeChange = (e) => {
    const newMake = e.target.value;
    setForm({ ...form, make: newMake, model: '', year: '' });
  };
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setForm({ ...form, model: newModel, year: '' });
  };
  const handleYearChange = (e) => {
    setForm({ ...form, year: e.target.value });
  };

  // Ensure mileage only accepts numbers.  Empty string is allowed so the field
  // can be cleared.  Non‑digit characters are ignored.
  const handleMileageChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setForm({ ...form, mileage: value });
    }
  };
  const handleEngineChange = (e) => {
    setForm({ ...form, engine: e.target.value });
  };
  const handleTransmissionChange = (value) => {
    setForm({ ...form, transmission: value });
  };
  const handleColourChange = (value, isCustom = false) => {
    if (isCustom) {
      // Show the colour picker for custom colours
      setShowColourPicker(true);
    } else {
      // Hide the picker and set the selected colour
      setShowColourPicker(false);
      setForm({ ...form, color: value });
    }
  };
  const handleBodyTypeChange = (value) => {
    setForm({ ...form, bodyType: value });
  };
  const handleCityChange = (e) => {
    setForm({ ...form, location: e.target.value });
  };

  // When the user picks a custom colour from the colour picker, update the
  // form state directly.
  const handleCustomColourChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, color: val });
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
        {/* Title */}
        <input
          name="title"
          placeholder={t('title') || 'Title'}
          value={form.title}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        {/* Make */}
        <select
          name="make"
          value={form.make}
          onChange={handleMakeChange}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">{t('make') || 'Make'}</option>
          {makes.map((make) => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        {/* Model */}
        <select
          name="model"
          value={form.model}
          onChange={handleModelChange}
          className="border rounded px-3 py-2"
          required
          disabled={!form.make}
        >
          <option value="">{t('model') || 'Model'}</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        {/* Year */}
        <select
          name="year"
          value={form.year}
          onChange={handleYearChange}
          className="border rounded px-3 py-2"
          required
          disabled={!form.model}
        >
          <option value="">{t('year') || 'Year'}</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Price */}
        <div className="flex items-center">
          <input
            name="price"
            placeholder={t('price') || 'Price'}
            value={form.price}
            onChange={handlePriceChange}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <span className="ml-2 whitespace-nowrap">AED</span>
        </div>

        {/* Mileage */}
        <div className="flex items-center">
          <input
            name="mileage"
            placeholder={t('mileage') || 'Mileage'}
            value={form.mileage}
            onChange={handleMileageChange}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <span className="ml-2 whitespace-nowrap">km</span>
        </div>

        {/* Engine */}
        <div className="flex flex-col">
          <span className="text-sm mb-1">{t('engine') || 'Engine'}</span>
          <div className="flex gap-4">
            {engineOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="engine"
                  value={opt}
                  checked={form.engine === opt}
                  onChange={handleEngineChange}
                  className="mr-1"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className="flex flex-col">
          <span className="text-sm mb-1">{t('transmission') || 'Transmission'}</span>
          <div className="flex gap-4">
            {transmissionOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`flex items-center justify-center border rounded px-3 py-2 ${form.transmission === opt ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => handleTransmissionChange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Colour */}
        <div className="flex flex-col">
          <span className="text-sm mb-1">{t('color') || 'Colour'}</span>
          <div className="flex gap-2 flex-wrap">
            {colourOptions.map((col) => {
              if (col.custom) {
                return (
                  <button
                    key={col.name}
                    type="button"
                    className={`w-8 h-8 flex items-center justify-center rounded-full border ${isCustomColour || showColourPicker ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleColourChange(null, true)}
                    title={col.name}
                  >
                    🎨
                  </button>
                );
              }
              return (
                <button
                  key={col.name}
                  type="button"
                  className={`w-8 h-8 rounded-full border ${form.color === col.value ? 'ring-2 ring-primary' : ''}`}
                  style={{ backgroundColor: col.value }}
                  onClick={() => handleColourChange(col.value)}
                  title={col.name}
                />
              );
            })}
          </div>
          {showColourPicker && (
            <div className="mt-2">
              <input
                type="color"
                value={form.color || '#ffffff'}
                onChange={handleCustomColourChange}
                className="w-16 h-8 border rounded p-0"
              />
            </div>
          )}
        </div>

        {/* Body Type */}
        <div className="flex flex-col">
          <span className="text-sm mb-1">{t('bodyType') || 'Body Type'}</span>
          <div className="flex gap-3 flex-wrap">
            {bodyOptions.map((body) => (
              <button
                key={body.name}
                type="button"
                className={`flex flex-col items-center justify-center border rounded p-2 w-16 h-16 text-sm ${form.bodyType === body.name ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => handleBodyTypeChange(body.name)}
                title={body.name}
              >
                <span className="text-xl">{body.icon}</span>
                <span className="text-xs mt-1">{body.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <select
          name="location"
          value={form.location}
          onChange={handleCityChange}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">{t('location') || 'City'}</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          placeholder={t('description') || 'Description'}
          value={form.description}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        {/* Images */}
        <div>
          <label className="block mb-1">{t('images') || 'Images'}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="bg-primary text-white py-2 rounded">
          {t('create') || 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;