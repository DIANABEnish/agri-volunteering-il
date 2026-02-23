import React, { useState, useRef, useEffect, useCallback } from 'react';
// Note: useRef still used by wrapperRef below
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import VolunteerInfoSnippet2 from './volunteerInfoSnippet2';
import '../comps/VolunteerMapSection.css';
import { Icon } from 'leaflet';

// ─── MapController ────────────────────────────────────────────────────────────
// Repositions the popup wrapper via CSS transform instead of panning the map.
// Panning fights maxBoundsViscosity={1.0} and causes the bounce/snap effect.
// Moving the DOM element directly has zero interaction with map bounds.
const MapController = () => {
  const map = useMap();

  useEffect(() => {
    const handlePopupOpen = (e) => {
      const popup = e.popup;

      setTimeout(() => {
        const popupEl = popup.getElement();
        if (!popupEl) return;

        // Reset any previous nudge so we measure from the natural position
        popupEl.style.transform = '';
        popupEl.style.transition = '';

        const mapRect = map.getContainer().getBoundingClientRect();
        const popupRect = popupEl.getBoundingClientRect();
        const padding = 12;

        let nudgeX = 0;
        let nudgeY = 0;

        // Clipped above the map
        if (popupRect.top < mapRect.top + padding) {
          nudgeY = mapRect.top + padding - popupRect.top;
        }
        // Clipped below the map
        if (popupRect.bottom > mapRect.bottom - padding) {
          nudgeY = -(popupRect.bottom - mapRect.bottom + padding);
        }
        // Clipped on the right
        if (popupRect.right > mapRect.right - padding) {
          nudgeX = -(popupRect.right - mapRect.right + padding);
        }
        // Clipped on the left
        if (popupRect.left < mapRect.left + padding) {
          nudgeX = mapRect.left + padding - popupRect.left;
        }

        if (nudgeX !== 0 || nudgeY !== 0) {
          popupEl.style.transition = 'transform 0.25s ease';
          popupEl.style.transform = `translate(${nudgeX}px, ${nudgeY}px)`;
        }
      }, 80);
    };

    const handlePopupClose = (e) => {
      // Reset inline styles so the next popup starts from a clean state
      const el = e.popup?.getElement?.();
      if (el) {
        el.style.transform = '';
        el.style.transition = '';
      }
    };

    map.on('popupopen', handlePopupOpen);
    map.on('popupclose', handlePopupClose);
    return () => {
      map.off('popupopen', handlePopupOpen);
      map.off('popupclose', handlePopupClose);
    };
  }, [map]);

  return null;
};

const VolunteerMap = ({ locations, onLocationSelected }) => {
  const originalCenter = [31.8, 35.0];

  // Zoom levels — shows Israel properly without neighboring countries
  const getMinZoom = () => {
    if (window.innerWidth <= 320) return 6.8;
    if (window.innerWidth <= 375) return 6.9;
    if (window.innerWidth <= 413) return 7.0;
    if (window.innerWidth <= 480) return 6.9;
    return 7.2;
  };

  const getResponsiveZoom = () => {
    if (window.innerWidth <= 320) return 6.8;
    if (window.innerWidth <= 375) return 6.9;
    if (window.innerWidth <= 413) return 7.0;
    if (window.innerWidth <= 480) return 6.9;
    return 7.4;
  };

  const [currentZoom, setCurrentZoom] = useState(getResponsiveZoom);
  const [minZoom, setMinZoom] = useState(getMinZoom);
  const wrapperRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(480);

  // ─── Touch isolation: lock page scroll when fingers are on the map ──────────
  // This prevents the jarring page jump when pinching to zoom.
  useEffect(() => {
    const mapEl = document.querySelector('.leaflet-container');
    if (!mapEl) return;

    const lockScroll = () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    };

    const unlockScroll = () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };

    mapEl.addEventListener('touchstart', lockScroll, { passive: true });
    mapEl.addEventListener('touchend', unlockScroll, { passive: true });
    mapEl.addEventListener('touchcancel', unlockScroll, { passive: true });

    return () => {
      mapEl.removeEventListener('touchstart', lockScroll);
      mapEl.removeEventListener('touchend', unlockScroll);
      mapEl.removeEventListener('touchcancel', unlockScroll);
      unlockScroll();
    };
  }, []);

  // ─── Responsive resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      setCurrentZoom(getResponsiveZoom());
      setMinZoom(getMinZoom());
    };

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

  const israelBounds = [
    [29.5, 34.0],
    [33.5, 36.2]
  ];

  const paddedBounds = [
    [israelBounds[0][0] - 0.2, israelBounds[0][1] - 0.2],
    [israelBounds[1][0] + 0.2, israelBounds[1][1] + 0.2]
  ];

  // ─── SVG marker icon with green gradient — responsive size ──────────────────
  const isMobile = window.innerWidth <= 768;
  const iconW = isMobile ? 22 : 32;
  const iconH = isMobile ? 29 : 42;

  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="${iconW}" height="${iconH}">
    <defs>
      <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#4a6741"/>
        <stop offset="100%" stop-color="#739072"/>
      </linearGradient>
    </defs>
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 14 26 16 26s16-15.5 16-26C32 7.163 24.837 0 16 0z"
          fill="url(#pinGrad)" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="6" fill="rgba(255,255,255,0.9)"/>
  </svg>`;

  const customIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgIcon))),
    iconSize: [iconW, iconH],
    iconAnchor: [iconW / 2, iconH],
    popupAnchor: [0, -(iconH + 2)]
  });

  const handleMarkerClick = useCallback((location) => {
    onLocationSelected(location);
  }, [onLocationSelected]);

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
        scrollWheelZoom="center"
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
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          bounds={paddedBounds}
        />

        {locations.map((location) => (
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
              maxWidth={240}
              autoPan={false}
              keepInView={false}
            >
              <div
                dir="rtl"
                style={{
                  width: '100%',
                  maxHeight: '240px',
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
        ))}
      </MapContainer>
    </div>
  );
};

export default VolunteerMap;