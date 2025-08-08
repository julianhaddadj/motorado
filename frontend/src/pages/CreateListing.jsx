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

  // Comprehensive list of car makes and models for the dropdowns.  Each
  // property maps a manufacturer to an array of models.  When a make is
  // selected, its array of models populates the model dropdown.  Year options
  // are derived from a generic range (see allYears below) because
  // model-specific production years are not provided.
  const carData = {
    Audi: [
      'Q5', 'Q7', 'A3', 'A8', 'A6', 'Q8', 'Q4', 'A4', 'A5', 'Q3',
      'S3/RS3', 'RS Q8', 'S7/RS7', 'S6/RS6', 'TT', 'A7', 'R8', 'SQ5',
      'S5/RS5', 'e-tron', 'S3', 'S8', 'RSQ3', 'S4/RS4', 'SQ8', 'Q2',
      'A1', 'S5', 'RS e-tron', 'SQ7'
    ],
    BMW: [
      'X5', '5-Series', 'X6', '7-Series', '3-Series', '4-Series', 'X7',
      '2-Series', 'X4', 'X1', 'M4', 'X3', 'X2', 'M5', '6-Series', '8-Series',
      '1-Series', 'M3', 'Z4', 'XM', 'iX', 'M8', 'M2', 'iX1', 'i5', 'i4',
      'iX3', 'i3', 'M6', 'i7', 'i8', 'iX2', 'M1', 'Z3', 'Z8'
    ],
    Bentley: [
      'Continental', 'Bentayga', 'Flying Spur', 'Mulsanne', 'Arnage',
      'Other', 'Azure', 'Brooklands'
    ],
    BYD: [
      'Leopard 8', 'Leopard 5', 'Song Plus', 'Leopard Titanium 3', 'HAN',
      'Leopard', 'Song L', 'Seal', 'Qin L', 'e2', 'Tang', 'Qin Plus',
      'ATTO 3', 'Seagull', 'Song Pro', 'Yuan up', 'SEALION', 'BYD',
      'Destroyer 05', 'Dolphin', 'Other', 'XIA'
    ],
    Cadillac: [
      'Escalade', 'ATS', 'CT5', 'XT4', 'SRX', 'XT5', 'CT4', 'CT6',
      'XT6', 'CT5/Catera', 'XTR/Eldorado', 'DTS/DeVille', 'STS/Seville',
      'XTS'
    ],
    Chevrolet: [
      'Captiva', 'Camaro', 'Tahoe', 'Corvette', 'Silverado', 'Malibu',
      'Cruze', 'Groove', 'Traverse', 'Spark', 'Suburban', 'Trax',
      'Blazer', 'Trailblazer', 'Equinox', 'Impala', 'Aveo',
      'Camaro Convertible', 'Express', 'Lumina', 'Sonic', 'Avalanche',
      'Caprice', 'Epica', 'Other', 'Bolt', 'Monza', 'Pickup'
    ],
    Dodge: [
      'Charger', 'Challenger', 'Ram', 'Durango', 'Nitro', 'Caravan',
      'Neon', 'Viper', 'Magnum', 'Van'
    ],
    Ferrari: [
      'Purosangue', 'SF90 Spider', 'SF90 Stradale', '812 GTS', 'Roma',
      '296 GTB', '296 GTS', '488 Pista', 'F8 Spider', '812', 'F8 Tributo',
      'Portofino', '488 GTB', '488 Pista Spider', '12i Cilindri',
      'GTC4 Lusso', '360', '458 Italia', '488 Spider', '812 Superfast',
      'California T', 'F430', '458 Spider', '612 Scaglietti', 'California',
      'GTC4 Lusso T', '488', 'F12', 'LaFerrari', 'Other', '512',
      'F12 Berlinetta', 'Testarossa', '599 GTB', 'Daytona', 'FF',
      'La Ferrari Aperta', '246 Dino', '348', '355', '412', '430',
      '458', '458 Speciale', 'Ferrari 456', 'Monza', 'Super America'
    ],
    Ford: [
      'Mustang', 'Explorer', 'Edge', 'F-Series Pickup', 'Escape',
      'Ecosport', 'Focus', 'Bronco', 'Ranger', 'Figo', 'Expedition',
      'Territory', 'F-Series', 'Transit', 'Fusion', 'Everest', 'Taurus',
      'GT', 'Fiesta', 'Shelby Cobra', 'Escort', 'Mustang Mach-E', 'Pickup',
      'Crown Victoria', 'Flex', 'Other', 'Super Duty', 'Tourneo', 'Van'
    ],
    GAC: [
      'GS8', 'GS3', 'EMKOO', 'EMPOW', 'Aion Hyper', 'GA4', 'EMZOOM',
      'GA8', 'GN6', 'GN8', 'GS5', 'Other', 'GA6', 'M8', 'S7', 'Aion Y'
    ],
    GMC: [
      'Yukon', 'Sierra', 'Terrain', 'Acadia', 'Hummer', 'Savana',
      'Pickup', 'Canyon', 'Other'
    ],
    Honda: [
      'Accord', 'Civic', 'CR-V', 'City', 'HR-V', 'Odyssey', 'Pilot',
      'ZR-V', 'Jazz', 'MR-V', 'S2000', 'Crosstour', 'ENP2', 'ENS1'
    ],
    Hyundai: [
      'Tucson', 'Elantra', 'Sonata', 'Santa Fe', 'Accent', 'Creta',
      'Palisade', 'Staria', 'H1', 'Veloster', 'Kona', 'Azera',
      'Grand i10', 'Venue', 'i10', 'Genesis', 'Grand Santa Fe', 'i30',
      'Avante', 'Grandeur', 'Porter', 'Stargazer', 'Centennial', 'H 100',
      'i20', 'Ioniq', 'Santa Cruz', 'Terracan'
    ],
    Infiniti: [
      'QX50', 'QX80', 'Q50', 'QX70', 'QX60', 'QX55', 'FX45/FX35',
      'Q30', 'JX-Series', 'Q70', 'G25', 'EX35', 'G37', 'Q60', 'QX30',
      'QX56', 'M-Series', 'FX50', 'G35', 'Q45'
    ],
    Jaguar: [
      'F-Pace', 'XF', 'E-Pace', 'F-Type', 'XE', 'XJ', 'XJ-Series',
      'XKR', 'XK', 'I-Pace', 'S-Type', 'E-Type', 'XJS'
    ],
    Jeep: [
      'Wrangler', 'Grand Cherokee', 'Wrangler Unlimited', 'Cherokee',
      'Grand Cherokee L', 'Compass', 'Grand Wagoneer', 'Gladiator',
      'Renegade', 'Wrangler 4xe', 'Commander', 'Other', 'Patriot'
    ],
    Jetour: [
      'T2', 'Dashing', 'T1', 'X70 Plus', 'X70', 'X90 Plus', 'X50',
      'T2-4DM', 'X70 FL', 'X70 S'
    ],
    Kia: [
      'Sportage', 'Seltos', 'Sorento', 'Carnival', 'Pegas', 'Optima', 'K5',
      'Rio', 'Cerato', 'Picanto', 'Telluride', 'K3', 'Soul', 'Sonet',
      'Forte', 'Sedona', 'Cadenza', 'Stinger', 'K8', 'Bongo', 'Carens',
      'Mohave', 'Morning', 'K5 HEV', 'KX1', 'Quoris', 'Ray'
    ],
    'Land Rover': [
      'Range Rover', 'Range Rover Sport', 'Defender', 'Range Rover Evoque',
      'Range Rover Velar', 'Discovery Sport', 'Discovery', 'LR4', 'LR2',
      'LR3'
    ],
    Lexus: [
      'RX-Series', 'IS-Series', 'LX600', 'NX-Series', 'ES-Series',
      'GX 460', 'LX570', 'LS-Series', 'GS-Series', 'LX-Series', 'UX 200',
      'LM 350h', 'LC 500', 'ES HYBRID', 'UX-Series', 'RC F', 'TX',
      'GX 470', 'GX 550', 'LM 300', 'RC', 'CT-Series', 'LFA', 'SC-Series'
    ],
    Lincoln: [
      'Navigator', 'Aviator', 'MKX', 'Nautilus', 'MKC', 'Corsair',
      'Continental', 'MKS', 'MKZ', 'MKT', 'Town Car'
    ],
    Maserati: [
      'Ghibli', 'Levante', 'Grecale', 'Quattroporte', 'GranTurismo', 'MC20',
      'GranCabrio', '4200', 'Spyder'
    ],
    Mazda: [
      'CX-5', '6', 'CX-9', '3', 'CX-3', 'CX-30', '2', 'MX-5', '3 Hatchback',
      'CX-60', 'CX-90', 'CX-7', 'Pickup'
    ],
    'Mercedes-Benz': [
      'G-Class', 'S-Class', 'C-Class', 'E-Class', 'A-Class', 'CLA', 'AMG',
      'GLE Coupe', 'GLE-Class', 'GLC', 'V-Class', 'SL-Class', 'CLS-Class',
      'GLS-Class', 'GLC Coupe', 'G-Class Brabus', 'GLA', 'GL-Class',
      'GLB', 'EQS', 'EQE', 'GLK-Class', 'CLE-Class', 'Sprinter', 'M-Class',
      'SLK-Class', 'C 63 AMG', 'Vito', 'CL-Class', 'C 43 AMG', 'EQC',
      'SLC', 'Viano', 'EQB', 'SLS', 'CLK-Class', 'EQA', 'GLC 63', 'SLR',
      'SEL-Class', 'Other', '190', '240/260/280', 'EQG', 'R-Class',
      'Vito Tourer', 'X Class', 'CLC', 'SEC-Class', '220 SE', '300/350/380',
      'Vito Panel Vans'
    ],
    MG: [
      'MG5', 'ZS', 'RX5', 'GT', 'HS', 'RX8', 'One', 'MG 7', 'GS', 'ZST',
      '6', 'Other', 'Whale', 'MG3', 'MG350', 'MG6', 'MGB', 'RX9'
    ],
    MINI: [
      'Cooper', 'Countryman', 'Clubman', 'Coupe', 'Paceman', 'Aceman',
      'Cooper Clubman', 'Roadster'
    ],
    Mitsubishi: [
      'Pajero', 'Attrage', 'L200', 'ASX', 'Montero Sport', 'Outlander',
      'Canter', 'Lancer', 'Xpander', 'Lancer EX', 'Eclipse Cross',
      'Mirage', 'Other', 'Pajero Sport', 'Xpander Cross', 'Galant',
      'Van', 'Evolution', 'Grandis', '3000GT', 'Eclipse'
    ],
    Nissan: [
      'Patrol', 'Altima', 'Sunny', 'X-Trail', 'Kicks', 'Pathfinder',
      'Sentra', 'Xterra', 'Armada', 'Urvan', 'Tiida', 'Maxima', 'Juke',
      'Navara', 'Patrol Safari', 'Rogue', 'Micra', 'Murano', 'GT-R',
      'Skyline', 'Versa', '370z', 'Qashqai', 'Super Safari', 'Pickup',
      'Sylphy', 'Titan', 'Z', '350Z', 'Quest', 'Silvia', '400Z', 'Magnite',
      'Patrol Pickup', 'Van'
    ],
    Peugeot: [
      '3008', 'Partner', 'Expert', '308', '2008', '208', '5008', 'Landtrek',
      '301', '508', 'Boxer', 'RCZ', '207', '408', 'Traveller', '206',
      '307', 'e-2008', 'iOn'
    ],
    Porsche: [
      'Carrera / 911', 'Cayenne', 'Macan', 'Panamera', 'Cayman',
      'Boxster', 'Taycan', '911', '718 Spyder', '918 Spyder', '928',
      '944', '968'
    ],
    Renault: [
      'Duster', 'Koleos', 'Megane', 'Symbol', 'Captur', 'Dokker', 'Fluence',
      'Master', 'Express Van', 'Other', 'Talisman', 'Alpine A110', 'Arkana',
      'Clio', 'Safrane', 'Samsung', 'Zoe'
    ],
    'Rolls-Royce': [
      'Cullinan', 'Ghost', 'Wraith', 'Phantom', 'Spectre', 'Dawn'
    ],
    Rox: ['01'],
    Suzuki: [
      'Jimny', 'Swift', 'Ciaz', 'Dzire', 'Baleno', 'Grand Vitara',
      'Ertiga', 'Fronx', 'Vitara', 'Celerio', 'APV Van', 'SX4', 'Eeco',
      'Kizashi'
    ],
    Tesla: ['Model 3', 'Model Y', 'Model X', 'Cybertruck', 'Model S'],
    Toyota: [
      'Land Cruiser', 'Prado', 'Hilux', 'Rav 4', 'Corolla', 'Yaris', 'Camry',
      'Fortuner', 'Hiace', 'Highlander', 'FJ Cruiser', 'Corolla Cross',
      'Rush', 'Land Cruiser 76 series', 'Tundra', 'Land Cruiser 79 series',
      'C-HR', 'Land Cruiser 70', 'Coaster', '4Runner', 'Sienna', 'Raize',
      'Avanza', 'Granvia', 'Innova', 'Tacoma', 'Land Cruiser 71',
      'Sequoia', 'Supra', 'Crown', 'Prius', 'Avalon', 'Veloz', 'Levin',
      'Pickup', 'Previa', 'Urban Cruiser', 'Alphard', '86', 'BZ4X',
      'Cither', 'Venza', 'bZ3', 'GR86', 'Aurion', 'Cressida', 'MR2',
      'Rumion', 'Wish', 'Zelas'
    ],
    Volkswagen: [
      'Golf', 'Tiguan', 'Teramont', 'Touareg', 'Passat', 'T-Roc', 'ID.4',
      'Jetta', 'Beetle', 'ID.6', 'CC', 'Scirocco', 'Polo', 'Transporter',
      'Amarok', 'Arteon', 'Atlas', 'Crafter', 'Eos', 'ID.7', 'Multivan'
    ],
    Volvo: [
      'XC60', 'XC90', 'S90', 'XC40', 'V-Class', 'S60', 'Other',
      'C-Class', 'C40', 'S40', 'S80', 'XC40 Recharge'
    ],
  };

  // A generic range of years used for all models.  We assume cars could be
  // produced between 2000 and 2025.  When a model is selected, this range
  // populates the year dropdown.
  const allYears = Array.from({ length: 26 }, (_, i) => 2000 + i);

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
  const models = form.make ? carData[form.make] : [];
  const years = form.model ? allYears : [];

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
            type="number"
            name="price"
            placeholder={t('price') || 'Price'}
            value={form.price}
            onChange={handlePriceChange}
            className="flex-1 border rounded px-3 py-2"
            required
            min="0"
          />
          <span className="ml-2 whitespace-nowrap">AED</span>
        </div>

        {/* Mileage */}
        <div className="flex items-center">
          <input
            type="number"
            name="mileage"
            placeholder={t('mileage') || 'Mileage'}
            value={form.mileage}
            onChange={handleMileageChange}
            className="flex-1 border rounded px-3 py-2"
            required
            min="0"
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