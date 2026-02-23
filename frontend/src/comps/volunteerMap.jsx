import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import VolunteerInfoSnippet2 from './volunteerInfoSnippet2';
import '../comps/VolunteerMapSection.css';
import { Icon } from 'leaflet';

const MapController = ({ center, zoom }) => {
  const map = useMap();
  const isMovingRef = useRef(false);
  const originalCenterRef = useRef(center);

  useEffect(() => {
    const handlePopupOpen = (e) => {
      if (isMovingRef.current) return;
      originalCenterRef.current = map.getCenter();
      
      const popup = e.popup;
      const markerLatLng = popup.getLatLng();
      const mapBounds = map.getBounds();
      
      // Calculate distance from top of map as percentage
      const totalLat = mapBounds.getNorth() - mapBounds.getSouth();
      const distanceFromTop = mapBounds.getNorth() - markerLatLng.lat;
      const percentFromTop = (distanceFromTop / totalLat) * 100;
      
      // If marker is in top 30% of map, adjust popup to appear below
      if (percentFromTop < 30) {
        popup.options.offset = L.point(0, 40); // Move popup below marker
      } else {
        popup.options.offset = L.point(0, -10); // Default position above marker
      }
      
      // Check if popup would still be cut off
      const px = map.project(popup.getLatLng());
      const containerPoint = map.getSize();
      
      if (px.x + popup.options.maxWidth > containerPoint.x || px.x < 0 || 
          px.y + popup.getElement().offsetHeight > containerPoint.y || px.y < 0) {
        isMovingRef.current = true;
        map.once('moveend', () => {
          isMovingRef.current = false;
        });
      }
    };

    const handlePopupClose = () => {
      if (isMovingRef.current) return;
      
      isMovingRef.current = true;
      map.once('moveend', () => {
        isMovingRef.current = false;
      });
      
      map.setView(originalCenterRef.current, zoom, {
        animate: true,
        duration: 0.25,
        easeLinearity: 0.5
      });
    };

    map.on('popupopen', handlePopupOpen);
    map.on('popupclose', handlePopupClose);

    return () => {
      map.off('popupopen', handlePopupOpen);
      map.off('popupclose', handlePopupClose);
    };
  }, [map, zoom]);

  return null;
};

const VolunteerMap = ({ locations, onLocationSelected }) => {
  const originalCenter = [31, 35];
  
  const getMinZoom = () => {
    if (window.innerWidth <= 320) {
      return 6.3;
    } else if (window.innerWidth <= 375) {
      return 6.4;
    } else if (window.innerWidth <= 413) {
      return 6.6;
    } else if (window.innerWidth <= 480) {
      return 6.4;
    } else {
      return 7.2;
    }
  };
  
  const getResponsiveZoom = () => {
    if (window.innerWidth <= 320) {
      return 6.3;
    } else if (window.innerWidth <= 375) {
      return 6.4;
    } else if (window.innerWidth <= 413) {
      return 6.6;
    } else if (window.innerWidth <= 480) {
      return 6.4;
    } else {
      return 7;
    }
  };

  const [currentZoom, setCurrentZoom] = useState(getResponsiveZoom());
  const [minZoom, setMinZoom] = useState(getMinZoom());
  const mapRef = useRef(null);


  useEffect(() => {
    const mapElement = document.querySelector('.leaflet-container');
    if (!mapElement) return;

    let touchStartY = 0;
    let mapTouched = false;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      mapTouched = true;
    };

    const handleTouchMove = (e) => {
      if (!mapTouched) return;
      
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchCurrentY - touchStartY;
      
      // If scrolling up at the bottom or down at the top of the map
      if ((deltaY > 0 && mapElement.scrollTop === 0) ||
          (deltaY < 0 && mapElement.scrollHeight - mapElement.scrollTop === mapElement.clientHeight)) {
        e.preventDefault();
        window.scrollBy(0, -deltaY);
      }
    };

    const handleTouchEnd = () => {
      mapTouched = false;
    };

    mapElement.addEventListener('touchstart', handleTouchStart);
    mapElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    mapElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      mapElement.removeEventListener('touchstart', handleTouchStart);
      mapElement.removeEventListener('touchmove', handleTouchMove);
      mapElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const israelBounds = [
    [30.3, 34.0],
    [33.5, 36.0]
  ];

  const customIcon = new Icon({
    iconUrl: '/images/location.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });

  const paddedBounds = [
    [israelBounds[0][0] - 0.1, israelBounds[0][1] - 0.1],
    [israelBounds[1][0] + 0.1, israelBounds[1][1] + 0.1]
  ];

  const handleMarkerClick = useCallback((location) => {
    onLocationSelected(location);
  }, [onLocationSelected]);

  const wrapperRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(480);

  useEffect(() => {
    const handleResize = () => {
      setCurrentZoom(getResponsiveZoom());
      setMinZoom(getMinZoom());
      if (wrapperRef.current) {
        setMapHeight(wrapperRef.current.offsetHeight);
      }
    };

    // Use ResizeObserver to track wrapper height changes
    const observer = new ResizeObserver(() => {
      if (wrapperRef.current) {
        const h = wrapperRef.current.offsetHeight;
        if (h > 0) setMapHeight(h);
      }
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
      setMapHeight(wrapperRef.current.offsetHeight || 480);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const mapStyle = {
    height: mapHeight > 0 ? `${mapHeight}px` : '480px',
    width: '100%',
    direction: 'rtl',
  };

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', flex: 1 }}>
      <MapContainer
        center={originalCenter}
        zoom={currentZoom}
        style={mapStyle}
        maxBounds={paddedBounds}
        minZoom={minZoom}
        maxZoom={13}
        zoomAnimation={true}
        smoothWheelZoom={true}
        scrollWheelZoom= "center" // מבטל זום בגלגלת העכבר
        boundsOptions={{ 
          padding: [50, 50],
          maxZoom: 13,
          animate: true,
          duration: 0.3
        }}
        maxBoundsViscosity={1.0}
      >
        <MapController center={originalCenter} zoom={currentZoom} />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          language="he"
          bounds={paddedBounds}
        />

        {locations.map((location) => {
          const isNorthern = location.lat > 10; // Adjust this threshold as needed
          
          return (
            <Marker
              key={location._id}
              position={[location.lat, location.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup
                className="custom-popup"
                maxWidth={200}
                autoPan={true}
                autoPanPadding={[20, 20]}
                keepInView={true}
              >
                <div
                  dir="rtl"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    textAlign: 'center',
                    padding: '8px',
                    paddingTop: '1px'
                  }}
                  role="dialog"
                  aria-modal="true"
                >
                  <VolunteerInfoSnippet2 location={location} isFromMap={true} />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default VolunteerMap;