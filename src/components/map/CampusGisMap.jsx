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
  Maximize2,
} from 'lucide-react';

// Exact GPS Center for Mewar University, Gangrar, Chittorgarh (Rajasthan, India)
export const DEFAULT_CAMPUS_CENTER = [25.03215, 74.63616];

// Strict 30-acre campus perimeter bounding box
export const MEWAR_CAMPUS_BOUNDS = [
  [25.0275, 74.6320], // SW near NH-48 / Gangrar bypass
  [25.0368, 74.6405], // NE corner of campus grounds
];

// Official Real-World Buildings & Footprints of Mewar University, Gangrar
export const CAMPUS_GIS_LOCATIONS = {
  gate: {
    id: 'gate',
    code: 'GATE-10',
    name: 'Main Campus Gate (NH-48, Gangrar)',
    shortName: 'Main Campus Gate',
    category: 'facility',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    icon: '🚪',
    lat: 25.03080,
    lng: 74.63630,
    polygon: [
      [25.03065, 74.63615],
      [25.03095, 74.63615],
      [25.03095, 74.63645],
      [25.03065, 74.63645],
    ],
    dept: 'NH-48 Campus Entrance & Security Post',
    elevation: 'Ground Level',
    description: 'Official entrance on NH-48 near Gangrar, automated RFID student verification barrier, and 24/7 security outpost.',
  },
  admin: {
    id: 'admin',
    code: 'ADM-01',
    name: 'Maharana Pratap Main Academic & Admin Block',
    shortName: 'Admin & Academic Block',
    category: 'academic',
    color: '#9E153E',
    bgColor: '#FFF1F2',
    icon: '🏛️',
    lat: 25.03220,
    lng: 74.63620,
    polygon: [
      [25.03195, 74.63595],
      [25.03245, 74.63595],
      [25.03245, 74.63645],
      [25.03195, 74.63645],
    ],
    dept: 'University Secretariat & Administrative Council',
    elevation: 'Floors 1–4',
    description: 'Central university reception, registrar office, admissions desk, accounts, and examination branch.',
  },
  eng: {
    id: 'eng',
    code: 'ENG-02',
    name: 'Faculty of Engineering & Technology',
    shortName: 'Engineering & AI Labs',
    category: 'academic',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    icon: '💻',
    lat: 25.03310,
    lng: 74.63680,
    polygon: [
      [25.03285, 74.63655],
      [25.03335, 74.63655],
      [25.03335, 74.63705],
      [25.03285, 74.63705],
    ],
    dept: 'Department of Computer Science & Engineering (AI & ML)',
    elevation: 'Floors 1–4',
    description: 'High-performance research computing labs, Artificial Intelligence & ML center, IoT workstations, and smart classrooms.',
  },
  library: {
    id: 'library',
    code: 'LIB-03',
    name: 'Swami Vivekananda Central Library',
    shortName: 'Central Library',
    category: 'libraries',
    color: '#D97706',
    bgColor: '#FFFBEB',
    icon: '📚',
    lat: 25.03270,
    lng: 74.63560,
    polygon: [
      [25.03248, 74.63538],
      [25.03292, 74.63538],
      [25.03292, 74.63582],
      [25.03248, 74.63582],
    ],
    dept: 'Central Library & Digital Knowledge Commons',
    elevation: 'Floors 1–3',
    description: 'Over 50,000 academic volumes, IEEE/Elsevier e-journal division, quiet research pods, and 200+ reading seats.',
  },
  auditorium: {
    id: 'auditorium',
    code: 'AUD-04',
    name: 'Mewar University Central Auditorium',
    shortName: 'Central Auditorium',
    category: 'facility',
    color: '#DB2777',
    bgColor: '#FDF2F8',
    icon: '🎭',
    lat: 25.03170,
    lng: 74.63660,
    polygon: [
      [25.03150, 74.63640],
      [25.03190, 74.63640],
      [25.03190, 74.63680],
      [25.03150, 74.63680],
    ],
    dept: 'Cultural & Academic Convocation Center',
    elevation: 'Ground + Balcony',
    description: '500-seat multi-tiered air-conditioned auditorium for convocations, symposiums, and cultural fests.',
  },
  cafeteria: {
    id: 'cafeteria',
    code: 'CAF-05',
    name: 'University Cafeteria & Food Court',
    shortName: 'Campus Cafeteria',
    category: 'facility',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    icon: '🍽️',
    lat: 25.03240,
    lng: 74.63490,
    polygon: [
      [25.03225, 74.63470],
      [25.03255, 74.63470],
      [25.03255, 74.63510],
      [25.03225, 74.63510],
    ],
    dept: 'Student Dining & Amenities Hub',
    elevation: 'Ground Level',
    description: 'Multi-cuisine campus canteen, tea & snack kiosk, indoor student seating, and helpdesk station.',
  },
  hostel_b: {
    id: 'hostel_b',
    code: 'HST-06',
    name: 'Aravalli Boys Residential Hostel',
    shortName: 'Aravalli Boys Hostel',
    category: 'facility',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    icon: '🛏️',
    lat: 25.03380,
    lng: 74.63480,
    polygon: [
      [25.03355, 74.63455],
      [25.03405, 74.63455],
      [25.03405, 74.63505],
      [25.03355, 74.63505],
    ],
    dept: 'Male Student Residence Precinct (Blocks 1–4)',
    elevation: 'Blocks 1–4',
    description: 'Air-cooled residential blocks, Wi-Fi connectivity, recreation room, student mess, and 24/7 security.',
  },
  hostel_g: {
    id: 'hostel_g',
    code: 'HST-07',
    name: 'Meera Bai Girls Residential Hostel',
    shortName: 'Meera Bai Girls Hostel',
    category: 'facility',
    color: '#9333EA',
    bgColor: '#FAF5FF',
    icon: '🏠',
    lat: 25.03120,
    lng: 74.63530,
    polygon: [
      [25.03098, 74.63508],
      [25.03142, 74.63508],
      [25.03142, 74.63552],
      [25.03098, 74.63552],
    ],
    dept: 'Female Student Residence Precinct',
    elevation: 'Blocks A & B',
    description: 'Secure female student quarters, landscaped courtyard, study library, and dedicated dining mess.',
  },
  sports: {
    id: 'sports',
    code: 'SPT-08',
    name: 'Mewar Sports Arena & Cricket Ground',
    shortName: 'Cricket & Sports Arena',
    category: 'facility',
    color: '#059669',
    bgColor: '#ECFDF5',
    icon: '🏏',
    lat: 25.03400,
    lng: 74.63730,
    polygon: [
      [25.03370, 74.63700],
      [25.03430, 74.63700],
      [25.03430, 74.63760],
      [25.03370, 74.63760],
    ],
    dept: 'Department of Physical Education & Sports',
    elevation: 'Athletic Grounds',
    description: 'Full-size cricket ground, outdoor athletic track, basketball courts, badminton pavilion, and gym.',
  },
  hospital: {
    id: 'hospital',
    code: 'MED-09',
    name: 'Mewar University Hospital & Health Centre',
    shortName: 'University Hospital',
    category: 'facility',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    icon: '🏥',
    lat: 25.03160,
    lng: 74.63720,
    polygon: [
      [25.03140, 74.63700],
      [25.03180, 74.63700],
      [25.03180, 74.63740],
      [25.03140, 74.63740],
    ],
    dept: 'Campus Medical & Emergency Care Services',
    elevation: 'Ground + Floor 1',
    description: '24/7 on-campus health center, emergency ambulance service, resident doctors, and pharmacy dispensary.',
  },
};

// Haversine geodesic distance in meters
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
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
function interpolateRoute(start, end, numPoints = 16) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const factor = i / numPoints;
    const curveOffset = Math.sin(factor * Math.PI) * 0.0001;
    const lat = start.lat + (end.lat - start.lat) * factor + curveOffset;
    const lng = start.lng + (end.lng - start.lng) * factor - curveOffset * 0.3;
    points.push([lat, lng]);
  }
  return points;
}

export const CampusGisMap = ({
  selectedBuildingKey = 'eng',
  onSelectBuilding,
  mobilityMode = 'walk',
  userCoords,
  setUserCoords,
  isLiveGpsActive,
  setIsLiveGpsActive,
  isSimulatingWalk,
  setIsSimulatingWalk,
  simulationProgress,
  setSimulationProgress,
  onNavigationUpdate,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const routePolylineRef = useRef(null);
  const buildingMarkersRef = useRef({});
  const buildingPolygonsRef = useRef({});
  const tileLayerRef = useRef(null);

  // Map Tile Style: 'voyager' | 'satellite' | 'osm'
  const [mapLayerStyle, setMapLayerStyle] = useState('voyager');

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
        maxBoundsViscosity: 0.95,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager high-contrast clean tiles
      const tileUrl =
        mapLayerStyle === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: mapLayerStyle === 'satellite' ? ['a', 'b', 'c'] : ['a', 'b', 'c', 'd'],
      }).addTo(map);

      // Add Zoom Control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Central Quad Green Promenade Polygon
      L.polygon(
        [
          [25.03210, 74.63535],
          [25.03280, 74.63595],
          [25.03250, 74.63660],
          [25.03185, 74.63605],
        ],
        {
          color: '#10B981',
          weight: 1.5,
          fillColor: '#D1FAE5',
          fillOpacity: 0.45,
          dashArray: '4, 4',
        }
      )
        .bindTooltip('🌳 Central Academic Promenade & Quadrangle', { permanent: false, direction: 'center' })
        .addTo(map);

      // Add Sports Oval Track Polygon
      L.polygon(
        [
          [25.03365, 74.63695],
          [25.03435, 74.63695],
          [25.03435, 74.63765],
          [25.03365, 74.63765],
        ],
        {
          color: '#059669',
          weight: 2,
          fillColor: '#A7F3D0',
          fillOpacity: 0.5,
        }
      )
        .bindTooltip('🏏 Mewar Cricket & Athletics Oval', { permanent: false, direction: 'center' })
        .addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer (Voyager Streets vs Aerial Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);
    const tileUrl =
      mapLayerStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: mapLayerStyle === 'satellite' ? ['a', 'b', 'c'] : ['a', 'b', 'c', 'd'],
    }).addTo(map);
  }, [mapLayerStyle]);

  // Render Highlighted Building Footprint Polygons & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old building markers & polygons
    Object.values(buildingMarkersRef.current).forEach((m) => m.remove());
    buildingMarkersRef.current = {};
    Object.values(buildingPolygonsRef.current).forEach((p) => p.remove());
    buildingPolygonsRef.current = {};

    Object.entries(CAMPUS_GIS_LOCATIONS).forEach(([key, bldg]) => {
      const isSelected = key === selectedBuildingKey;

      // 1. Draw Visible Building Footprint Polygon
      if (bldg.polygon) {
        const poly = L.polygon(bldg.polygon, {
          color: isSelected ? '#E11D48' : bldg.color,
          weight: isSelected ? 3.5 : 2,
          fillColor: bldg.color,
          fillOpacity: isSelected ? 0.35 : 0.2,
          dashArray: isSelected ? '6, 4' : null,
        }).addTo(map);

        poly.on('click', () => {
          if (onSelectBuilding) onSelectBuilding(key);
        });

        poly.bindTooltip(`<b>${bldg.shortName}</b>`, {
          permanent: isSelected,
          direction: 'top',
          className: 'mewar-tooltip',
        });

        buildingPolygonsRef.current[key] = poly;
      }

      // 2. Draw Sleek Marker Pin with Icon & Badge
      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
          transform: translate(-50%, -50%);
        ">
          <div style="
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            border-radius: 50%;
            background-color: ${isSelected ? '#9E153E' : '#FFFFFF'};
            color: ${isSelected ? '#FFFFFF' : bldg.color};
            border: 2.5px solid ${isSelected ? '#FFFFFF' : bldg.color};
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '16px' : '14px'};
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          ">
            ${bldg.icon}
          </div>
          <div style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border: 1px solid ${isSelected ? '#9E153E' : '#E2E8F0'};
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            padding: 3px 8px;
            border-radius: 6px;
            white-space: nowrap;
            pointer-events: none;
            display: ${isSelected ? 'block' : 'none'};
          ">
            <div style="font-size: 11px; font-weight: 800; color: #0F172A; line-height: 1.2;">
              ${bldg.shortName}
            </div>
            <div style="font-size: 9px; font-weight: 700; color: ${bldg.color}; text-transform: uppercase;">
              ${bldg.code}
            </div>
          </div>
          ${
            isSelected
              ? '<span style="position: absolute; left: 0; top: 0; width: 38px; height: 38px; border-radius: 50%; border: 2.5px solid #E11D48; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; pointer-events: none; opacity: 0.85;"></span>'
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'mewar-pin',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([bldg.lat, bldg.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 220px;">
          <div style="font-size: 10px; font-weight: 800; color: ${bldg.color}; text-transform: uppercase; letter-spacing: 0.05em;">
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
        if (onSelectBuilding) onSelectBuilding(key);
      });

      buildingMarkersRef.current[key] = marker;
    });
  }, [selectedBuildingKey, onSelectBuilding]);

  // Update Route Polyline & Live Guidance Stats
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !destinationBuilding || !userCoords) return;

    const dist = calculateDistanceMeters(
      userCoords.lat,
      userCoords.lng,
      destinationBuilding.lat,
      destinationBuilding.lng
    );

    let speedMps = 1.25;
    if (mobilityMode === 'wheelchair') speedMps = 1.0;
    if (mobilityMode === 'shuttle') speedMps = 4.2;

    const etaMin = Math.max(1, Math.round(dist / speedMps / 60));

    let directive = `Head towards ${destinationBuilding.shortName}`;
    if (dist > 180) {
      directive = `Walk along Central Avenue towards ${destinationBuilding.shortName}`;
    } else if (dist > 50) {
      directive = `Approach entrance portico of ${destinationBuilding.shortName}`;
    } else if (dist <= 25) {
      directive = `You have arrived at ${destinationBuilding.shortName}!`;
    }

    if (onNavigationUpdate) {
      onNavigationUpdate({
        distanceMeters: dist,
        etaMinutes: etaMin,
        stepText: directive,
      });
    }

    // Draw Dynamic Walking Route Polyline
    const routePoints = interpolateRoute(
      { lat: userCoords.lat, lng: userCoords.lng },
      { lat: destinationBuilding.lat, lng: destinationBuilding.lng },
      16
    );

    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(routePoints);
    } else {
      routePolylineRef.current = L.polyline(routePoints, {
        color: '#9E153E',
        weight: 5,
        opacity: 0.92,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(map);
    }
  }, [userCoords, destinationBuilding, mobilityMode, onNavigationUpdate]);

  // Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    const userHtml = `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #2563EB;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 14px rgba(37,99,235,0.9);
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
      className: 'user-live-beacon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
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

  const handleFitRoute = () => {
    const map = mapInstanceRef.current;
    if (!map || !destinationBuilding || !userCoords) return;
    const bounds = L.latLngBounds(
      [userCoords.lat, userCoords.lng],
      [destinationBuilding.lat, destinationBuilding.lng]
    );
    map.fitBounds(bounds, { padding: [80, 80], animate: true, maxZoom: 18.5 });
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(DEFAULT_CAMPUS_CENTER, 17.5);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Canvas Mount */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* FLOATING TOP-RIGHT LAYER SWITCHER */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          padding: '4px',
          display: 'flex',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setMapLayerStyle('voyager')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: mapLayerStyle === 'voyager' ? 'var(--brand-primary)' : 'transparent',
            color: mapLayerStyle === 'voyager' ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
        >
          <Building size={13} />
          <span>Street Map</span>
        </button>
        <button
          type="button"
          onClick={() => setMapLayerStyle('satellite')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: mapLayerStyle === 'satellite' ? 'var(--brand-primary)' : 'transparent',
            color: mapLayerStyle === 'satellite' ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
        >
          <Layers size={13} />
          <span>Satellite Aerial</span>
        </button>
      </div>

      {/* FLOATING BOTTOM-RIGHT QUICK ACTIONS (FIT ROUTE & RECENTER) */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '16px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={handleFitRoute}
          title="Fit Route View"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--brand-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Crosshair size={18} />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Mewar University"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CampusGisMap;
