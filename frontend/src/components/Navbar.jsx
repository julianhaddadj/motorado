import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = React.useContext(AuthContext);
  const { lang, toggleLanguage } = React.useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          {t('appName')}
        </Link>
        <div className="flex items-center space-x-4">
          <button onClick={toggleLanguage} className="bg-primary-dark px-2 py-1 rounded text-xs">
            {lang === 'en' ? t('arabic') : t('english')}
          </button>
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                {t('login')}
              </Link>
              <Link to="/register" className="hover:underline">
                {t('register')}
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/listings" className="hover:underline">
                {t('listings')}
              </Link>
              {(user.role === 'seller' || user.role === 'admin') && (
                <Link to="/create" className="hover:underline">
                  {t('createListing')}
                </Link>
              )}
              <Link to="/favorites" className="hover:underline">
                {t('favorites')}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:underline">
                  {t('adminDashboard')}
                </Link>
              )}
              <button onClick={handleLogout} className="hover:underline ml-2">
                {t('logout')}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;