import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FAQDropdown } from './FAQ';
import styled from '@emotion/styled';

const FAQButton = styled.button`
  /* Reset all button styles */
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  outline: none;
  
  /* Match link styles exactly */
  width: 100%;
  text-align: center;
  background: none !important;
  border: none !important;
  color: #4A6741 !important;
  text-decoration: none;
  font-size: 1rem;
  padding: 15px 0;
  font-family: 'Open Sans', sans-serif;
  &:not(:last-child) {
  border-bottom: none!important;
}
  transition: all 0.2s ease;
  
  /* Remove default button styles */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  
  /* Match link hover effects */
  &:hover {
    background: rgba(74, 103, 65, 0.1) !important;
    transform: translateX(-3px);
  }
  
  &:active, &:focus {
    background: none !important;
    outline: none !important;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  /* הוספת מרווח מדומה בצד ימין כדי לאזן את החץ */
  &::before {
    content: '';
     /* אותו רוחב כמו המרווח של החץ */
  }

    /* עיצוב החץ עם מיקום מוחלט */
  &::after {
    content: '▼';
    font-size: 0.8em;
    position: absolute;
    
    transform: ${props => props.isOpen ? 'rotate(0deg)' : 'rotate(0)'};
    transition: transform 0.3s ease;
  }

    @media screen and (min-width: 481px) and (max-width: 767px){
      &::after{
      margin-left: 140px;
      }
  }


  @media screen and (min-width: 414px) and (max-width: 480px){
      &::after{
      margin-left: 120px;
      }
  }

   @media screen and (min-width: 375px) and (max-width: 413px){
      &::after{
      margin-left: 150px;
      }
   }

    @media screen and (min-width: 320px) and (max-width: 374px){
       &::after{
      margin-left: 120px;
      }
    }
  

 

  /* Match link responsive styles */
   @media screen and (min-width: 481px) and (max-width: 767px) {
    font-size: 1.1rem !important;
    padding: 1px 0;
    margin-bottom: 10px;
    
  }
  @media screen and (min-width: 414px) and (max-width: 480px) {
    font-size: 0.95rem !important;
    padding: 1px 0;
    margin-bottom: 10px;
  }

  @media screen and (min-width: 375px) and (max-width: 413px) {
    font-size: 1rem !important;
    padding: 2px 0;
     margin-bottom: 10px;
     
  }
  
  @media screen and (min-width: 320px) and (max-width: 374px) {
    font-size: 0.9rem !important;
    padding: 1px 0;
  }

  /* Override any existing styles */
  && {
    background: none;
    border: none;
    box-shadow: none;
  }
`;

// עדכון הסגנון של SubMenuContainer
const SubMenuContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  max-height: ${props => props.isOpen ? '200px' : '0'};
  transition: max-height 0.3s ease-in-out;
  background: rgba(74, 103, 65, 0.05);
`;

// עדכון הסגנון של SubMenuLink
const SubMenuLink = styled(Link)`
  width: 100%;
  text-align: center;
  color: #4A6741;
  padding: 12px 0;
  font-size: 1.1rem;
  opacity: 0.9;
  border-bottom: 1px solid rgba(74, 103, 65, 0.2);
  text-decoration: none;
  background: none;
  
  &:last-child {
    border-bottom: none;
  }
  
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  
  &:active {
    background: none;
  }

  &:hover {
    background: rgba(74, 103, 65, 0.1);
    transform: translateX(-3px);
  }

  @media screen and (min-width: 414px) and (max-width: 480px) {
    font-size: 0.9em;
  }

  @media screen and (min-width: 375px) and (max-width: 413px) {
    font-size: 1rem;
  }
  
  @media screen and (min-width: 320px) and (max-width: 374px) {
    font-size: 0.9rem;
  }
`;
const MobileNav = styled.header`
  @media screen and (max-width: 767px) {
    background: ${props => props.isHomePage 
      ? 'transparent' 
      : 'linear-gradient(135deg,rgb(153, 122, 69),rgb(158, 122, 60))'};
    backdrop-filter: ${props => props.isHomePage ? 'blur(10px)' : 'none'};
    border-bottom: ${props => props.isHomePage 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : 'none'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    width: 100%;
    height: 70px;
    position: relative;
    z-index: 1000;
    margin-top: -5px;
  }

@media screen and (min-width: 481px) and (max-width: 767px){
height: 70px;

}

@media screen and (min-width: 414px) and (max-width: 480px){
 height: 60px;

 }

 @media screen and (min-width: 375px) and (max-width: 413px){
  height: 65px;
 }
 
 @media screen and (min-width: 320px) and (max-width: 374px) {
   height: 50px;
 }
`;

const LogoContainer = styled.div`
  @media screen and (max-width: 767px) {
    width: 100px;
    height: 110px;
    position: absolute;
    left: 5px;  
    top: -30px;
    
    img {
      width: 100%;
      height: 120%;
      object-fit: contain;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  @media screen and (min-width: 414px) and (max-width: 480px){
    width: 100px;
    height: 110px;
    left: -5px;  
    top: -35px;
  }

  @media screen and (min-width: 375px) and (max-width: 413px){
    width: 95px;
    height: 110px;
    left: 5px;  
    top: -30px;
  }
 
  @media screen and (min-width: 320px) and (max-width: 374px) {
    width: 100px ;
    height: 90px;
    left: -10px;  
    top: -25px;
  }
`;

const ButtonsContainer = styled.div`
  @media screen and (max-width: 767px) {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin: 0 auto;
    padding-left: 40px;
  }

@media screen and (min-width: 414px) and (max-width: 480px){
   
   padding-left: 40px;
   gap: 8px;

 }

 @media screen and (min-width: 375px) and (max-width: 413px){
   flex-direction: column;
   padding-left: 30px;
  
 }
 
 @media screen and (min-width: 320px) and (max-width: 374px) {
 flex-direction: column;
   padding-left: 30px;
 }

`;


const NavButton = styled(Link)`
  @media screen and (max-width: 767px) {
    padding: 8px 15px;
    background: ${props => props.isHomePage 
      ? 'rgba(255, 255, 255, 0.92)' 
      : 'rgba(228, 213, 195, 0.4)'};
    border-radius: 6px;
    color: #f7f8fb;
    text-decoration: none;
    font-size: 1rem;
    text-align: center;
    transition: all 0.3s ease;
    font-family: 'Open Sans', sans-serif;

    /* ביטול הדגשת רקע בעת לחיצה */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    outline: none;

    /* ביטול רקע ברירת מחדל בעת לחיצה */
    &:active {
      background: ${props => props.isHomePage 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(228, 213, 195, 0.4)'} !important;
    }

    &:hover {
      transform: translateY(-2px);
      background: ${props => props.isHomePage 
        ? 'rgba(255, 255, 255, 0.3)' 
        : 'rgba(228, 213, 195, 0.6)'};
    }

    /* ביטול הדגשת רקע בעת פוקוס */
    &:focus {
      outline: none;
      background: ${props => props.isHomePage 
        ? 'rgba(255, 255, 255, 0.92)' 
        : 'rgba(228, 213, 195, 0.4)'};
    }
  }

  @media screen and (min-width: 414px) and (max-width: 480px){
    padding: 6px 12px;
    font-size: 0.95rem
  }

  @media screen and (min-width: 375px) and (max-width: 413px){
    padding: 5px 15px;
    font-size: 0.95rem
  }
 
  @media screen and (min-width: 320px) and (max-width: 374px) {
    padding: 3px 9px;
    font-size: 0.85rem
  }
`;
const MenuButton = styled.button`
   @media screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 25px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    position: absolute;
    right: 25px; 
    
  

        -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    
    span {
      width: 100%;
      height: 2px;
      background-color: #f7f8fb;
      transition: all 0.3s;
    }
  }

@media screen and (min-width: 414px) and (max-width: 480px){
    width: 27px;
    height: 22px;
    right: 20px;

 }

 @media screen and (min-width: 375px) and (max-width: 413px){
 

  width: 30px;
    height: 25px;
    right: 25px;

 }
 
 @media screen and (min-width: 320px) and (max-width: 374px) {
   
    
  width: 23px;
  height: 20px;
  right: 20px;
  
    

 

`;

const MobileMenu = styled.div`
  @media screen and (max-width: 767px) {
    position: absolute;
    top: calc(100% - 1px);
    left: 0;
    width: 100%;
    background: rgba(255, 252, 247, 0.98);
    z-index: 999;
    transform-origin: top;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transform: ${props => props.isOpen ? 'scaleY(1)' : 'scaleY(0)'};
    pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
    height: auto;
    
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    .close-button {
      position: absolute;
      top: 10px;
      left: 15px;
      background: none;
      border: none;
      color: #4A6741;
      font-size: 20px;
      cursor: pointer;
      transition: transform 0.2s ease;
      
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  @media screen and (max-width: 480px) {
    .close-button {
      font-size: 17px;
      top: 15px;
      left: 12px;
    }
  }

  @media screen and (max-width: 320px) {
    .close-button {
      font-size: 18px;
      top: 10px;
      left: 10px;
    }
  }
`;

const MobileMenuLinks = styled.nav`

  @media screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
      padding-top: 10px;
    
    a {
      color: #4A6741;
      text-decoration: none;
      font-size: 1.1rem;
      padding: 15px 0;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(74, 103, 65, 0.2);
      font-family: 'Open Sans', sans-serif;
           transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      
      &:hover {
        background: rgba(74, 103, 65, 0.1);
        transform: translateX(-3px);
      }
      
      &:active {
        background: none;
      }

      &:last-child {
        border-bottom: none;
      }

   
      /* שימוש ב-props.isOpen */
      opacity: ${props => props.isOpen ? '1' : '0'};
      transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

 a:nth-of-type(1) { transition-delay: 0.1s; }
a:nth-of-type(2) { transition-delay: 0.15s; }
a:nth-of-type(3) { transition-delay: 0.2s; }
a:nth-of-type(4) { transition-delay: 0.25s; }
a:nth-of-type(5) { transition-delay: 0.3s; }
    
    button.close-button {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      background: none;
      
      &:active {
        background: none;
      }
    }
  }


  @media screen and (min-width: 414px) and (max-width: 480px){
 
  padding: 15px;
    
    a {
      font-size: 0.95rem;
      padding: 12px 0;
    }

 }

 @media screen and (min-width: 375px) and (max-width: 413px){
  padding: 15px;
    
    a {
      font-size: 1rem;
      padding: 17px 0;
    }
 }
 
 @media screen and (min-width: 320px) and (max-width: 374px) {

   padding: 15px;
    
    a {
      font-size: 0.85rem;
      padding: 12px 0;
    }
 }
`;

const Overlay = styled.div`
  @media screen and (max-width: 767px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;
const MobileHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
  
    useEffect(() => {
      setIsMenuOpen(false);
      setIsFAQOpen(false);
    }, [location]);
  
    return (
      <>
        <MobileNav isHomePage={isHomePage}>
          <LogoContainer>
            <img src="/images/logo.png" alt="Site Logo"  className='mobile-logo'/>
          </LogoContainer>
  
          <ButtonsContainer>
            <NavButton to="/volunteer-page" isHomePage={isHomePage}>
              בואו להתנדב
            </NavButton>
            <NavButton to="/farmers-join" isHomePage={isHomePage}>
              הצטרפות חקלאים
            </NavButton>
          </ButtonsContainer>
  
          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </MenuButton>
  
          <MobileMenu isOpen={isMenuOpen}>
            <button className="close-button" onClick={() => setIsMenuOpen(false)}>✕</button>
            <MobileMenuLinks isOpen={isMenuOpen}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>דף הבית</Link>
              <Link to="/volunteer-page" onClick={() => setIsMenuOpen(false)}>הצטרפות מתנדבים</Link>
              <Link to="/farmers-join" onClick={() => setIsMenuOpen(false)}>הצטרפות חקלאים</Link>
              
              {/* FAQ Section */}
              <FAQButton 
              type="button"  
              isOpen={isFAQOpen}
              onClick={(e) => {
                e.preventDefault();  
                setIsFAQOpen(!isFAQOpen);
              }}
            >
              שאלות ותשובות
            </FAQButton>
            
            <SubMenuContainer isOpen={isFAQOpen}>
              <SubMenuLink 
                to="/volunteer-faq" 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsFAQOpen(false);
                }}
              >
                שאלות מתנדבים
              </SubMenuLink>
              <SubMenuLink 
                to="/farmers-faq" 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsFAQOpen(false);
                }}
              >
                שאלות חקלאים
              </SubMenuLink>
            </SubMenuContainer>
         
            </MobileMenuLinks>
          </MobileMenu>
        </MobileNav>
        <Overlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      </>
    );
  };
  

export default MobileHeader;
