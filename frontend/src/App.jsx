import { useState } from 'react';
import React from 'react';
import Counter from './comps/header.jsx';
import Home from './pages/HomePage.jsx';
import FarmerRegistration from './pages/FarmersReg.jsx';
import VolunteerRegProcess from './pages/volunteerProcessPage.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import ScrollToTop from './comps/scrollToTop.jsx';

import ScrollToTopButton from './comps/scrollTopButton.jsx';
import './comps/scrollTopButton.css';
import { VolunteerFAQ } from './pages/VolunteerFAQ.jsx';
import { FarmersFAQ } from './pages/FarmerFAQ.jsx';
import './App.css';



import { ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import theme from './theme';
import { cacheRtl } from './theme';



function App() {
  return (
    <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
    <div dir="rtl">
     <div className='App' dir='rtl'>
      <Router>
        <ScrollToTop/>
        <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path='/volunteer-page' element={<VolunteerRegProcess/>}/>
          <Route path='/farmers-join' element={<FarmerRegistration/>}/>
          <Route path="/volunteer-faq" element={<VolunteerFAQ />} />
          <Route path="/farmers-faq" element={<FarmersFAQ />} />
        </Routes>
      </Router>
    
      </div>
    </div>
    </ThemeProvider>
    </CacheProvider>
  );
}

export default App;

