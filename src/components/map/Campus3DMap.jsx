import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Compass,
  Navigation,
  Layers,
  Building,
  Target,
  Locate,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  Route,
  Zap,
  Info,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import {
  DEFAULT_CAMPUS_CENTER,
  CAMPUS_GIS_LOCATIONS,
  MEWAR_CAMPUS_ROADS,
  SHUTTLE_DATA,
  isPointInPolygon,
} from './CampusGisMap';

// Building 3D Height profiles (meters) for authentic architectural representation
const BUILDING_HEIGHTS = {
  main: 34,
  eng: 30,
  teacher: 24,
  law: 22,
  badal: 26,
  padmani: 22,
  mira: 22,
  panna: 22,
  guest_house: 18,
  sanaga: 26,
  bhamasha: 26,
  kumbha: 24,
  pratap: 24,
  gora: 22,
  hospital: 18,
  mess: 16,
  temple: 18,
  gym: 14,
  gate: 10,
  gate2: 10,
  parking: 6,
  park: 2,
  football: 2,
  basketball: 2,
  cricket: 2,
  volleyball: 2,
  agriculture: 2,
};

// Category palette tailored for photorealistic satellite basemap contrast
const CATEGORY_COLORS = {
  academic: '#10B981', // Emerald Teal
  facility: '#F59E0B', // Amber Gold
  hostel: '#3B82F6',   // Electric Azure
  sports: '#22C55E',   // Lawn Green
  gate: '#EF4444',     // Coral Crimson
};

// 100% Free, High-Resolution Basemaps (Zero API keys required)
const BASE_STYLES = {
  satellite: {
    name: 'Satellite 3D (Photorealistic)',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 18,
          attribution: 'Tiles &copy; Esri World Imagery',
        },
      },
      layers: [
        {
          id: 'satellite-tiles',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    },
  },
  streets: {
    name: 'OpenStreetMap 3D',
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'street-tiles',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    },
  },
};

// Math Helper: Snap a point to the nearest line segment on campus paths
function findNearestPointOnSegment(p, a, b) {
  const atob = { x: b.lng - a.lng, y: b.lat - a.lat };
  const atop = { x: p.lng - a.lng, y: p.lat - a.lat };
  const lenSq = atob.x * atob.x + atob.y * atob.y;
  if (lenSq === 0) return a;
  let t = (atop.x * atob.x + atop.y * atob.y) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return {
    lat: a.lat + t * atob.y,
    lng: a.lng + t * atob.x,
  };
}

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const Campus3DMap = ({
  selectedBuildingKey,
  onSelectBuilding,
  customDestination,
  onSetCustomDestination,
  onClearCustomDestination,
  userCoords,
  setUserCoords,
  isLiveGpsActive,
  setIsLiveGpsActive,
  isSimulatingWalk,
  setIsSimulatingWalk,
  simulationProgress,
  setSimulationProgress,
  onNavigationUpdate,
  onOpenDetails,
  onSwitchToBlueprint,
  isNavPanelOpen = false,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const userMarkerRef = useRef(null);
  const buildingBadgeMarkersRef = useRef([]);

  // 3D Engine State - Defaulting to Photorealistic Satellite
  const [activeStyleKey, setActiveStyleKey] = useState('satellite');
  const [pitchMode, setPitchMode] = useState('3d-walk'); // '2d' | '3d-iso' | '3d-walk' | 'drone'
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [snapToRoads, setSnapToRoads] = useState(true);
  const [followUser, setFollowUser] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [compassBearing, setCompassBearing] = useState(-20);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const orbitIntervalRef = useRef(null);

  // Spoken Voice alert helper
  const speakVoicePrompt = useCallback(
    (text) => {
      if (!voiceEnabled || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled]
  );

  // Compute GeoJSON Features for 3D Buildings
  const buildingsGeoJson = useMemo(() => {
    const features = Object.entries(CAMPUS_GIS_LOCATIONS).map(([key, bldg]) => {
      const coordinates = (bldg.polygon || []).map(([lat, lng]) => [lng, lat]);
      // Ensure polygon is closed
      if (
        coordinates.length > 0 &&
        (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
          coordinates[0][1] !== coordinates[coordinates.length - 1][1])
      ) {
        coordinates.push([...coordinates[0]]);
      }

      const isSelected = selectedBuildingKey === key;
      const baseHeight = BUILDING_HEIGHTS[key] || 16;
      const height = isSelected ? baseHeight + 10 : baseHeight;

      let color = CATEGORY_COLORS[bldg.category] || '#10B981';
      if (key.includes('gate')) color = CATEGORY_COLORS.gate;
      if (isSelected) color = '#06B6D4'; // Glowing Cyan when selected

      return {
        type: 'Feature',
        id: key,
        properties: {
          id: key,
          name: bldg.name,
          shortName: bldg.shortName,
          category: bldg.category,
          color: color,
          height: height,
          baseHeight: 0,
          isSelected: isSelected ? 1 : 0,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [selectedBuildingKey]);

  // Compute GeoJSON Features for Campus Roads
  const roadsGeoJson = useMemo(() => {
    const features = MEWAR_CAMPUS_ROADS.map((segment, idx) => {
      const coords = segment.map(([lat, lng]) => [lng, lat]);
      return {
        type: 'Feature',
        id: `road-${idx}`,
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }, []);

  // Road Snapping calculation
  const effectiveUserCoords = useMemo(() => {
    if (!userCoords || !userCoords.lat || !userCoords.lng) return null;
    if (!snapToRoads) return userCoords;

    let closestPoint = null;
    let minDistance = Infinity;

    for (const segment of MEWAR_CAMPUS_ROADS) {
      for (let i = 0; i < segment.length - 1; i++) {
        const a = { lat: segment[i][0], lng: segment[i][1] };
        const b = { lat: segment[i + 1][0], lng: segment[i + 1][1] };
        const pt = findNearestPointOnSegment(userCoords, a, b);
        const dist = calculateDistanceMeters(userCoords.lat, userCoords.lng, pt.lat, pt.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = pt;
        }
      }
    }

    if (closestPoint && minDistance <= 30) {
      return {
        ...userCoords,
        lat: closestPoint.lat,
        lng: closestPoint.lng,
        isSnapped: true,
      };
    }

    return userCoords;
  }, [userCoords, snapToRoads]);

  // Record Breadcrumbs
  useEffect(() => {
    if (effectiveUserCoords && (isLiveGpsActive || isSimulatingWalk)) {
      setBreadcrumbs((prev) => {
        const last = prev[prev.length - 1];
        if (
          !last ||
          calculateDistanceMeters(last[1], last[0], effectiveUserCoords.lat, effectiveUserCoords.lng) > 3
        ) {
          return [...prev.slice(-120), [effectiveUserCoords.lng, effectiveUserCoords.lat]];
        }
        return prev;
      });
    }
  }, [effectiveUserCoords, isLiveGpsActive, isSimulatingWalk]);

  // Update Breadcrumb Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('user-breadcrumbs');
    if (source) {
      source.setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: breadcrumbs,
        },
      });
    }
  }, [breadcrumbs]);

  // Initialize MapLibre 3D Canvas
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const [centerLat, centerLng] = DEFAULT_CAMPUS_CENTER;
    const initialCenter =
      effectiveUserCoords && effectiveUserCoords.lat && effectiveUserCoords.lng
        ? [effectiveUserCoords.lng, effectiveUserCoords.lat]
        : [centerLng, centerLat];
    const initialPitch = 60;
    const initialBearing = -20;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASE_STYLES[activeStyleKey].style,
      center: initialCenter,
      zoom: 17.2,
      pitch: initialPitch,
      bearing: initialBearing,
      maxPitch: 85,
      antialias: true,
    });

    mapRef.current = map;

    map.on('dragstart', () => {
      setFollowUser(false);
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      // Configure 3D directional sun lighting for realistic building shadows
      map.setLight({
        anchor: 'viewport',
        color: '#FFFFFF',
        intensity: 0.65,
        position: [1.5, 90, 50],
      });

      // 1. Campus Roads Glow Layer
      map.addSource('campus-roads', {
        type: 'geojson',
        data: roadsGeoJson,
      });

      map.addLayer({
        id: 'campus-roads-glow',
        type: 'line',
        source: 'campus-roads',
        paint: {
          'line-color': '#06B6D4',
          'line-width': 7,
          'line-opacity': 0.45,
          'line-blur': 2,
        },
      });

      map.addLayer({
        id: 'campus-roads-core',
        type: 'line',
        source: 'campus-roads',
        paint: {
          'line-color': '#38BDF8',
          'line-width': 3,
          'line-opacity': 0.95,
        },
      });

      // 2. Breadcrumbs Layer
      map.addSource('user-breadcrumbs', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: breadcrumbs,
          },
        },
      });

      map.addLayer({
        id: 'user-breadcrumbs-line',
        type: 'line',
        source: 'user-breadcrumbs',
        paint: {
          'line-color': '#10B981',
          'line-width': 4.5,
          'line-opacity': 0.85,
        },
      });

      // 3. 3D Building Extrusions Layer
      map.addSource('campus-buildings', {
        type: 'geojson',
        data: buildingsGeoJson,
      });

      map.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'campus-buildings',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'baseHeight'],
          'fill-extrusion-opacity': 0.88,
        },
      });

      // 3D Building Click Interactions
      map.on('click', 'buildings-3d', (e) => {
        if (!e.features || !e.features[0]) return;
        const bldgId = e.features[0].properties.id;
        if (bldgId) {
          onSelectBuilding(bldgId);
          onOpenDetails?.();
          const bldg = CAMPUS_GIS_LOCATIONS[bldgId];
          if (bldg) {
            map.flyTo({
              center: [bldg.lng, bldg.lat],
              zoom: 17.8,
              pitch: 65,
              bearing: map.getBearing() + 20,
              duration: 1200,
            });
            speakVoicePrompt(`Selected ${bldg.shortName || bldg.name}`);
          }
        }
      });

      map.on('mousemove', 'buildings-3d', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          setHoveredBuilding(e.features[0].properties);
        }
      });

      map.on('mouseleave', 'buildings-3d', () => {
        map.getCanvas().style.cursor = '';
        setHoveredBuilding(null);
      });

      // Map Click for building boundary or custom destination
      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['buildings-3d'] });
        if (features.length === 0) {
          // Check if click was inside any building boundary polygon footprint
          let clickedKey = null;
          for (const [key, bldg] of Object.entries(CAMPUS_GIS_LOCATIONS)) {
            if (bldg.polygon && isPointInPolygon([e.lngLat.lat, e.lngLat.lng], bldg.polygon)) {
              clickedKey = key;
              break;
            }
          }
          if (clickedKey) {
            onSelectBuilding(clickedKey);
            onOpenDetails?.();
            const bldg = CAMPUS_GIS_LOCATIONS[clickedKey];
            if (bldg) {
              map.flyTo({
                center: [bldg.lng, bldg.lat],
                zoom: 17.8,
                pitch: 65,
                bearing: map.getBearing() + 20,
                duration: 1200,
              });
              speakVoicePrompt(`Selected ${bldg.shortName || bldg.name}`);
            }
            return;
          }

          if (onSetCustomDestination) {
            onSetCustomDestination({ lat: e.lngLat.lat, lng: e.lngLat.lng });
            speakVoicePrompt('Custom destination marked on 3D map');
          }
        }
      });

      map.on('rotate', () => {
        setCompassBearing(Math.round(map.getBearing()));
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Sync buildings GeoJSON on updates or selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('campus-buildings');
    if (source) {
      source.setData(buildingsGeoJson);
    }
  }, [buildingsGeoJson]);

  // Create Floating 3D Building Badges & Pin Labels
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous badge markers
    buildingBadgeMarkersRef.current.forEach((m) => m.remove());
    buildingBadgeMarkersRef.current = [];

    if (!showBadges) return;

    Object.entries(CAMPUS_GIS_LOCATIONS).forEach(([key, bldg]) => {
      const isSelected = selectedBuildingKey === key;
      const el = document.createElement('div');
      el.className = 'campus-3d-badge';
      el.style.cursor = 'pointer';
      el.style.transform = 'translate(-50%, -100%)';
      el.style.transition = 'all 0.2s ease';

      el.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          background: ${isSelected ? 'rgba(6, 182, 212, 0.95)' : 'rgba(15, 23, 42, 0.88)'};
          color: ${isSelected ? '#0F172A' : '#FFFFFF'};
          border: 1.5px solid ${isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)'};
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
        ">
          <span style="font-size: 12px;">${bldg.icon || '🏛️'}</span>
          <span>${bldg.shortName}</span>
        </div>
      `;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        onSelectBuilding(key);
        onOpenDetails?.();
        map.flyTo({
          center: [bldg.lng, bldg.lat],
          zoom: 17.8,
          pitch: 65,
          duration: 1200,
        });
        speakVoicePrompt(`Selected ${bldg.shortName || bldg.name}`);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([bldg.lng, bldg.lat])
        .addTo(map);

      buildingBadgeMarkersRef.current.push(marker);
    });
  }, [showBadges, selectedBuildingKey]);

  // Style Switcher
  const handleSwitchStyle = (styleKey) => {
    setActiveStyleKey(styleKey);
    const map = mapRef.current;
    if (map) {
      map.setStyle(BASE_STYLES[styleKey].style);
    }
  };

  // Fly to selected building
  useEffect(() => {
    if (!selectedBuildingKey) return;
    const bldg = CAMPUS_GIS_LOCATIONS[selectedBuildingKey];
    const map = mapRef.current;
    if (bldg && map) {
      map.flyTo({
        center: [bldg.lng, bldg.lat],
        zoom: 17.8,
        pitch: 65,
        duration: 1200,
      });
    }
  }, [selectedBuildingKey]);

  // 3D Pitch Presets
  const setCameraPitch = (mode) => {
    setPitchMode(mode);
    const map = mapRef.current;
    if (!map) return;

    let targetPitch = 60;
    if (mode === '2d') targetPitch = 0;
    if (mode === '3d-iso') targetPitch = 45;
    if (mode === '3d-walk') targetPitch = 65;
    if (mode === 'drone') targetPitch = 75;

    map.easeTo({ pitch: targetPitch, duration: 800 });
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
        const map = mapRef.current;
        if (map) {
          map.setBearing(map.getBearing() + 0.5);
        }
      }, 50);
    }
  };

  useEffect(() => {
    return () => {
      if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    };
  }, []);

  // Update Live User Marker with 3D Heading Cone
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!effectiveUserCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      return;
    }

    const { lng, lat, heading } = effectiveUserCoords;

    if (!userMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'user-3d-marker';
      el.innerHTML = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div class="user-pulse-ring" style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(16, 185, 129, 0.25); border: 1.5px solid #10B981; animation: userRadarPulse 2s infinite ease-out;"></div>
          <div class="user-heading-cone" style="position: absolute; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 22px solid rgba(16, 185, 129, 0.7); transform-origin: 50% 100%; top: -6px; transform: rotate(${heading || 0}deg);"></div>
          <div style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: #10B981; border: 2.5px solid #FFFFFF; box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);"></div>
        </div>
      `;

      userMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      userMarkerRef.current.setLngLat([lng, lat]);
      const cone = userMarkerRef.current.getElement().querySelector('.user-heading-cone');
      if (cone) {
        cone.style.transform = `rotate(${heading || 0}deg)`;
      }
    }

    if (followUser) {
      map.easeTo({
        center: [lng, lat],
        duration: 400,
      });
    }
  }, [effectiveUserCoords, followUser]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* MAPLIBRE WEBGL CONTAINER */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

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
          gap: '6px',
          padding: '6px 10px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* 3D BADGE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 8px',
            backgroundColor: 'var(--brand-soft-bg)',
            border: '1px solid var(--brand-soft-border)',
            borderRadius: '6px',
            color: 'var(--brand-primary)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px',
          }}
        >
          <Sparkles size={13} />
          <span>SATELLITE 3D</span>
        </div>

        {/* 3D PITCH PRESETS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          {[
            { id: '2d', label: '2D Flat' },
            { id: '3d-iso', label: '45° Iso' },
            { id: '3d-walk', label: '65° Nav' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCameraPitch(mode.id)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: pitchMode === mode.id ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: pitchMode === mode.id ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: pitchMode === mode.id ? '0 2px 6px rgba(22, 133, 103, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* 360 ORBIT BUTTON */}
        <button
          onClick={toggleOrbit}
          title="360° Cinematic Orbit"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: isOrbiting ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
            backgroundColor: isOrbiting ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
            color: isOrbiting ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: isOrbiting ? '0 2px 6px rgba(22, 133, 103, 0.25)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <RotateCcw size={12} className={isOrbiting ? 'animate-spin' : ''} />
          <span>{isOrbiting ? 'Orbiting...' : '360° Orbit'}</span>
        </button>

        {/* TOGGLE 3D BADGES */}
        <button
          onClick={() => setShowBadges(!showBadges)}
          title="Toggle 3D Floating Building Pins"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: showBadges ? '1px solid var(--brand-soft-border)' : '1px solid var(--border-subtle)',
            backgroundColor: showBadges ? 'var(--brand-soft-bg)' : 'var(--bg-surface-subtle)',
            color: showBadges ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <MapPin size={12} />
          <span>{showBadges ? 'Labels: ON' : 'Labels: OFF'}</span>
        </button>

        {/* SNAP-TO-ROAD TOGGLE */}
        <button
          onClick={() => {
            const next = !snapToRoads;
            setSnapToRoads(next);
            speakVoicePrompt(next ? 'Road snapping enabled' : 'Raw GPS tracking enabled');
          }}
          title="Snap user position to authentic Mewar pathways"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: snapToRoads ? '1px solid var(--brand-soft-border)' : '1px solid var(--border-subtle)',
            backgroundColor: snapToRoads ? 'var(--brand-soft-bg)' : 'var(--bg-surface-subtle)',
            color: snapToRoads ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Route size={12} />
          <span>{snapToRoads ? 'Snap-to-Road' : 'Raw GPS'}</span>
        </button>


        {/* SATELLITE VS OSM STYLE SWITCH */}
        <select
          value={activeStyleKey}
          onChange={(e) => handleSwitchStyle(e.target.value)}
          style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#E2E8F0',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="satellite">Photorealistic Satellite 3D</option>
          <option value="streets">OpenStreetMap 3D</option>
        </select>
      </div>

      {/* HOVERED 3D BUILDING TOOLTIP */}
      {hoveredBuilding && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '16px',
            zIndex: 40,
            padding: '10px 14px',
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            color: '#F8FAFC',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            maxWidth: '300px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Building size={14} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: 800 }}>{hoveredBuilding.name}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            3D Elevation: {hoveredBuilding.height} meters • Satellite Ground Footprint
          </div>
        </div>
      )}

      {/* BOTTOM RIGHT NAVIGATION STATS HUD */}
      {effectiveUserCoords && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '16px',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 14px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>SPEED</span>
            <span style={{ fontSize: '14px', color: '#38BDF8', fontWeight: 800 }}>
              {(effectiveUserCoords.speed || 1.2).toFixed(1)} km/h
            </span>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>BEARING</span>
            <span style={{ fontSize: '14px', color: '#10B981', fontWeight: 800 }}>
              {compassBearing}°
            </span>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
          <button
            onClick={() => setFollowUser(!followUser)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: followUser ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
              color: followUser ? '#0F172A' : '#FFF',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Locate size={12} />
            <span>{followUser ? 'Lock Camera' : 'Free Camera'}</span>
          </button>
        </div>
      )}


    </div>
  );
};

export default Campus3DMap;
