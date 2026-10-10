import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Navigation,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Crosshair,
  Layers,
  Building,
  School,
  ExternalLink,
} from 'lucide-react';

// Exact GPS Coordinates for Mewar University, Gangrar, Chittorgarh (Rajasthan, India)
export const DEFAULT_CAMPUS_CENTER = [25.03215, 74.63616];

// Strict 30-acre campus perimeter bounding box (prevents drifting away from Mewar University)
export const MEWAR_CAMPUS_BOUNDS = [
  [25.0275, 74.6320], // South-West corner near NH-48 / Gangrar bypass
  [25.0368, 74.6405], // North-East corner of campus grounds
];

// Official Real-World Buildings of Mewar University, Gangrar, Chittorgarh
export const CAMPUS_GIS_LOCATIONS = {
  admin: {
    id: 'admin',
    code: 'ADM-01',
    name: 'Maharana Pratap Main Academic & Admin Block',
    category: 'academic',
    dept: 'University Secretariat & Administrative Council',
    lat: 25.03220,
    lng: 74.63620,
    elevation: 'Floors 1–4',
    description: 'Central university reception, registrar office, admissions desk, accounts, and examination branch.',
  },
  eng: {
    id: 'eng',
    code: 'ENG-02',
    name: 'Faculty of Engineering & Technology',
    category: 'academic',
    dept: 'Department of Computer Science & Engineering (AI & ML)',
    lat: 25.03310,
    lng: 74.63680,
    elevation: 'Floors 1–4',
    description: 'High-performance computing lab, Artificial Intelligence & ML center, IoT workstations, and smart halls.',
  },
  library: {
    id: 'library',
    code: 'LIB-03',
    name: 'Swami Vivekananda Central Library',
    category: 'libraries',
    dept: 'Central Library & Digital Knowledge Commons',
    lat: 25.03270,
    lng: 74.63560,
    elevation: 'Floors 1–3',
    description: 'Over 50,000 academic volumes, IEEE/Elsevier e-journal division, and air-cooled 200+ seat reading halls.',
  },
  auditorium: {
    id: 'auditorium',
    code: 'AUD-04',
    name: 'Mewar University Central Auditorium',
    category: 'facility',
    dept: 'Cultural & Academic Convocation Center',
    lat: 25.03170,
    lng: 74.63660,
    elevation: 'Ground + Balcony',
    description: '500-seat multi-tiered air-conditioned auditorium for convocations, tech symposiums, and cultural fests.',
  },
  cafeteria: {
    id: 'cafeteria',
    code: 'CAF-05',
    name: 'University Cafeteria & Food Court',
    category: 'facility',
    dept: 'Student Dining & Amenities Hub',
    lat: 25.03240,
    lng: 74.63490,
    elevation: 'Ground Level',
    description: 'Multi-cuisine campus canteen, tea & snack kiosk, indoor student seating, and helpdesk station.',
  },
  hostel_b: {
    id: 'hostel_b',
    code: 'HST-06',
    name: 'Aravalli Boys Residential Hostel',
    category: 'facility',
    dept: 'Male Student Residence Precinct (Blocks 1–4)',
    lat: 25.03380,
    lng: 74.63480,
    elevation: 'Blocks 1–4',
    description: 'Air-cooled residential blocks, Wi-Fi connectivity, recreation room, student mess, and 24/7 security.',
  },
  hostel_g: {
    id: 'hostel_g',
    code: 'HST-07',
    name: 'Meera Bai Girls Residential Hostel',
    category: 'facility',
    dept: 'Female Student Residence Precinct',
    lat: 25.03120,
    lng: 74.63530,
    elevation: 'Blocks A & B',
    description: 'Secure female student quarters, landscaped courtyard, study library, and dedicated dining mess.',
  },
  sports: {
    id: 'sports',
    code: 'SPT-08',
    name: 'Mewar Sports Arena & Cricket Ground',
    category: 'facility',
    dept: 'Department of Physical Education & Sports',
    lat: 25.03400,
    lng: 74.63730,
    elevation: 'Athletic Grounds',
    description: 'Full-size cricket ground, outdoor athletic track, basketball courts, badminton pavilion, and gym.',
  },
  hospital: {
    id: 'hospital',
    code: 'MED-09',
    name: 'Mewar University Hospital & Health Centre',
    category: 'facility',
    dept: 'Campus Medical & Emergency Care Services',
    lat: 25.03160,
    lng: 74.63720,
    elevation: 'Ground + Floor 1',
    description: '24/7 on-campus health center, emergency ambulance service, resident doctors, and pharmacy dispensary.',
  },
  gate: {
    id: 'gate',
    code: 'GATE-10',
    name: 'Main Campus Gate (NH-48, Gangrar)',
    category: 'facility',
    dept: 'National Highway 48 / 79 Campus Entrance',
    lat: 25.03080,
    lng: 74.63630,
    elevation: 'Ground Level',
    description: 'Official entrance on NH-48 near Gangrar, automated RFID student verification barrier, and security outpost.',
  },
};

// Haversine geodesic distance in meters
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Generate intermediate waypoint route path
function interpolateRoute(start, end, numPoints = 20) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const factor = i / numPoints;
    // Add realistic campus walkway curvature
    const curveOffset = Math.sin(factor * Math.PI) * 0.00012;
    const lat = start.lat + (end.lat - start.lat) * factor + curveOffset;
    const lng = start.lng + (end.lng - start.lng) * factor - curveOffset * 0.4;
    points.push([lat, lng]);
  }
  return points;
}

export const CampusGisMap = ({
  selectedBuildingKey = 'eng',
  onSelectBuilding,
  mobilityMode = 'walk',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const routePolylineRef = useRef(null);
  const buildingMarkersRef = useRef({});
  const tileLayerRef = useRef(null);

  // Map Layer Style: 'street' | 'satellite'
  const [mapLayerStyle, setMapLayerStyle] = useState('street');

  // Live Location & Movement State (Default: Main Campus Gate of Mewar University on NH-48)
  const [userCoords, setUserCoords] = useState({
    lat: 25.03080,
    lng: 74.63630,
    accuracy: 6,
    heading: 0,
    speed: 1.2,
  });

  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [navigationStats, setNavigationStats] = useState({
    distanceMeters: 0,
    etaMinutes: 0,
    stepText: '',
  });

  const watchIdRef = useRef(null);
  const simulationTimerRef = useRef(null);

  const destinationBuilding =
    CAMPUS_GIS_LOCATIONS[selectedBuildingKey] || CAMPUS_GIS_LOCATIONS.eng;

  // Initialize Leaflet Map locked to Mewar University, Gangrar, Chittorgarh
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CAMPUS_CENTER,
        zoom: 17.5,
        minZoom: 16,
        maxZoom: 19,
        maxBounds: MEWAR_CAMPUS_BOUNDS,
        maxBoundsViscosity: 0.9,
        zoomControl: false,
        attributionControl: false,
      });

      // Default to crisp OpenStreetMap tiles
      const tileUrl =
        mapLayerStyle === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add clean campus perimeter indicator
      L.polygon(
        [
          [25.0305, 74.6342],
          [25.0346, 74.6342],
          [25.0346, 74.6380],
          [25.0305, 74.6380],
        ],
        {
          color: '#9E153E',
          weight: 2,
          fillColor: '#9E153E',
          fillOpacity: 0.04,
          dashArray: '6, 6',
        }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer (Street vs Aerial Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);
    const tileUrl =
      mapLayerStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);
  }, [mapLayerStyle]);

  // Render Mewar University Building Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old building markers
    Object.values(buildingMarkersRef.current).forEach((m) => m.remove());
    buildingMarkersRef.current = {};

    Object.entries(CAMPUS_GIS_LOCATIONS).forEach(([key, bldg]) => {
      const isSelected = key === selectedBuildingKey;

      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          background-color: ${isSelected ? '#9E153E' : '#FFFFFF'};
          color: ${isSelected ? '#FFFFFF' : '#9E153E'};
          border-radius: 50%;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          border: 2px solid ${isSelected ? '#FFFFFF' : '#9E153E'};
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          <span style="font-weight: 800; font-size: ${isSelected ? '10px' : '9px'}; font-family: monospace;">
            ${bldg.code.slice(0, 3)}
          </span>
          ${
            isSelected
              ? '<span style="position: absolute; inset: -6px; border-radius: 50%; border: 2.5px solid #E11D48; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.85;"></span>'
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'mewar-building-marker',
        iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
        iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
      });

      const marker = L.marker([bldg.lat, bldg.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 200px;">
          <div style="font-size: 10px; font-weight: 800; color: #9E153E; text-transform: uppercase; letter-spacing: 0.05em;">
            Mewar University • ${bldg.code}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 3px 0;">
            ${bldg.name}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px; line-height: 1.4;">
            ${bldg.description}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 6px;">
            <span style="font-size: 10px; color: #16A34A; font-weight: 700;">● ${bldg.dept}</span>
            <span style="font-size: 10px; font-weight: 600; color: #475569;">${bldg.elevation}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectBuilding) {
          onSelectBuilding(key);
        }
      });

      buildingMarkersRef.current[key] = marker;
    });
  }, [selectedBuildingKey, onSelectBuilding]);

  // Update Route Polyline & Live Guidance Stats
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !destinationBuilding) return;

    const dist = calculateDistanceMeters(
      userCoords.lat,
      userCoords.lng,
      destinationBuilding.lat,
      destinationBuilding.lng
    );

    // Speed calculation by mobility mode
    let speedMps = 1.25; // Walk (~4.5 km/h)
    if (mobilityMode === 'wheelchair') speedMps = 1.0;
    if (mobilityMode === 'shuttle') speedMps = 4.2;

    const etaMin = Math.max(1, Math.round(dist / speedMps / 60));

    let directive = `Head towards ${destinationBuilding.name}`;
    if (dist > 200) {
      directive = `Walk along Mewar University Central Promenade towards ${destinationBuilding.name}`;
    } else if (dist > 60) {
      directive = `Approach entrance portico of ${destinationBuilding.code}`;
    } else if (dist <= 25) {
      directive = `You have arrived at ${destinationBuilding.name}!`;
    }

    setNavigationStats({
      distanceMeters: dist,
      etaMinutes: etaMin,
      stepText: directive,
    });

    // Draw Dynamic Navigation Polyline
    const routePoints = interpolateRoute(
      { lat: userCoords.lat, lng: userCoords.lng },
      { lat: destinationBuilding.lat, lng: destinationBuilding.lng },
      15
    );

    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(routePoints);
    } else {
      routePolylineRef.current = L.polyline(routePoints, {
        color: '#9E153E',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(map);
    }
  }, [userCoords, destinationBuilding, mobilityMode]);

  // Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userHtml = `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #2563EB;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 12px rgba(37,99,235,0.8);
        "></div>
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #3B82F6;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-live-marker',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
    }

    if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      userAccuracyCircleRef.current.setRadius(userCoords.accuracy || 8);
    } else {
      userAccuracyCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
        radius: userCoords.accuracy || 8,
        color: '#3B82F6',
        fillColor: '#93C5FD',
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map);
    }
  }, [userCoords]);

  // Real Hardware Browser GPS Tracking (watchPosition)
  const toggleLiveGps = () => {
    if (isLiveGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveGpsActive(false);
      setGpsError('');
    } else {
      if (!('geolocation' in navigator)) {
        setGpsError('Geolocation is not supported by your browser.');
        return;
      }

      setIsSimulatingWalk(false);
      setGpsError('');

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setIsLiveGpsActive(true);
          const { latitude, longitude, accuracy, heading, speed } = pos.coords;
          setUserCoords({
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 10,
            heading: heading || 0,
            speed: speed || 1.2,
          });

          // Smoothly pan to current location on first lock
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([latitude, longitude], { animate: true });
          }
        },
        (err) => {
          setIsLiveGpsActive(false);
          setGpsError(
            err.code === 1
              ? 'GPS Permission Denied. You can use the "Simulate Movement" test button below to navigate across Mewar University campus.'
              : 'Unable to acquire accurate GPS position.'
          );
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );
    }
  };

  // Simulated Walking Movement (interpolates step-by-step to destination across Mewar University)
  const toggleSimulation = () => {
    if (isSimulatingWalk) {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
      setIsSimulatingWalk(false);
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveGpsActive(false);
      setIsSimulatingWalk(true);

      const startLat = userCoords.lat;
      const startLng = userCoords.lng;
      const endLat = destinationBuilding.lat;
      const endLng = destinationBuilding.lng;

      let step = 0;
      const totalSteps = 30;

      simulationTimerRef.current = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        setSimulationProgress(Math.round(progress * 100));

        const nextLat = startLat + (endLat - startLat) * progress;
        const nextLng = startLng + (endLng - startLng) * progress;

        setUserCoords((prev) => ({
          ...prev,
          lat: nextLat,
          lng: nextLng,
          speed: 1.3,
        }));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([nextLat, nextLng], { animate: true, duration: 0.5 });
        }

        if (step >= totalSteps) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
          setIsSimulatingWalk(false);
        }
      }, 700);
    }
  };

  const handleResetLocation = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsSimulatingWalk(false);
    setSimulationProgress(0);
    setUserCoords({
      lat: 25.03080, // Reset to Mewar University Main Gate
      lng: 74.63630,
      accuracy: 6,
      heading: 0,
      speed: 1.2,
    });
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DEFAULT_CAMPUS_CENTER, 17.5);
    }
  };

  const handleFitRoute = () => {
    const map = mapInstanceRef.current;
    if (!map || !destinationBuilding) return;
    const bounds = L.latLngBounds(
      [userCoords.lat, userCoords.lng],
      [destinationBuilding.lat, destinationBuilding.lng]
    );
    map.fitBounds(bounds, { padding: [60, 60], animate: true });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Canvas Mount */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* CAMPUS BADGE OVERLAY: MEWAR UNIVERSITY, GANGRAR */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--brand-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '12px',
          }}
        >
          MU
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Mewar University
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Gangrar, Chittorgarh (30-Acre Campus)
          </div>
        </div>

        {/* Street vs Satellite Imagery Toggle */}
        <div style={{ marginLeft: '12px', display: 'flex', gap: '2px', backgroundColor: 'var(--bg-surface-subtle)', padding: '2px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setMapLayerStyle('street')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: mapLayerStyle === 'street' ? 'var(--brand-primary)' : 'transparent',
              color: mapLayerStyle === 'street' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Street
          </button>
          <button
            type="button"
            onClick={() => setMapLayerStyle('satellite')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: mapLayerStyle === 'satellite' ? 'var(--brand-primary)' : 'transparent',
              color: mapLayerStyle === 'satellite' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* FLOATING TOP NAVIGATION HUD */}
      <div
        style={{
          position: 'absolute',
          top: '76px',
          left: '16px',
          right: '16px',
          zIndex: 20,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            maxWidth: '680px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Turn directive */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '240px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                Campus Route • {destinationBuilding.name}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {navigationStats.stepText}
              </div>
            </div>
          </div>

          {/* Metrics: Distance, ETA, Speed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Campus Distance
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {navigationStats.distanceMeters} m
              </div>
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Walking ETA
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {navigationStats.etaMinutes} min
              </div>
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

            <button
              onClick={handleFitRoute}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-interactive)',
                color: 'var(--brand-primary)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Crosshair size={14} />
              <span>Fit Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM CONTROLS & TEST SIMULATOR */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '16px',
          right: '16px',
          zIndex: 20,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Live GPS Hardware Toggle */}
          <button
            onClick={toggleLiveGps}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: isLiveGpsActive ? '#16A34A' : 'var(--bg-surface)',
              color: isLiveGpsActive ? '#FFFFFF' : 'var(--text-primary)',
              border: '1px solid var(--border-interactive)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Compass size={16} className={isLiveGpsActive ? 'animate-spin' : ''} />
            <span>{isLiveGpsActive ? 'Tracking Live GPS' : 'Track My GPS Location'}</span>
          </button>

          {/* Test Walk Simulator Toggle */}
          <button
            onClick={toggleSimulation}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: isSimulatingWalk ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
              color: isSimulatingWalk ? '#FFFFFF' : 'var(--brand-primary)',
              border: '1px solid var(--border-interactive)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isSimulatingWalk ? <Pause size={16} /> : <Play size={16} />}
            <span>
              {isSimulatingWalk
                ? `Walking Simulation (${simulationProgress}%)`
                : 'Simulate Movement across Campus'}
            </span>
          </button>

          {/* Reset position button */}
          <button
            onClick={handleResetLocation}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Reset position to Mewar University Main Gate"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* GPS Error Alert Banner */}
      {gpsError && (
        <div
          style={{
            position: 'absolute',
            bottom: '84px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          {gpsError}
        </div>
      )}
    </div>
  );
};

export default CampusGisMap;
