import React, { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_URL;

import axios from 'axios';

import Header from '../comps/header';
import Footer from '../comps/footer';
import VolunteerMap from '../comps/volunteerMap';
import VolunteerInfoSnippet1 from '../comps/volunteerInfoSnippet1';
import VolunteerInfoSnippet2 from '../comps/volunteerInfoSnippet2';
import VolunteerTitle from '../comps/volunteerTitle';

import { MapPin, Users, Heart, HandHeart } from 'lucide-react';
import { Button, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

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
  const [mapLocations, setMapLocations] = useState([]); // כל המיקומים למפה
const [listLocations, setListLocations] = useState([]); // מיקומים מסוננים לרשימה
const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});


  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3003';

    // Helper function to sort areas in the desired order
    const sortAreas = (areasArray) => {
      // בדיקה שהערך שהתקבל הוא אכן מערך
      if (!Array.isArray(areasArray)) {
        console.error('Expected array, got:', areasArray);
        return [];
      }
      
      const orderMap = {
        'צפון': 1,
        'שרון': 2,
        'מרכז': 3,
        'דרום': 4
      };
      
      return areasArray.sort((a, b) => {
        return (orderMap[a] || 999) - (orderMap[b] || 999);
      });
    };


  
  useEffect(() => {
    fetchAreas();
    fetchAllLocations();
  }, []);



  useEffect(() => {
    // בדיקה שמה שהתקבל הוא מערך ושיש בו נתונים
    if (Array.isArray(mapLocations) && mapLocations.length > 0) {
      mapLocations.forEach(loc => {
        if (loc && loc.imageUrl) {
          const img = new Image();
          img.src = `${API_BASE_URL}${loc.imageUrl}`;
          img.onerror = () => console.error(`Failed to load image for ${loc.farmName}: ${img.src}`);
        }
      });
    }
  }, [mapLocations]);
  
  // תיקון useEffect עבור listLocations
  useEffect(() => {
    // בדיקה שמה שהתקבל הוא מערך ושיש בו נתונים
    if (Array.isArray(listLocations) && listLocations.length > 0) {
      listLocations.forEach(loc => {
        if (loc && loc.imageUrl) {
          const img = new Image();
          img.src = `${API_BASE_URL}${loc.imageUrl}`;
          img.onerror = () => console.error(`Failed to load image for ${loc.farmName}: ${img.src}`);
        }
      });
    }
  }, [listLocations]);


// תיקון fetchAreas
const fetchAreas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/volunteer-locations/areas`);
    // בדיקה שהתקבל מערך
    const areas = Array.isArray(response.data) ? response.data : [];
    const sortedAreas = sortAreas(areas);
    setAreas(sortedAreas);
  } catch (error) {
    console.error('Error fetching areas:', error);
    setError('שגיאה בטעינת האזורים');
  }
};

// תיקון fetchAllLocations
const fetchAllLocations = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`${API_BASE_URL}/api/volunteer-locations/all`);
    // בדיקה שהתקבל מערך
    const locations = Array.isArray(response.data) ? response.data : [];
    setMapLocations(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    setError('שגיאה בטעינת המיקומים');
  } finally {
    setIsLoading(false);
  }
};


  const handleAreaClick = async (area) => {
    setSelectedArea(area);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/volunteer-locations/locations/${area}`);
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
            <VolunteerTitle/>
            
            <div className="opening_paragraph" dir='rtl'>
              <p>
              ברוכים הבאים ל"מתנדבים באדמה" - הגשר בין מתנדבים לחקלאים בישראל. החקלאות הישראלית ממשיכה להתמודד עם אתגרים משמעותיים, כשחקלאים רבים זקוקים לידיים עובדות ותמיכה מהקהילה.
              </p>
              <p>
                האתר שלנו מחבר בין מתנדבים לבין חקלאים הזקוקים לעזרה. בין אם אתם מתנדבים המחפשים דרך משמעותית לתרום, או חקלאים המבקשים סיוע, "מתנדבים באדמה" מספקת פלטפורמה נגישה וידידותית למשתמש.
              </p>
              <p>
                יחד, נוכל לשמור על החקלאות הישראלית פורחת ולחזק את הקשר בין העם לאדמתו.
              </p>  
            </div>
          </ImageSlider>

          <VolunteerInfoSnippet1 />

          <div className="volunteer-map-section">
      <div className="volunteer-map-container">
        <div className="content-grid">
          {/* Map Wrapper */}
          <div className="map-wrapper">
            {isLoading ? (
              <div className="loading-overlay">טוען...</div>
            ) : error ? (
              <div className="error-overlay">
                שגיאה בטעינת המיקומים: {error}
              </div>
            ) : (
              <VolunteerMap
              locations={mapLocations}
              onLocationSelected={handleLocationClick}
              />
            )}
          </div>

          {/* Content Wrapper */}
          <div className="content-wrapper">
            {/* Map Explanation */}
            <div className="map-explanation">
              <h2 className="map-headline">מפת התנדבויות</h2>
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

            {/* Feature Cards */}
            <div className="feature-cards">
              <div className = "first-card">
              <div className="feature-card">
                <div className="card-content">
                  <h3>מצאו הזדמנויות בקרבתכם</h3>
                  <p>גלו מגוון אפשרויות התנדבות באזורכם</p>
                </div>
                <div className="card-icon">
                  <MapPin size={24} />
                </div>
              </div>
              </div>

              <div className="feature-card">
                <div className="card-content">
                  <h3>הצטרפו לקהילה תומכת</h3>
                  <p>היו חלק ממשפחת המתנדבים שלנו</p>
                </div>
                <div className="card-icon">
                  <Users size={24} />
                </div>
              </div>

              <div className="feature-card">
                <div className="card-content">
                  <h3>צרו השפעה אמיתית</h3>
                  <p>כל פעולה קטנה יוצרת שינוי גדול</p>
                </div>
                <div className="card-icon">
                  <HandHeart size={24} />
                </div>
              </div>
            </div>
          </div>
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
                  sx={{ margin: '0.5rem' }}
                >
                  {area}
                </Button>
              ))}
            </div>
            {selectedArea && (
              <div className="selected-area-container">
                <h2 className='volunteering-in'>התנדבות ב{selectedArea}</h2>
                <Grid container spacing={3}>
              {listLocations.map(location => ( // שימוש במיקומים המסוננים לרשימה
                <Grid item xs={12} sm={6} md={4} key={location._id}>
                      <Card className="location-card">
                        {location.imageUrl && (
                                 <CardMedia 
                                 className='volunteering-image'
                                 component="img"
                                 style={{
                                   objectFit: 'cover',
                                   opacity: imagesLoaded[location._id] ? 1 : 0,
                                   transition: 'opacity 0.1s ease-in-out'
                                 }} 
                                 image={`${apiUrl}${location.imageUrl}`}
                                 alt={location.farmName || 'תמונת ההתנדבות'}
                                 onLoad={() => {
                                   setImagesLoaded(prev => ({
                                     ...prev,
                                     [location._id]: true
                                   }));
                                 }}
                                 loading="lazy"
                                 onError={(e) => {
                                   console.error("Error loading image:", e);
                                   setImagesLoaded(prev => ({
                                     ...prev,
                                     [location._id]: true
                                   }));
                                 }}
                               />
                        )}
                        <CardContent className="location-content">
                          <Typography className="location-description">
                            {location.description}
                          </Typography>
                          <Typography className="location-name">
                            {location.name}
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
  <div className="row">
    <div className="image-item wide">
      <img src="/images/HP4.jpg" alt="עבודה חקלאית בשדה" />
    </div>
    <div className="image-item small-wide">
      <img src="/images/3.png" alt="התנדבות בשטח" />
    </div>
  </div>
  <div className="row">
    <div className="image-item equal-wide">
      <img src="/images/HP2.avif" alt="התנדבות בשטח" />
    </div>
    <div className="image-item narrow">
      <img src="/images/HP1.jpg" alt="קהילת המתנדבים שלנו" />
    </div>
    <div className="image-item equal-wide">
      <img src="/images/HP5.jpg" alt="פעילות קהילתית" />
    </div>
  </div>
</div>


          <Footer/>
          
          <div className="footer-copyright">
  <p>
    
    Copyright ©{' '}
    <a
      className="web-link"
      href="https://mitnadvimb.il@gmail.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      מתנדבים באדמה
    </a>
    {` ${new Date().getFullYear()}`}
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
); };

export default Home;
















