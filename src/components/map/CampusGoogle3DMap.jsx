import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Sparkles,
  RotateCcw,
  Building,
  MapPin,
  Route,
  Volume2,
  VolumeX,
  Layers,
  Locate,
  AlertCircle,
  Compass,
  Navigation,
  Footprints,
  Target,
  Maximize2,
  Minimize2,
  Check,
  X,
  Crosshair,
} from 'lucide-react';
import {
  DEFAULT_CAMPUS_CENTER,
  CAMPUS_GIS_LOCATIONS,
  MEWAR_CAMPUS_ROADS,
  calculateDistanceMeters,
  findShortestCampusRoute,
} from './CampusGisMap';

// Ray-casting point-in-polygon algorithm to detect clicks anywhere on building footprints
function isPointInPolygon(point, vs) {
  if (!vs || !vs.length) return false;
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const GOOGLE_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD93IjAio4LzxvTVMLzdrDOpy6U399_7_8';

// Strict Campus Geofence Bounds & Default Overview Framing for Mewar University, Gangrar
// Aligned to match the exact campus axis with NH-48 along the bottom (Image 2 Framing)
const MEWAR_CAMPUS_CENTER = {
  lat: 25.0334,
  lng: 74.6362,
  altitude: 0,
};

const DEFAULT_CAMERA_VIEW = {
  center: MEWAR_CAMPUS_CENTER,
  tilt: 20,
  heading: 68,
  range: 760,
};

const MAX_ALLOWED_RANGE = 770; // Strict Zoom-Out Limit ("cannot minimize more than Image 2")
const MIN_ALLOWED_RANGE = 200; // Close-up detail limit

// Unique primary campus landmarks matching satellite annotations
const PRIMARY_CAMPUS_LANDMARKS = [
  'main',
  'eng',
  'teacher',
  'law',
  'badal',
  'padmani',
  'mira',
  'panna',
  'guest_house',
  'gora',
  'sanaga',
  'kumbha',
  'pratap',
  'bhamasha',
  'mess',
  'temple',
  'park',
  'football',
  'cricket',
  'basketball',
  'gym',
  'volleyball',
  'agriculture',
  'gate',
  'gate2',
  'parking',
];

export const CampusGoogle3DMap = ({
  selectedBuildingKey,
  onSelectBuilding,
  customDestination,
  onSetCustomDestination,
  userCoords,
  isLiveGpsActive,
  isSimulatingWalk,
  isNavPanelOpen = false,
  onOpenDetails,
  onSwitchToBlueprint,
}) => {
  const containerRef = useRef(null);
  const map3dRef = useRef(null);
  const landmarksGroupRef = useRef([]);
  const userMarkerRef = useRef(null);

  const onSelectBuildingRef = useRef(onSelectBuilding);
  onSelectBuildingRef.current = onSelectBuilding;

  const onOpenDetailsRef = useRef(onOpenDetails);
  onOpenDetailsRef.current = onOpenDetails;

  const onSetCustomDestinationRef = useRef(onSetCustomDestination);
  onSetCustomDestinationRef.current = onSetCustomDestination;

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [pitchMode, setPitchMode] = useState('20');
  const [showLabels, setShowLabels] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeRouteInfo, setActiveRouteInfo] = useState(null);
  const [isDestinationCardMinimized, setIsDestinationCardMinimized] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const orbitIntervalRef = useRef(null);

  useEffect(() => {
    setIsDestinationCardMinimized(false);
  }, [selectedBuildingKey, customDestination]);

  const speakVoicePrompt = useCallback(
    (text) => {
      if (!voiceEnabled || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled]
  );

  const speakVoicePromptRef = useRef(speakVoicePrompt);
  speakVoicePromptRef.current = speakVoicePrompt;

  // Dynamically load Google Maps 3D Platform JS API
  useEffect(() => {
    if (!GOOGLE_API_KEY) {
      setLoadError('Google Maps API Key missing in .env');
      return;
    }

    if (window.google?.maps?.maps3d) {
      setIsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-3d-script';
    let script = document.getElementById(scriptId);

    if (script && !script.src.includes('v=alpha')) {
      script.remove();
      script = null;
    }

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=alpha&libraries=maps3d,marker`;

      script.onload = async () => {
        try {
          if (window.google?.maps?.importLibrary) {
            await window.google.maps.importLibrary('maps3d');
            await window.google.maps.importLibrary('marker');
          }
          setIsLoaded(true);
        } catch (err) {
          console.error('Error importing maps3d library:', err);
          setIsLoaded(true);
        }
      };

      script.onerror = () => {
        setLoadError('Failed to load Google Maps 3D library. Please check network/key.');
      };

      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Recenter Camera to Exact Mewar University Campus Overview Bounds
  const handleRecenter = useCallback(() => {
    const map3d = map3dRef.current;
    if (map3d && 'flyCameraTo' in map3d) {
      map3d.flyCameraTo({
        endCamera: {
          center: DEFAULT_CAMERA_VIEW.center,
          tilt: DEFAULT_CAMERA_VIEW.tilt,
          heading: DEFAULT_CAMERA_VIEW.heading,
          range: DEFAULT_CAMERA_VIEW.range,
        },
        durationMillis: 1000,
      });
      speakVoicePrompt('Campus overview locked to Mewar University');
    }
  }, [speakVoicePrompt]);

  // Compute Active Walking Route to Destination
  useEffect(() => {
    const dest = customDestination || (selectedBuildingKey ? CAMPUS_GIS_LOCATIONS[selectedBuildingKey] : null);
    if (!dest || !userCoords || !userCoords.lat || !userCoords.lng) {
      setActiveRouteInfo(null);
      return;
    }

    const dist = calculateDistanceMeters(userCoords.lat, userCoords.lng, dest.lat, dest.lng);
    const eta = Math.max(1, Math.round(dist / 70)); // ~70 meters per minute walking
    const name = dest.shortName || dest.name || 'Destination Point';

    setActiveRouteInfo({
      targetName: name,
      distanceMeters: Math.round(dist),
      etaMinutes: eta,
      destCoords: { lat: dest.lat, lng: dest.lng },
    });
  }, [customDestination, selectedBuildingKey, userCoords]);

  // Active Selected Destination Object (Building or Custom Marked Point)
  const activeDestination = useMemo(() => {
    if (selectedBuildingKey && CAMPUS_GIS_LOCATIONS[selectedBuildingKey]) {
      return CAMPUS_GIS_LOCATIONS[selectedBuildingKey];
    }
    if (customDestination) {
      return {
        id: 'custom',
        code: 'TARGET',
        name: customDestination.name || 'Marked Campus Point',
        shortName: customDestination.name || 'Marked Point',
        dept: `Coordinates: (${customDestination.lat.toFixed(4)}, ${customDestination.lng.toFixed(4)})`,
        icon: '📍',
        lat: customDestination.lat,
        lng: customDestination.lng,
      };
    }
    return null;
  }, [selectedBuildingKey, customDestination]);

  const handleFitRoute = useCallback(() => {
    const map3d = map3dRef.current;
    if (!map3d || !activeDestination) return;
    if ('flyCameraTo' in map3d) {
      map3d.flyCameraTo({
        endCamera: {
          center: { lat: activeDestination.lat, lng: activeDestination.lng, altitude: 0 },
          tilt: 35,
          heading: DEFAULT_CAMERA_VIEW.heading,
          range: 480,
        },
        durationMillis: 800,
      });
      speakVoicePrompt(`Focusing route to ${activeDestination.shortName || activeDestination.name}`);
    }
  }, [activeDestination, speakVoicePrompt]);

  const handleRecenterOnBuilding = useCallback(() => {
    const map3d = map3dRef.current;
    if (!map3d || !activeDestination) return;
    if ('flyCameraTo' in map3d) {
      map3d.flyCameraTo({
        endCamera: {
          center: { lat: activeDestination.lat, lng: activeDestination.lng, altitude: 0 },
          tilt: 45,
          heading: DEFAULT_CAMERA_VIEW.heading,
          range: 360,
        },
        durationMillis: 800,
      });
    }
  }, [activeDestination]);

  // 1. Initialize and Mount Photorealistic 3D Campus Scene ONCE
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;
    if (map3dRef.current) return; // Prevent recreation and WebGL context thrashing

    try {
      // Create Google 3D Map locked to exact Mewar University Overview
      const map3d = document.createElement('gmp-map-3d');
      map3d.setAttribute('center', `${DEFAULT_CAMERA_VIEW.center.lat},${DEFAULT_CAMERA_VIEW.center.lng},0`);
      map3d.setAttribute('tilt', `${DEFAULT_CAMERA_VIEW.tilt}`);
      map3d.setAttribute('heading', `${DEFAULT_CAMERA_VIEW.heading}`);
      map3d.setAttribute('range', `${DEFAULT_CAMERA_VIEW.range}`);
      map3d.setAttribute('mode', 'satellite'); // Real aerial satellite photography
      map3d.setAttribute('default-labels-disabled', 'true'); // Remove clutter
      map3d.style.width = '100%';
      map3d.style.height = '100%';

      map3dRef.current = map3d;

      // Set native Google 3D bounds to constrain camera within Mewar University campus
      map3d.bounds = {
        north: 25.0385,
        south: 25.0270,
        east: 74.6415,
        west: 74.6320,
      };

      // Strict Camera Range Clamping & Safe Campus Reset
      const enforceCameraBounds = () => {
        if (!map3d) return;

        // Clamp Maximum Zoom-Out Range (cannot minimize further than campus overview framing)
        const currentRange = Number(map3d.range || map3d.getAttribute('range') || DEFAULT_CAMERA_VIEW.range);
        if (currentRange > MAX_ALLOWED_RANGE) {
          map3d.range = MAX_ALLOWED_RANGE;
        }

        // If user wanders far outside campus grounds, safely fly back to Mewar University overview
        const center = map3d.center;
        if (center && center.lat && center.lng) {
          const d = calculateDistanceMeters(center.lat, center.lng, MEWAR_CAMPUS_CENTER.lat, MEWAR_CAMPUS_CENTER.lng);
          if (d > 750 && 'flyCameraTo' in map3d) {
            map3d.flyCameraTo({
              endCamera: {
                center: DEFAULT_CAMERA_VIEW.center,
                tilt: DEFAULT_CAMERA_VIEW.tilt,
                heading: DEFAULT_CAMERA_VIEW.heading,
                range: DEFAULT_CAMERA_VIEW.range,
              },
              durationMillis: 600,
            });
          }
        }
      };

      map3d.addEventListener('gmp-animationend', enforceCameraBounds);
      const onWheel = () => setTimeout(enforceCameraBounds, 30);
      const onPointerUp = () => setTimeout(enforceCameraBounds, 30);

      const containerEl = containerRef.current;
      containerEl.addEventListener('wheel', onWheel);
      containerEl.addEventListener('pointerup', onPointerUp);

      // User Click on Map to Select Building OR Set Destination
      map3d.addEventListener('click', (e) => {
        if (e.position) {
          const lat = e.position.lat;
          const lng = e.position.lng;

          // Check if user clicked anywhere on a building (polygon or proximity)
          let matchedKey = null;
          let closestDist = Infinity;

          for (const [key, bldg] of Object.entries(CAMPUS_GIS_LOCATIONS)) {
            if (!bldg || !bldg.lat || !bldg.lng) continue;
            // 1. Precise polygon boundary hit-test
            if (bldg.polygon && isPointInPolygon([lat, lng], bldg.polygon)) {
              matchedKey = key;
              break;
            }
            // 2. Proximity radius hit-test (within 40m of center)
            const d = calculateDistanceMeters(lat, lng, bldg.lat, bldg.lng);
            if (d < 40 && d < closestDist) {
              closestDist = d;
              matchedKey = key;
            }
          }

          if (matchedKey) {
            const bldg = CAMPUS_GIS_LOCATIONS[matchedKey];
            if (onSelectBuildingRef.current) onSelectBuildingRef.current(matchedKey);
            if (onOpenDetailsRef.current) onOpenDetailsRef.current();
            if (onSetCustomDestinationRef.current) {
              onSetCustomDestinationRef.current({ lat: bldg.lat, lng: bldg.lng, name: bldg.shortName });
            }
            if (speakVoicePromptRef.current) speakVoicePromptRef.current(`Selected ${bldg.shortName}`);
          } else {
            // Clicked on open campus grounds
            if (onSetCustomDestinationRef.current) {
              onSetCustomDestinationRef.current({ lat, lng });
              if (speakVoicePromptRef.current) speakVoicePromptRef.current('Destination marked on campus');
            }
          }
        }
      });

      containerEl.innerHTML = '';
      containerEl.appendChild(map3d);

      return () => {
        containerEl.removeEventListener('wheel', onWheel);
        containerEl.removeEventListener('pointerup', onPointerUp);
        map3d.removeEventListener('gmp-animationend', enforceCameraBounds);
      };
    } catch (err) {
      console.error('Error rendering Google 3D Map:', err);
      setLoadError('Failed to initialize Google 3D Map element: ' + err.message);
    }
  }, [isLoaded]);

  // 2. Smoothly Focus Camera on Building or Destination without Rebuilding Canvas
  useEffect(() => {
    if (!isLoaded || !map3dRef.current) return;
    const dest = customDestination || (selectedBuildingKey ? CAMPUS_GIS_LOCATIONS[selectedBuildingKey] : null);
    if (!dest || !dest.lat || !dest.lng) return;

    const map3d = map3dRef.current;
    if (map3d && 'flyCameraTo' in map3d) {
      map3d.flyCameraTo({
        endCamera: {
          center: { lat: dest.lat, lng: dest.lng, altitude: 0 },
          tilt: 35,
          heading: DEFAULT_CAMERA_VIEW.heading,
          range: 480,
        },
        durationMillis: 800,
      });
    }
  }, [selectedBuildingKey, customDestination, isLoaded]);

  // 3. Floating 3D Building Names (Updates labels on existing 3D scene without remounting)
  useEffect(() => {
    if (!isLoaded || !map3dRef.current) return;
    const map3d = map3dRef.current;

    // Remove old landmark elements
    landmarksGroupRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        // ignore
      }
    });
    landmarksGroupRef.current = [];

    if (!showLabels) return;

    PRIMARY_CAMPUS_LANDMARKS.forEach((key) => {
      const bldg = CAMPUS_GIS_LOCATIONS[key];
      if (!bldg || !bldg.lat || !bldg.lng) return;

      const isSelected = selectedBuildingKey === key;
      const tagName = customElements.get('gmp-marker-3d-interactive')
        ? 'gmp-marker-3d-interactive'
        : 'gmp-marker-3d';
      const marker3d = document.createElement(tagName);

      const labelText = `${bldg.icon ? bldg.icon + ' ' : ''}${bldg.shortName}`;
      marker3d.setAttribute('position', `${bldg.lat},${bldg.lng},22`);
      marker3d.setAttribute('altitude-mode', 'RELATIVE_TO_GROUND');
      marker3d.setAttribute('label', labelText);
      marker3d.setAttribute('title', bldg.name);
      marker3d.setAttribute('draws-when-occluded', 'true');
      marker3d.setAttribute('extruded', 'true');
      marker3d.setAttribute('size-preserved', 'true');

      marker3d.label = labelText;
      marker3d.position = { lat: bldg.lat, lng: bldg.lng, altitude: 22 };
      marker3d.altitudeMode = 'RELATIVE_TO_GROUND';
      marker3d.drawsWhenOccluded = true;
      marker3d.extruded = true;
      marker3d.sizePreserved = true;

      // Google 3D markers require template wrapper for custom SVG icon slot (plain divs cause layout blowout)
      const template = document.createElement('template');
      template.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="${isSelected ? '#10B981' : '#0F172A'}" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="${isSelected ? '#FFFFFF' : '#38BDF8'}"/>
        </svg>
      `;
      marker3d.appendChild(template);

      const handleClick = (ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        if (onSelectBuildingRef.current) onSelectBuildingRef.current(key);
        if (onOpenDetailsRef.current) onOpenDetailsRef.current();
        if (onSetCustomDestinationRef.current) {
          onSetCustomDestinationRef.current({ lat: bldg.lat, lng: bldg.lng, name: bldg.shortName });
        }
        if (speakVoicePromptRef.current) speakVoicePromptRef.current(`Target set to ${bldg.shortName}`);
      };

      marker3d.addEventListener('gmp-click', handleClick);
      marker3d.addEventListener('click', handleClick);

      map3d.appendChild(marker3d);
      landmarksGroupRef.current.push(marker3d);
    });
  }, [isLoaded, showLabels, selectedBuildingKey]);

  // 4. Live User GPS Position Marker & Auto-Follow (Updates in-place without re-rendering map)
  useEffect(() => {
    if (!isLoaded || !map3dRef.current) return;
    const map3d = map3dRef.current;

    if (userCoords && userCoords.lat && userCoords.lng) {
      const heading = userCoords.heading || 0;
      if (!userMarkerRef.current) {
        const userMarker3d = document.createElement('gmp-marker-3d');
        userMarker3d.setAttribute('position', `${userCoords.lat},${userCoords.lng},10`);
        userMarker3d.setAttribute('altitude-mode', 'RELATIVE_TO_GROUND');
        userMarker3d.setAttribute('label', 'You (Live)');
        userMarker3d.setAttribute('draws-when-occluded', 'true');
        userMarker3d.setAttribute('size-preserved', 'true');

        const userTemplate = document.createElement('template');
        userTemplate.innerHTML = `
          <svg width="34" height="34" viewBox="0 0 34 34">
            <g transform="rotate(${heading} 17 17)">
              <polygon points="17,2 22,12 12,12" fill="#10B981" opacity="0.9"/>
            </g>
            <circle cx="17" cy="17" r="13" fill="#10B981" fill-opacity="0.3" stroke="#10B981" stroke-width="2"/>
            <circle cx="17" cy="17" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5"/>
          </svg>
        `;
        userMarker3d.appendChild(userTemplate);
        map3d.appendChild(userMarker3d);
        userMarkerRef.current = userMarker3d;
      } else {
        userMarkerRef.current.setAttribute('position', `${userCoords.lat},${userCoords.lng},10`);
        userMarkerRef.current.position = { lat: userCoords.lat, lng: userCoords.lng, altitude: 10 };
        const tmpl = userMarkerRef.current.querySelector('template');
        if (tmpl) {
          tmpl.innerHTML = `
            <svg width="34" height="34" viewBox="0 0 34 34">
              <g transform="rotate(${heading} 17 17)">
                <polygon points="17,2 22,12 12,12" fill="#10B981" opacity="0.9"/>
              </g>
              <circle cx="17" cy="17" r="13" fill="#10B981" fill-opacity="0.3" stroke="#10B981" stroke-width="2"/>
              <circle cx="17" cy="17" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5"/>
            </svg>
          `;
        }
      }

      // Smoothly track user position in Google 3D
      if (followUser && 'flyCameraTo' in map3d) {
        map3d.flyCameraTo({
          endCamera: {
            center: { lat: userCoords.lat, lng: userCoords.lng, altitude: 0 },
            tilt: 45,
            heading: heading || DEFAULT_CAMERA_VIEW.heading,
            range: 300,
          },
          durationMillis: 600,
        });
      }
    } else if (userMarkerRef.current) {
      try {
        userMarkerRef.current.remove();
      } catch (e) {
        // ignore
      }
      userMarkerRef.current = null;
    }
  }, [isLoaded, userCoords, followUser]);

  // Camera Tilt Presets
  const handleTilt = (tiltVal) => {
    setPitchMode(tiltVal);
    const map3d = map3dRef.current;
    if (map3d && 'flyCameraTo' in map3d) {
      const numTilt = Number(tiltVal);
      map3d.flyCameraTo({
        endCamera: {
          center: DEFAULT_CAMERA_VIEW.center,
          tilt: numTilt,
          heading: numTilt === 20 ? DEFAULT_CAMERA_VIEW.heading : -20,
          range: numTilt === 20 ? DEFAULT_CAMERA_VIEW.range : 680,
        },
        durationMillis: 800,
      });
    } else if (map3d) {
      map3d.setAttribute('tilt', tiltVal);
    }
  };

  // 360° Cinematic Orbit
  const toggleOrbit = () => {
    if (isOrbiting) {
      clearInterval(orbitIntervalRef.current);
      orbitIntervalRef.current = null;
      setIsOrbiting(false);
    } else {
      setIsOrbiting(true);
      orbitIntervalRef.current = setInterval(() => {
        const map3d = map3dRef.current;
        if (map3d) {
          const currentHeading = Number(map3d.getAttribute('heading') || 0);
          map3d.setAttribute('heading', (currentHeading + 1) % 360);
        }
      }, 50);
    }
  };

  useEffect(() => {
    return () => {
      if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* GOOGLE 3D MAP DOM CONTAINER */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* ERROR OVERLAY IF API KEY OR PERMISSIONS FAILED */}
      {loadError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            maxWidth: '460px',
            padding: '24px',
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}
        >
          <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Google 3D Maps Platform</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>{loadError}</p>
        </div>
      )}

      {/* TOP FLOATING 3D COMMAND BAR */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '68px' : '16px',
          left: isMobile ? '12px' : isNavPanelOpen ? '420px' : '264px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 40,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* RECENTER BUTTON */}
        <button
          onClick={handleRecenter}
          title="Recenter Camera to Mewar University Campus"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            backgroundColor: 'rgba(37, 99, 235, 0.25)',
            border: '1px solid rgba(37, 99, 235, 0.6)',
            borderRadius: '6px',
            color: '#60A5FA',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <Locate size={13} />
          <span>Lock Campus</span>
        </button>

        {/* 3D TILT PRESETS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { id: '20', label: 'Overview' },
            { id: '45', label: '45° Iso' },
            { id: '65', label: '65° 3D' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleTilt(mode.id)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: pitchMode === mode.id ? '#2563EB' : 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                transition: 'all 0.15s ease',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* 360 ORBIT */}
        <button
          onClick={toggleOrbit}
          title="360° Cinematic Orbit"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: isOrbiting ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)',
            color: '#FFF',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={12} className={isOrbiting ? 'animate-spin' : ''} />
          <span>{isOrbiting ? 'Orbiting...' : '360° Orbit'}</span>
        </button>

        {/* LABELS TOGGLE */}
        <button
          onClick={() => setShowLabels(!showLabels)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: showLabels ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            color: showLabels ? '#38BDF8' : '#94A3B8',
            cursor: 'pointer',
          }}
        >
          <MapPin size={12} />
          <span>{showLabels ? 'Building Pins: ON' : 'Building Pins: OFF'}</span>
        </button>

        {/* LIVE GPS FOLLOW / RECENTER */}
        {userCoords && (
          <button
            onClick={() => {
              const next = !followUser;
              setFollowUser(next);
              if (next && map3dRef.current && 'flyCameraTo' in map3dRef.current) {
                map3dRef.current.flyCameraTo({
                  endCamera: {
                    center: { lat: userCoords.lat, lng: userCoords.lng, altitude: 0 },
                    tilt: 45,
                    heading: userCoords.heading || DEFAULT_CAMERA_VIEW.heading,
                    range: 300,
                  },
                  durationMillis: 600,
                });
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: followUser ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              color: followUser ? '#34D399' : '#94A3B8',
              cursor: 'pointer',
            }}
          >
            <Compass size={12} />
            <span>{followUser ? 'Live Tracking: ON' : 'Follow Me'}</span>
          </button>
        )}
      </div>

      {/* FLOATING BUILDING POPUP CARD (MATCHING 2D GIS MAP STYLE) */}
      {/* FLOATING BUILDING POPUP CARD (MATCHING 2D GIS MAP STYLE) */}
      {activeDestination && (
        isDestinationCardMinimized ? (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 45,
              padding: '8px 14px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              animation: 'fadeInUp 0.2s ease',
            }}
            onClick={() => setIsDestinationCardMinimized(false)}
            title="Expand destination card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>{activeDestination.icon || '🏛️'}</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                {activeDestination.shortName || activeDestination.name}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>● Open</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleRecenterOnBuilding}
                title="Focus on Building"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <Crosshair size={13} />
              </button>
              <button
                type="button"
                onClick={() => setIsDestinationCardMinimized(false)}
                title="Expand Card"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <Maximize2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSelectBuilding) onSelectBuilding(null);
                  if (onSetCustomDestination) onSetCustomDestination(null);
                }}
                title="Close"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  cursor: 'pointer',
                }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 45,
              width: '320px',
              maxWidth: 'calc(100vw - 32px)',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.06)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'fadeInUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Top row: Icon, Name/Status, and Control Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#142D28',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '18px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <span>{activeDestination.icon || '🏛️'}</span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      border: '2px solid #FFFFFF',
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
                    {activeDestination.shortName || activeDestination.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#168567', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <span>● Open</span>
                    <span style={{ color: '#94A3B8' }}>•</span>
                    <span style={{ color: '#64748B' }}>{activeDestination.code || 'Campus Zone'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleRecenterOnBuilding}
                  title="Focus on Building"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Crosshair size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDestinationCardMinimized(true)}
                  title="Minimize Card"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectBuilding) onSelectBuilding(null);
                    if (onSetCustomDestination) onSetCustomDestination(null);
                  }}
                  title="Close Card"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Department / Subtitle */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
              <MapPin size={13} style={{ color: '#168567', flexShrink: 0, marginTop: '2px' }} />
              <span>{activeDestination.dept || 'Mewar University Campus Zone'}</span>
            </div>

            {/* Optional Distance & Walking ETA */}
            {activeRouteInfo && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 10px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                <span>Distance: <b style={{ color: '#0284C7' }}>{activeRouteInfo.distanceMeters} m</b></span>
                <span>•</span>
                <span>Walking: <b style={{ color: '#168567' }}>~{activeRouteInfo.etaMinutes} min</b></span>
              </div>
            )}

            {/* Action Row */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
              <button
                type="button"
                onClick={handleFitRoute}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  backgroundColor: '#168567',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(22, 133, 103, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Navigation size={12} />
                <span>Fit Route</span>
              </button>
              {onOpenDetails && (
                <button
                  type="button"
                  onClick={onOpenDetails}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#EAF5EF',
                    border: '1px solid rgba(22, 133, 103, 0.25)',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#168567',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>Details</span>
                </button>
              )}
            </div>
          </div>
        )
      )}

    </div>
  );
};

export default CampusGoogle3DMap;
