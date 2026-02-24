import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

/* ─── Animations ───────────────────────────────────────────────────── */
const menuSlide = keyframes`
  from { opacity: 0; transform: translateY(-10px) scaleY(0.96); }
  to   { opacity: 1; transform: translateY(0) scaleY(1); }
`;

const logoEntrance = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/* ─── Sticky nav bar ───────────────────────────────────────────────── */
const MobileNav = styled.header`
  display: flex;
  align-items: center;
  height: 56px;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 500;
  padding: 0 18px;
  /* ⬇ backgrounds unchanged from original */
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

const MenuButton = styled.button`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.92)' : '#3A4D39'};
    border-radius: 2px;
    transition: transform 0.28s ease, opacity 0.28s ease, width 0.28s ease;
    transform-origin: center;
  }
  span:nth-child(3) { width: 60%; }

  &.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  &.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  &.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); width: 100%; }
`;


const CtaGroup = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const CtaPrimary = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${props => props.isHomePage ? 'rgba(255,255,255,0.92)' : '#fff'} !important;
  text-decoration: none;
  padding: 7px 16px;
  border-radius: 100px;
  white-space: nowrap;
  background: ${props => props.isHomePage
    ? 'rgba(255,255,255,0.16)'
    : 'linear-gradient(135deg, #4a6741 0%, #739072 100%)'};
  border: 1.5px solid ${props => props.isHomePage
    ? 'rgba(255,255,255,0.38)'
    : 'transparent'};
  box-shadow: ${props => props.isHomePage ? 'none' : '0 3px 10px rgba(58,77,57,0.28)'};
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:active { transform: scale(0.95); }
  &:hover  { opacity: 0.88; text-decoration: none; }
  &:visited, &:focus { color: inherit !important; text-decoration: none; outline: none; }
`;

const CtaGhost = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${props => props.isHomePage ? 'rgba(255,255,255,0.88)' : '#3A4D39'} !important;
  text-decoration: none;
  padding: 7px 16px;
  border-radius: 100px;
  white-space: nowrap;
  background: ${props => props.isHomePage
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(58,77,57,0.06)'};
  border: 1.5px solid ${props => props.isHomePage
    ? 'rgba(255,255,255,0.30)'
    : 'rgba(58,77,57,0.22)'};
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:active { transform: scale(0.95); }
  &:hover  { opacity: 0.78; text-decoration: none; }
  &:visited, &:focus { text-decoration: none; outline: none; }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  img {
    width: 160px;
    height: auto;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 6px 20px rgba(0,0,0,0.22));
    animation: ${logoEntrance} 0.55s ease both;
    transition: transform 0.25s ease;
    &:hover { transform: scale(1.04); }
    opacity: 0.9 !important;

    @media (max-width: 380px) {
     width: 140px;
     height: auto;
  }
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  width: 100%;
  /* Match header background — same frosted glass logic */
  background: ${props => props.isHomePage
    ? 'rgba(20, 16, 10, 0.72)'
    : 'rgba(236, 227, 206, 0.94)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: ${props => props.isHomePage
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(58, 77, 57, 0.10)'};
  z-index: 499;
  transform-origin: top center;
  box-shadow: 0 14px 36px rgba(44, 51, 51, 0.13);
  animation: ${props => props.isOpen ? menuSlide : 'none'} 0.24s ease both;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transform: ${props => props.isOpen ? 'scaleY(1)' : 'scaleY(0.95)'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
`;

const MenuLinks = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 8px 14px 20px;
`;

const MenuLink = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.isHomePage ? 'rgba(255,245,220,0.88)' : 'rgba(44, 51, 51, 0.85)'};
  text-decoration: none;
  padding: 13px 14px;
  border-bottom: 1px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.08)' : 'rgba(58, 77, 57, 0.07)'};
  text-align: left;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:last-of-type { border-bottom: none; }
  &:hover, &:active {
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.08)' : 'rgba(58, 77, 57, 0.07)'};
    color: ${props => props.isHomePage ? '#fff' : '#3A4D39'};
    text-decoration: none;
  }
`;

const FAQToggle = styled.button`
  font-family: 'Heebo', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.isHomePage ? 'rgba(255,245,220,0.88)' : 'rgba(44, 51, 51, 0.85)'};
  background: none;
  border: none;
  border-bottom: 1px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.08)' : 'rgba(58, 77, 57, 0.07)'};
  padding: 13px 14px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.08)' : 'rgba(58, 77, 57, 0.07)'};
    color: ${props => props.isHomePage ? '#fff' : '#3A4D39'};
  }
  &:focus { outline: none; }

  .arrow {
    font-size: 0.65rem;
    color: ${props => props.isHomePage ? 'rgba(255,255,255,0.5)' : '#739072'};
    transition: transform 0.26s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const SubMenu = styled.div`
  overflow: hidden;
  max-height: ${props => props.isOpen ? '120px' : '0'};
  transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.isHomePage ? 'rgba(255,255,255,0.06)' : 'rgba(58, 77, 57, 0.035)'};
`;

const SubMenuLink = styled(Link)`
  font-family: 'Heebo', sans-serif;
  font-size: 0.92rem;
  color: ${props => props.isHomePage ? 'rgba(255,245,220,0.92)' : 'rgba(44, 51, 51, 0.85)'} !important;
  display: block;
  padding: 10px 28px;
  text-decoration: none;
  text-align: left;
  border-bottom: 1px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.07)' : 'rgba(58, 77, 57, 0.05)'};
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:last-child { border-bottom: none; }
  &:hover, &:active {
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.1)' : 'rgba(58, 77, 57, 0.09)'} !important;
    color: ${props => props.isHomePage ? '#fff' : '#3A4D39'} !important;
    text-decoration: none;
  }
`;



const Overlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100vh;
  background: rgba(44, 51, 51, 0.22);
  z-index: 498;
`;

/* ─── Component ────────────────────────────────────────────────────── */
const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen]   = useState(false);
  const location   = useLocation();
  const isHomePage = location.pathname === '/';

  /* Logo source: light version on homepage, dark on all other pages */
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
      {/* ── Sticky nav bar ── */}
      <MobileNav isHomePage={isHomePage}>

        {/* Hamburger — LEFT side */}
        <MenuButton
          isHomePage={isHomePage}
          className={isMenuOpen ? 'open' : ''}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="תפריט"
        >
          <span /><span /><span />
        </MenuButton>

        {/* CTA buttons — centred */}
        <CtaGroup>
          <CtaGhost to="/farmers-join" isHomePage={isHomePage} onClick={closeAll}>
           יש לי משק
          </CtaGhost>
          <CtaPrimary to="/volunteer-page" isHomePage={isHomePage} onClick={closeAll}>
           יאללה לשדה !
          </CtaPrimary>
        </CtaGroup>

      </MobileNav>

      {/* ── Logo: below nav, centred, visible on ALL pages ── */}
      <LogoContainer>
        <Link to="/" onClick={closeAll}>
          <img src={logoSrc} alt="מתנדבים באדמה" />
        </Link>
      </LogoContainer>

      {/* ── Dropdown menu (links unchanged, animation improved) ── */}
      <MobileMenu isOpen={isMenuOpen} isHomePage={isHomePage}>
        <MenuLinks>
          <MenuLink to="/" onClick={closeAll} isHomePage={isHomePage}>דף הבית</MenuLink>
          <MenuLink to="/volunteer-page" onClick={closeAll} isHomePage={isHomePage}>הצטרפות מתנדבים</MenuLink>
          <MenuLink to="/farmers-join"   onClick={closeAll} isHomePage={isHomePage}>הצטרפות חקלאים</MenuLink>
          <FAQToggle type="button" isOpen={isFAQOpen} isHomePage={isHomePage} onClick={() => setIsFAQOpen(!isFAQOpen)}>
            שאלות ותשובות
            <span className="arrow">▼</span>
          </FAQToggle>
          <SubMenu isOpen={isFAQOpen} isHomePage={isHomePage}>
          <SubMenuLink to="/volunteer-faq" onClick={closeAll} isHomePage={isHomePage}>שאלות מתנדבים</SubMenuLink>
          <SubMenuLink to="/farmers-faq"   onClick={closeAll} isHomePage={isHomePage}>שאלות חקלאים</SubMenuLink>
        </SubMenu>
        </MenuLinks>
      </MobileMenu>

      <Overlay isOpen={isMenuOpen} onClick={closeAll} />
    </>
  );
};

export default MobileHeader;
