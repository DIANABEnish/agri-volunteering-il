import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../comps/header';
import Footer from '../comps/footer';
import VolunteerMap from '../comps/volunteerMap';
import VolunteerInfoSnippet1 from '../comps/volunteerInfoSnippet1';
import VolunteerInfoSnippet2 from '../comps/volunteerInfoSnippet2';
import VolunteerTitle from '../comps/volunteerTitle';

import { MapPin, Users, HandHeart } from 'lucide-react';
import { Button, Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
const apiUrl = import.meta.env.VITE_API_URL || '';
import './HomePage.css';

import ImageSlider from '../comps/imageSlider';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Home = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapLocations, setMapLocations] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const sortAreas = (areasArray) => {
    const orderMap = { 'צפון': 1, 'שרון': 2, 'מרכז': 3, 'דרום': 4 };
    return areasArray.sort((a, b) => (orderMap[a] || 999) - (orderMap[b] || 999));
  };

  useEffect(() => {
    fetchAreas();
    fetchAllLocations();
  }, []);

  useEffect(() => {
    if (mapLocations.length > 0) {
      mapLocations.forEach(loc => {
        if (loc.imageUrl) {
          const img = new Image();
          img.src = `${apiUrl}${loc.imageUrl}`;
        }
      });
    }
  }, [mapLocations]);

  useEffect(() => {
    if (listLocations.length > 0) {
      listLocations.forEach(loc => {
        if (loc.imageUrl) {
          const img = new Image();
          img.src = `${apiUrl}${loc.imageUrl}`;
        }
      });
    }
  }, [listLocations]);

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/volunteer-locations/areas`);
      setAreas(sortAreas(response.data));
    } catch (error) {
      console.error('Error fetching areas:', error);
      setError('שגיאה בטעינת האזורים');
    }
  };

  const fetchAllLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/volunteer-locations/all`);
      if (response.data?.length > 0) setMapLocations(response.data);
    } catch (error) {
      setError('שגיאה בטעינת המיקומים');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaClick = async (area) => {
    setSelectedArea(area);
    try {
      const response = await axios.get(`${apiUrl}/api/volunteer-locations/locations/${area}`);
      setListLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setModalOpen(true);
  };

  return (
    <div className='home-page'>
      <div>
        <main>
          <ImageSlider>
            <Header />
            <h1 className="page_title">מתנדבים באדמה</h1>
            <VolunteerTitle />
            <div className="opening_paragraph" dir='rtl'>
              <p>
                ברוכים הבאים ל"מתנדבים באדמה" - הגשר בין מתנדבים לחקלאים בישראל. החקלאות הישראלית ממשיכה להתמודד עם אתגרים משמעותיים, כשחקלאים רבים זקוקים לידיים עובדות ותמיכה מהקהילה.
              </p>
              <p>
                האתר שלנו מחבר בין מתנדבים לבין חקלאים הזקוקים לעזרה. בין אם אתם מתנדבים המחפשים דרך משמעותית לתרום, או חקלאים המבקשים סיוע, "מתנדבים באדמה" מספקת פלטפורמה נגישה וידידותית למשתמש.
              </p>
            </div>
          </ImageSlider>

          <VolunteerInfoSnippet1 />

          <div className="volunteer-map-section">
            <div className="volunteer-map-container">
              <div className="content-grid">
                <div className="map-wrapper">
                  {isLoading ? (
                    <div className="loading-overlay">טוען...</div>
                  ) : error ? (
                    <div className="error-overlay">שגיאה בטעינת המיקומים: {error}</div>
                  ) : (
                    <VolunteerMap
                      locations={mapLocations}
                      onLocationSelected={handleLocationClick}
                    />
                  )}
                </div>

                <div className="content-wrapper">
                  <div className="map-explanation">
                    <h2 className="map-headline">מפת ההתנדבויות</h2>
                    <div className="map-text">
                      <p>
                        על מפת ארץ ישראל תוכלו למצוא נקודות ציון של אתרי התנדבות ברחבי הארץ -
                        כל סמן במפה מייצג מיקום התנדבות ייחודי.
                        לחצו על נקודת ציון במפה כדי לקבל מידע מקיף על ההתנדבות הספציפית.
                      </p>
                      <p>
                        מצאתם התנדבות שמתאימה לכם? לחצו על כפתור ההרשמה כדי להתחיל את התהליך.
                        מוזמנים לחקור את המפה ולמצוא את ההתנדבות המתאימה לכם.
                        יחד, נוכל לעשות שינוי משמעותי בקהילות שלנו.
                      </p>
                    </div>
                  </div>

                  {/* desktop-only feature cards — hidden on mobile via CSS */}
                  <div className="feature-cards feature-cards--desktop">
                    <div className="first-card">
                      <div className="feature-card">
                        <div className="card-content">
                          <h3>מצאו הזדמנויות בקרבתכם</h3>
                          <p>גלו מגוון אפשרויות התנדבות באזורכם</p>
                        </div>
                        <div className="card-icon"><MapPin size={22} /></div>
                      </div>
                    </div>
                    <div className="feature-card">
                      <div className="card-content">
                        <h3>הצטרפו לקהילה תומכת</h3>
                        <p>היו חלק ממשפחת המתנדבים שלנו</p>
                      </div>
                      <div className="card-icon"><Users size={22} /></div>
                    </div>
                    <div className="feature-card">
                      <div className="card-content">
                        <h3>צרו השפעה אמיתית</h3>
                        <p>כל פעולה קטנה יוצרת שינוי גדול</p>
                      </div>
                      <div className="card-icon"><HandHeart size={22} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* mobile-only feature cards — outside the map container so no overflow issues */}
          <div className="feature-cards-mobile-section">
            <div className="feature-cards feature-cards--mobile">
              <div className="feature-card">
                <div className="card-content">
                  <h3>מצאו הזדמנויות בקרבתכם</h3>
                  <p>גלו מגוון אפשרויות התנדבות באזורכם</p>
                </div>
                <div className="card-icon"><MapPin size={22} /></div>
              </div>
              <div className="feature-card">
                <div className="card-content">
                  <h3>הצטרפו לקהילה תומכת</h3>
                  <p>היו חלק ממשפחת המתנדבים שלנו</p>
                </div>
                <div className="card-icon"><Users size={22} /></div>
              </div>
              <div className="feature-card">
                <div className="card-content">
                  <h3>צרו השפעה אמיתית</h3>
                  <p>כל פעולה קטנה יוצרת שינוי גדול</p>
                </div>
                <div className="card-icon"><HandHeart size={22} /></div>
              </div>
            </div>
          </div>

          <div className="areas-section" dir='rtl'>
            <h2 className="areas-headline">אזורי התנדבות זמינים</h2>
            <div className="area-buttons">
              {areas.map(area => (
                <Button
                  key={area}
                  onClick={() => handleAreaClick(area)}
                  variant={selectedArea === area ? "contained" : "outlined"}
                  sx={{ margin: '0' }}
                >
                  {area}
                </Button>
              ))}
            </div>
            {selectedArea && (
              <div className="selected-area-container">
                <h2 className='volunteering-in'>התנדבות ב{selectedArea}</h2>
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  style={{ margin: '0 -25px' }}
                >
                  {listLocations.map(location => (
                    <Grid item xs={12} sm={6} md={4} key={location._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Card className="location-card">
                        <Box className="card-image-wrapper">
                          {location.imageUrl && (
                            <img
                              src={`${apiUrl}${location.imageUrl}`}
                              alt={location.farmName || 'תמונת ההתנדבות'}
                              className="volunteering-image"
                              loading="lazy"
                            />
                          )}
                        </Box>
                        <CardContent className="location-content">
                          <Typography className="location-name">
                            {location.name}
                          </Typography>
                          <Typography className="location-description">
                            {location.description}
                          </Typography>
                          <VolunteerInfoSnippet2 location={location} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </div>

          <div className="image-section">
            <div className="bento-grid">
              <div className="bento-item bento-tall">
                <img src="/images/HP4.jpg" alt="עבודה חקלאית בשדה" />
              </div>
              <div className="bento-item bento-sm-1">
                <img src="/images/3.png" alt="התנדבות בשטח" />
              </div>
              <div className="bento-item bento-sm-2">
                <img src="/images/HP1.jpg" alt="קהילת המתנדבים שלנו" />
              </div>
              <div className="bento-item bento-wide">
                <img src="/images/HP2.avif" alt="התנדבות בשטח" />
              </div>
              <div className="bento-item bento-wide">
                <img src="/images/G1.jpg" alt="התנדבות בשטח" />
              </div>
              <div className="bento-item bento-wide">
                <img src="/images/G2.jpg" alt="התנדבות בשטח" />
              </div>
              <div className="bento-item bento-wide">
                <img src="/images/G3.jpg" alt="התנדבות בשטח" />
                <div className="bento-item bento-wide">
                <img src="/images/G4.jpg" alt="התנדבות בשטח" />
              </div>
              </div>
            </div>
          </div>

          <Footer />

          <div className="footer-copyright">
            <p>
              Copyright ©{' '}
              <a
                className="web-link"
                href="https://mitnadvimbil.netlify.app//"
                target="_blank"
                rel="noopener noreferrer"
              >
                מתנדבים באדמה
              </a>
              {` 2024`}
              <img
                src="/images/אייקון חטופים.png"
                alt="סמל החטופים"
                className="hostages-icon"
              />
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;