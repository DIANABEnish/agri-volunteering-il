import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const SliderContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  direction: ltr;

  @media screen and (min-width: 481px) and (max-width: 767px) {
    height: 80vh;
  }

  @media screen and (min-width: 414px) and (max-width: 480px) {
    height: 80vh;
  }

  @media screen and (min-width: 391px) and (max-width: 413px) {
    height: 70vh;
  }

  @media screen and (min-width: 375px) and (max-width: 390px) {
    height: 80vh;
  }

  @media screen and (min-width: 346px) and (max-width: 374px) {
    height: 75vh;
  }

  @media screen and (min-width: 320px) and (max-width: 345px) {
    height: 95vh;
  }
`;

const SliderImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: ${props => props.active ? 0.9 : 0};
  transition: opacity 2s ease-in-out;

  @media screen and (max-width: 767px) {
    background-position: top center;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
    }
  }
`;

const SliderContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  direction: rtl;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 8% 10% 8%;
  color: white;
  text-align: right;
  box-sizing: border-box;

  @media screen and (min-width: 481px) and (max-width: 767px) {
    padding: 0 6% 8% 6%;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
  }

  @media screen and (min-width: 414px) and (max-width: 480px) {
    padding: 0 5% 8% 5%;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
  }

  @media screen and (min-width: 320px) and (max-width: 413px) {
    padding: 0 4% 6% 4%;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
  }
`;

const images = [
  '/images/background2.jpg',
  '/images/background3.jpg',
  '/images/background4.jpg',
];

const ImageSlider = ({ children }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SliderContainer>
      {images.map((image, index) => (
        <SliderImage
          key={index}
          style={{ backgroundImage: `url(${image})` }}
          active={index === currentImage}
        />
      ))}
      <SliderContent>
        {children}
      </SliderContent>
    </SliderContainer>
  );
};

export default ImageSlider;