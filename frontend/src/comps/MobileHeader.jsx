import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';

const MobileNav = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  height: 65px;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 500;
  background: ${props => props.isHomePage
    ? 'rgba(236, 227, 206, 0.2)'
    : 'rgba(236, 227, 206, 0.72)'};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: ${props => props.isHomePage
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(58, 77, 57, 0.12)'};
  box-shadow: ${props => props.isHomePage
    ? 'none'
    : '0 1px 20px rgba(44, 51, 51, 0.08)'};
    
`;

const LogoContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: -15px;
  margin-right: -10px;
  img {
    width: 60px;
    height: 80px;
    object-fit: contain;
    display: block;
    transition: transform 0.25s ease;
    &:hover { transform: scale(1.06); }
  }
`;

const CtaButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  padding: 0 10px;
`;

const CtaButton = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${props => props.isHomePage ? 'rgba(255,255,255,0.92)' : '#3A4D39'};
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 10px;
  white-space: nowrap;
  border: 1.5px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.35)' : 'rgba(58, 77, 57, 0.20)'};
  background: ${props => props.isHomePage ? 'rgba(255,255,255,0.12)' : 'rgba(58, 77, 57, 0.04)'};
  transition: background 0.2s ease, border-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover, &:active {
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.22)' : 'rgba(58, 77, 57, 0.16)'};
    border-color: ${props => props.isHomePage ? 'rgba(255,255,255,0.6)' : 'rgba(58, 77, 57, 0.55)'};
    color: ${props => props.isHomePage ? 'rgba(255,255,255,0.92)' : '#3A4D39'};
    text-decoration: none;
  }
  &:visited, &:focus {
    color: ${props => props.isHomePage ? 'rgba(255,255,255,0.92)' : '#3A4D39'};
    text-decoration: none;
    outline: none;
  }
`;

const MenuButton = styled.button`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;

  span {
    width: 100%;
    height: 2px;
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.9)' : '#3A4D39'};
    border-radius: 2px;
    transition: all 0.25s ease;
  }

  &.open span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  &.open span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  &.open span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 62px;
  left: 0;
  width: 100%;
  background: rgba(236, 227, 206, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(58, 77, 57, 0.12);
  z-index: 499;
  transform-origin: top;
  transition: opacity 0.22s ease, transform 0.22s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transform: ${props => props.isOpen ? 'scaleY(1)' : 'scaleY(0.92)'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  box-shadow: 0 10px 30px rgba(44, 51, 51, 0.1);
`;

const MenuLinks = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 6px 14px 18px;
`;

const MenuLink = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(44, 51, 51, 0.85);
  text-decoration: none;
  padding: 13px 14px;
  border-bottom: 1px solid rgba(58, 77, 57, 0.08);
  text-align: left;
  direction: rtl;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:last-of-type { border-bottom: none; }
  &:hover, &:active {
    background: rgba(58, 77, 57, 0.08);
    color: #3A4D39;
    text-decoration: none;
  }
`;

const FAQToggle = styled.button`
  font-family: 'Heebo', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(44, 51, 51, 0.85);
  background: none;
  border: none;
  border-bottom: 1px solid rgba(58, 77, 57, 0.08);
  padding: 13px 14px;
  width: 100%;
  text-align: left;
  direction: ltr;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover { background: rgba(58, 77, 57, 0.08); color: #3A4D39; }
  &:focus { outline: none; }

  .arrow {
    font-size: 0.7rem;
    color: #739072;
    transition: transform 0.25s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const SubMenu = styled.div`
  overflow: hidden;
  max-height: ${props => props.isOpen ? '120px' : '0'};
  transition: max-height 0.28s ease;
`;

const SubMenuLink = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 0.92rem;
  color: rgba(44, 51, 51, 0.7);
  display: block;
  padding: 11px 28px;
  text-decoration: none;
  text-align: left;
  direction: rtl;
  border-bottom: 1px solid rgba(58, 77, 57, 0.06);
  background: rgba(58, 77, 57, 0.04);
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:last-child { border-bottom: none; }
  &:hover, &:active {
    background: rgba(58, 77, 57, 0.1);
    color: #3A4D39;
    text-decoration: none;
  }
`;

const Overlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 62px;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(44, 51, 51, 0.3);
  z-index: 498;
`;

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

    const logoSrc = isHomePage 
      ? '/images/logo (2).png'      
      : '/images/logo.png';

  useEffect(() => {
    setIsMenuOpen(false);
    setIsFAQOpen(false);
  }, [location]);

  const closeAll = () => { setIsMenuOpen(false); setIsFAQOpen(false); };

  return (
    <>
      <MobileNav isHomePage={isHomePage}>
        <LogoContainer>
          <Link to="/"><img src={logoSrc} alt="לוגו האתר" /></Link>
        </LogoContainer>
        <CtaButtons>
          <CtaButton to="/volunteer-page" isHomePage={isHomePage}>בואו להתנדב</CtaButton>
          <CtaButton to="/farmers-join" isHomePage={isHomePage}>הצטרפות חקלאים</CtaButton>
        </CtaButtons>
        <MenuButton
          isHomePage={isHomePage}
          className={isMenuOpen ? 'open' : ''}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="תפריט"
        >
          <span /><span /><span />
        </MenuButton>
      </MobileNav>

      <MobileMenu isOpen={isMenuOpen}>
        <MenuLinks>
          <MenuLink to="/" onClick={closeAll}>דף הבית</MenuLink>
          <MenuLink to="/volunteer-page" onClick={closeAll}>הצטרפות מתנדבים</MenuLink>
          <MenuLink to="/farmers-join" onClick={closeAll}>הצטרפות חקלאים</MenuLink>
          <FAQToggle type="button" isOpen={isFAQOpen} onClick={() => setIsFAQOpen(!isFAQOpen)}>
            שאלות ותשובות
            <span className="arrow">▼</span>
          </FAQToggle>
          <SubMenu isOpen={isFAQOpen}>
            <SubMenuLink to="/volunteer-faq" onClick={closeAll}>שאלות מתנדבים</SubMenuLink>
            <SubMenuLink to="/farmers-faq" onClick={closeAll}>שאלות חקלאים</SubMenuLink>
          </SubMenu>
        </MenuLinks>
      </MobileMenu>

      <Overlay isOpen={isMenuOpen} onClick={closeAll} />
    </>
  );
};

export default MobileHeader;