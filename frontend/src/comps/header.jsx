import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FAQDropdown } from './FAQ';
import MobileHeader from './MobileHeader';
import './header.css';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const logoSrc = isHomePage 
    ? '/images/logo (2).png'      
    : '/images/logo.png';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileHeader />
      ) : (
        <header className='site-header'>
          <div className="header-inner">
            <div className="logo-container">
              <Link to="/">
                <img src={logoSrc} alt="Site Logo" className="site-logo" />
              </Link>
            </div>
            <nav className="nav-container">
              <ul className='nav-site'>
                <Link to="/">דף הבית</Link>
                <Link to="/volunteer-page">הצטרפות מתנדבים</Link>
                <Link to="/farmers-join">הצטרפות חקלאים</Link>
                <FAQDropdown />
              </ul>
            </nav>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;