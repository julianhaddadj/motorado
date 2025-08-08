import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">{t('appName')}</h1>
      <p className="mb-8">Find your perfect car in the UAE. Browse thousands of listings, filter by what matters and contact sellers directly.</p>
      <Link to="/listings" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
        {t('listings')}
      </Link>
    </div>
  );
};

export default Home;