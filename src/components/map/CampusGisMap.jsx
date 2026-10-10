import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Target,
  Locate,
  Info,
} from 'lucide-react';

// Exact Centroid of Mewar University, Gangrar, Chittorgarh (Rajasthan, India)
export const DEFAULT_CAMPUS_CENTER = [25.03215, 74.63616];

// Strict Campus Bounds
export const MEWAR_CAMPUS_BOUNDS = [
  [25.0270, 74.6320], // SW near NH-48 / Gangrar bypass
  [25.0375, 74.6410], // NE corner of campus grounds
];

// Official Campus Perimeter Boundary Polygon (OSM Way 549126310)
export const MEWAR_PERIMETER_POLYGON = [
  [25.029613, 74.636170],
  [25.029463, 74.638219],
  [25.033063, 74.636971],
  [25.033155, 74.636513],
  [25.034842, 74.636185],
  [25.034717, 74.634102],
  [25.033614, 74.634549],
  [25.033475, 74.634605],
  [25.033382, 74.634643],
  [25.029613, 74.636170],
];

// Authentic Mewar University Internal Walkways (OSM Service Roads & Footways)
export const MEWAR_CAMPUS_ROADS = [
  // Engineering Block Road (NH-48 Gate to Engineering & Tech)
  [
    [25.031907, 74.635428],
    [25.032315, 74.635262],
    [25.033008, 74.634981],
    [25.033523, 74.634772],
    [25.033644, 74.635116],
    [25.033829, 74.635641],
    [25.033868, 74.635752],
    [25.032217, 74.636426],
  ],
  // Central Avenue to Admin Block & Central Promenade
  [
    [25.030927, 74.635826],
    [25.031907, 74.635428],
    [25.032173, 74.636267],
    [25.032217, 74.636426],
    [25.032377, 74.636999],
  ],
  // Canteen Road
  [
    [25.034047, 74.634957],
    [25.034624, 74.634730],
  ],
  // Sanga Boys Hostel Way
  [
    [25.033901, 74.635844],
    [25.034069, 74.635781],
    [25.034474, 74.635414],
    [25.034582, 74.635760],
  ],
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
    lat: 25.031907,
    lng: 74.635428,
    polygon: [
      [25.03182, 74.63535],
      [25.03200, 74.63535],
      [25.03200, 74.63552],
      [25.03182, 74.63552],
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
    lat: 25.031866,
    lng: 74.637113,
    polygon: [
      [25.032024, 74.636908],
      [25.032108, 74.637178],
      [25.032022, 74.637210],
      [25.032002, 74.637145],
      [25.031927, 74.637173],
      [25.031948, 74.637243],
      [25.031854, 74.637278],
      [25.031836, 74.637219],
      [25.031764, 74.637246],
      [25.031782, 74.637305],
      [25.031695, 74.637338],
      [25.031611, 74.637065],
      [25.031694, 74.637034],
      [25.031713, 74.637095],
      [25.031790, 74.637066],
      [25.031772, 74.637007],
      [25.031858, 74.636975],
      [25.031876, 74.637034],
      [25.031956, 74.637003],
      [25.031937, 74.636941],
      [25.032024, 74.636908],
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
    lat: 25.032130,
    lng: 74.636623,
    polygon: [
      [25.032150, 74.636408],
      [25.032255, 74.636748],
      [25.032229, 74.636758],
      [25.032220, 74.636730],
      [25.032003, 74.636811],
      [25.031907, 74.636499],
      [25.032150, 74.636408],
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
    lat: 25.033592,
    lng: 74.636105,
    polygon: [
      [25.033593, 74.635914],
      [25.033724, 74.636342],
      [25.033591, 74.636392],
      [25.033459, 74.635963],
      [25.033593, 74.635914],
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
    lat: 25.030470,
    lng: 74.636497,
    polygon: [
      [25.031077, 74.636607],
      [25.030846, 74.635816],
      [25.029709, 74.636282],
      [25.029641, 74.637173],
      [25.031077, 74.636607],
    ],
    dept: 'Cultural & Academic Convocation Center',
    elevation: 'Plenary Hall (500 Seats)',
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
    lat: 25.034447,
    lng: 74.635065,
    polygon: [
      [25.034194, 74.635087],
      [25.034242, 74.635255],
      [25.034335, 74.635223],
      [25.034390, 74.635246],
      [25.034426, 74.635347],
      [25.034551, 74.635292],
      [25.034517, 74.635197],
      [25.034557, 74.635119],
      [25.034572, 74.635137],
      [25.034678, 74.635103],
      [25.034633, 74.634926],
      [25.034513, 74.634964],
      [25.034513, 74.634988],
      [25.034423, 74.634942],
      [25.034451, 74.634931],
      [25.034502, 74.634944],
      [25.034653, 74.634885],
      [25.034623, 74.634791],
      [25.034292, 74.634920],
      [25.034314, 74.634989],
      [25.034256, 74.635065],
      [25.034194, 74.635087],
    ],
    dept: 'Student Dining & Amenities Hub',
    elevation: 'Ground Level',
    description: 'Multi-cuisine campus canteen, tea & snack kiosk, indoor student seating, and helpdesk station.',
  },
  hostel_b: {
    id: 'hostel_b',
    code: 'HST-06',
    name: 'Rana Sanga Boys Residential Hostel',
    shortName: 'Sanga Boys Hostel',
    category: 'facility',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    icon: '🛏️',
    lat: 25.034645,
    lng: 74.635783,
    polygon: [
      [25.034641, 74.635385],
      [25.034509, 74.635440],
      [25.034634, 74.635811],
      [25.034352, 74.635927],
      [25.034397, 74.636061],
      [25.034707, 74.635933],
      [25.034720, 74.635973],
      [25.034787, 74.635946],
      [25.034756, 74.635854],
      [25.034738, 74.635861],
      [25.034723, 74.635816],
      [25.034779, 74.635793],
      [25.034641, 74.635385],
    ],
    dept: 'Male Student Residence Precinct (Blocks 1–4)',
    elevation: 'Blocks 1–4',
    description: 'Air-cooled residential blocks, Wi-Fi connectivity, recreation room, student mess, and 24/7 security outpost.',
  },
  kumbha: {
    id: 'kumbha',
    code: 'HST-07',
    name: 'Maharana Kumbha Boys Hostel',
    shortName: 'Kumbha Boys Hostel',
    category: 'facility',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    icon: '🏢',
    lat: 25.033814,
    lng: 74.636040,
    polygon: [
      [25.033815, 74.635849],
      [25.033946, 74.636277],
      [25.033813, 74.636327],
      [25.033682, 74.635898],
      [25.033815, 74.635849],
    ],
    dept: 'Senior Student Residence Wing',
    elevation: '3 Floors',
    description: 'Senior scholar dormitory units with high-speed campus LAN, study halls, and laundry amenities.',
  },
  hostel_g: {
    id: 'hostel_g',
    code: 'HST-08',
    name: 'Meera Bai Girls Residential Hostel',
    shortName: 'Meera Bai Girls Hostel',
    category: 'facility',
    color: '#9333EA',
    bgColor: '#FAF5FF',
    icon: '🏠',
    lat: 25.034085,
    lng: 74.634523,
    polygon: [
      [25.034158, 74.634385],
      [25.034188, 74.634480],
      [25.034049, 74.634534],
      [25.034096, 74.634685],
      [25.034011, 74.634717],
      [25.033933, 74.634472],
      [25.034158, 74.634385],
    ],
    dept: 'Female Student Residence Precinct',
    elevation: 'Blocks A & B',
    description: 'Secure female student quarters, landscaped courtyard, study library, and dedicated dining mess.',
  },
  sports: {
    id: 'sports',
    code: 'SPT-10',
    name: 'Mewar Sports Arena & Cricket Ground',
    shortName: 'Cricket & Sports Arena',
    category: 'facility',
    color: '#059669',
    bgColor: '#ECFDF5',
    icon: '🏏',
    lat: 25.030684,
    lng: 74.637033,
    polygon: [
      [25.030497, 74.637032],
      [25.030542, 74.637186],
      [25.030966, 74.637034],
      [25.030920, 74.636880],
      [25.030497, 74.637032],
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
    lat: 25.031342,
    lng: 74.637242,
    polygon: [
      [25.031203, 74.637207],
      [25.031265, 74.637405],
      [25.031551, 74.637295],
      [25.031489, 74.637097],
      [25.031203, 74.637207],
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
function interpolateRoute(start, end, numPoints = 18) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const factor = i / numPoints;
    // Gentle curve along academic walkways
    const curveOffset = Math.sin(factor * Math.PI) * 0.00008;
    const lat = start.lat + (end.lat - start.lat) * factor + curveOffset;
    const lng = start.lng + (end.lng - start.lng) * factor - curveOffset * 0.2;
    points.push([lat, lng]);
  }
  return points;
}

export const CampusGisMap = ({
  selectedBuildingKey = 'eng',
  onSelectBuilding,
  customDestination,
  onSetCustomDestination,
  onClearCustomDestination,
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
  const customDestMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const buildingMarkersRef = useRef({});
  const buildingPolygonsRef = useRef({});
  const tileLayerRef = useRef(null);
  const perimeterLayerRef = useRef(null);
  const roadsLayerRef = useRef([]);

  // Map Tile Style: 'satellite' | 'streets'
  // Esri provides 100% clean, high-resolution GIS tiles with ZERO watermarks
  const [mapLayerStyle, setMapLayerStyle] = useState('satellite');

  // Active target destination (either custom clicked point or selected building)
  const activeDestination = customDestination
    ? {
        name: customDestination.name || 'Marked Destination',
        shortName: customDestination.shortName || 'Marked Point',
        lat: customDestination.lat,
        lng: customDestination.lng,
        isCustom: true,
      }
    : CAMPUS_GIS_LOCATIONS[selectedBuildingKey] || CAMPUS_GIS_LOCATIONS.eng;

  // Initialize Leaflet Map locked to Mewar University, Gangrar, Chittorgarh
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CAMPUS_CENTER,
        zoom: 17.5,
        minZoom: 15.5,
        maxZoom: 19,
        maxBounds: MEWAR_CAMPUS_BOUNDS,
        maxBoundsViscosity: 0.9,
        zoomControl: false,
        attributionControl: false,
      });

      // Esri World Imagery (Satellite) or Esri World Street Map (Clean GIS Streets)
      const tileUrl =
        mapLayerStyle === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

      tileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom Control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Draw Campus Perimeter Boundary
      perimeterLayerRef.current = L.polygon(MEWAR_PERIMETER_POLYGON, {
        color: '#F59E0B',
        weight: 2,
        fillColor: '#F59E0B',
        fillOpacity: 0.04,
        dashArray: '6, 6',
      })
        .bindTooltip('🏫 Mewar University 30-Acre Campus Perimeter', { permanent: false, direction: 'center' })
        .addTo(map);

      // Draw Walkway & Internal Road Network
      roadsLayerRef.current = MEWAR_CAMPUS_ROADS.map((roadCoords) =>
        L.polyline(roadCoords, {
          color: '#38BDF8',
          weight: 3,
          opacity: 0.65,
          dashArray: '4, 4',
        }).addTo(map)
      );

      // Click on Map to Mark Destination Anywhere!
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (onSetCustomDestination) {
          onSetCustomDestination({
            lat,
            lng,
            name: `Marked Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            shortName: 'Marked Destination',
          });
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer (Satellite Aerial vs Esri Street Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);
    const tileUrl =
      mapLayerStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
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
      const isSelected = !customDestination && key === selectedBuildingKey;

      // 1. Draw Visible Building Footprint Polygon
      if (bldg.polygon) {
        const poly = L.polygon(bldg.polygon, {
          color: isSelected ? '#E11D48' : bldg.color,
          weight: isSelected ? 3.5 : 2,
          fillColor: bldg.color,
          fillOpacity: isSelected ? 0.45 : 0.28,
          dashArray: isSelected ? '6, 4' : null,
        }).addTo(map);

        poly.on('click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          if (onClearCustomDestination) onClearCustomDestination();
          if (onSelectBuilding) onSelectBuilding(key);
        });

        poly.bindTooltip(`<b>${bldg.shortName}</b>`, {
          permanent: isSelected,
          direction: 'top',
          className: 'mewar-tooltip',
        });

        buildingPolygonsRef.current[key] = poly;
      }

      // 2. Draw Marker Pin with Icon & Badge
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
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '18px' : '15px'};
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            ${bldg.icon}
          </div>
          ${
            isSelected
              ? `
            <div style="
              background: #9E153E;
              color: #FFFFFF;
              font-size: 11px;
              font-weight: 800;
              padding: 4px 9px;
              border-radius: 9999px;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(158,21,62,0.35);
              border: 1px solid rgba(255,255,255,0.4);
            ">
              ${bldg.shortName}
            </div>
          `
              : ''
          }
        </div>
      `;

      const markerIcon = L.divIcon({
        html: markerHtml,
        className: 'mewar-gis-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([bldg.lat, bldg.lng], { icon: markerIcon }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 10px; font-family: Inter, sans-serif; min-width: 220px;">
          <div style="font-weight: 800; font-size: 14px; color: #0F172A; margin-bottom: 2px;">
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

      marker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        if (onClearCustomDestination) onClearCustomDestination();
        if (onSelectBuilding) onSelectBuilding(key);
      });

      buildingMarkersRef.current[key] = marker;
    });
  }, [selectedBuildingKey, customDestination, onSelectBuilding, onClearCustomDestination]);

  // Render Custom Marked Destination Pin (if user clicked on the map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (customDestination) {
      const pinHtml = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: translate(-50%, -100%);
        ">
          <div style="
            background: #E11D48;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 9999px;
            box-shadow: 0 4px 16px rgba(225,29,72,0.45);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            border: 1.5px solid #FFFFFF;
            animation: bounce 1.4s infinite;
          ">
            <span>📍 Marked Destination</span>
          </div>
          <div style="
            width: 14px;
            height: 14px;
            background: #E11D48;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            margin-top: 4px;
            box-shadow: 0 0 10px rgba(225,29,72,0.8);
          "></div>
        </div>
      `;

      const pinIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-dest-pin',
        iconSize: [120, 48],
        iconAnchor: [60, 48],
      });

      if (customDestMarkerRef.current) {
        customDestMarkerRef.current.setLatLng([customDestination.lat, customDestination.lng]);
      } else {
        customDestMarkerRef.current = L.marker([customDestination.lat, customDestination.lng], { icon: pinIcon }).addTo(map);
      }
    } else {
      if (customDestMarkerRef.current) {
        customDestMarkerRef.current.remove();
        customDestMarkerRef.current = null;
      }
    }
  }, [customDestination]);

  // Update Route Polyline & Live Guidance Stats
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeDestination || !userCoords) return;

    const dist = calculateDistanceMeters(
      userCoords.lat,
      userCoords.lng,
      activeDestination.lat,
      activeDestination.lng
    );

    let speedMps = 1.25;
    if (mobilityMode === 'wheelchair') speedMps = 1.0;
    if (mobilityMode === 'shuttle') speedMps = 4.2;

    const etaMin = Math.max(1, Math.round(dist / speedMps / 60));

    let directive = `Head towards ${activeDestination.shortName}`;
    if (dist > 180) {
      directive = `Walk along campus promenade towards ${activeDestination.shortName}`;
    } else if (dist > 50) {
      directive = `Approaching destination: ${activeDestination.shortName}`;
    } else if (dist <= 25) {
      directive = `You have arrived at ${activeDestination.shortName}!`;
    }

    if (onNavigationUpdate) {
      onNavigationUpdate({
        distanceMeters: dist,
        etaMinutes: etaMin,
        stepText: directive,
        destinationName: activeDestination.shortName,
      });
    }

    // Draw Dynamic Walking Route Polyline
    const routePoints = interpolateRoute(
      { lat: userCoords.lat, lng: userCoords.lng },
      { lat: activeDestination.lat, lng: activeDestination.lng },
      18
    );

    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(routePoints);
    } else {
      routePolylineRef.current = L.polyline(routePoints, {
        color: customDestination ? '#E11D48' : '#9E153E',
        weight: 5,
        opacity: 0.94,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(map);
    }
  }, [userCoords, activeDestination, customDestination, mobilityMode, onNavigationUpdate]);

  // Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    const userHtml = `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #2563EB;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 16px rgba(37,99,235,1);
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
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
      userMarkerRef.current.bindTooltip('<b>You Are Here</b>', { permanent: false, direction: 'top' });
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
    if (!map || !activeDestination || !userCoords) return;
    const bounds = L.latLngBounds(
      [userCoords.lat, userCoords.lng],
      [activeDestination.lat, activeDestination.lng]
    );
    map.fitBounds(bounds, { padding: [80, 80], animate: true, maxZoom: 18.5 });
  };

  const handleCenterOnUser = () => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;
    map.flyTo([userCoords.lat, userCoords.lng], 18, { animate: true, duration: 1 });
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(DEFAULT_CAMPUS_CENTER, 17.5, { animate: true, duration: 1 });
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
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
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
        <button
          type="button"
          onClick={() => setMapLayerStyle('streets')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: mapLayerStyle === 'streets' ? 'var(--brand-primary)' : 'transparent',
            color: mapLayerStyle === 'streets' ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
        >
          <Building size={13} />
          <span>Street Map</span>
        </button>
      </div>

      {/* FLOATING INSTRUCTION HELPER BANNER */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '400px',
          zIndex: 25,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          padding: '6px 14px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          pointerEvents: 'none',
        }}
      >
        <Target size={14} style={{ color: '#E11D48' }} />
        <span>Click anywhere on the map to mark a custom destination point</span>
      </div>

      {/* FLOATING BOTTOM-RIGHT QUICK ACTIONS (LOCATE, FIT ROUTE & RECENTER) */}
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
        {userCoords && (
          <button
            type="button"
            onClick={handleCenterOnUser}
            title="Center on My Location"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: isLiveGpsActive ? '#2563EB' : '#FFFFFF',
              color: isLiveGpsActive ? '#FFFFFF' : '#2563EB',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Locate size={18} />
          </button>
        )}
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
