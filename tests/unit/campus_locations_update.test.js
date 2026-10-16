import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('Campus Locations & Road Routing: All 26 real Mewar University locations and Dijkstra blue path router exist in CampusGisMap and CampusMap', () => {
  const gisMapPath = path.join(projectRoot, 'src/components/map/CampusGisMap.jsx');
  const gisContent = fs.readFileSync(gisMapPath, 'utf8');

  const campusMapPath = path.join(projectRoot, 'src/pages/CampusMap.jsx');
  const mapContent = fs.readFileSync(campusMapPath, 'utf8');

  const expectedLocations = [
    'gate:',        // Gate 1 (NH-48)
    'gate2:',       // Gate 2 (West Entry)
    'main:',        // Main Building
    'eng:',         // Engineering Building
    'teacher:',     // Teacher Building
    'badal:',       // Badal Hostel
    'mess:',        // Campus Mess
    'law:',         // Law Building
    'football:',    // Football Ground
    'basketball:',  // Basketball Ground
    'kumbha:',      // Kumbha Hostel
    'pratap:',      // Pratap Hostel
    'park:',        // Campus Park
    'guest_house:', // Guest House
    'mira:',        // Mira Hostel
    'panna:',       // Panna Hostel
    'hospital:',    // Campus Hospital
    'gora:',        // Gora Hostel
    'sanaga:',      // Sanaga Hostel
    'bhamasha:',    // Bhamasha Hostel
    // 6 New Landmarks from User Satellite Markup
    'temple:',      // Temple (Yellow boundary)
    'parking:',     // Parking (Orange boundary)
    'cricket:',     // Cricket Ground (Red boundary)
    'gym:',         // Fitness Gymnasium
    'volleyball:',  // Volleyball Ground (Purple boundary)
    'agriculture:', // Agriculture Research Field (Green boundary)
  ];

  for (const id of expectedLocations) {
    assert.ok(gisContent.includes(id), `CampusGisMap.jsx must contain location "${id}"`);
    assert.ok(mapContent.includes(id), `CampusMap.jsx must contain location "${id}"`);
  }

  // Verify landmark names
  assert.ok(gisContent.includes('Main Academic & Administrative Building'), 'Main Building must be present in CampusGisMap');
  assert.ok(gisContent.includes('Mewar Campus Temple & Meditation Shrine'), 'Temple must be present in CampusGisMap');
  assert.ok(gisContent.includes('Main Campus Vehicle & Visitor Parking Zone'), 'Parking must be present in CampusGisMap');
  assert.ok(gisContent.includes('University Cricket Ground & Pavilion'), 'Cricket Ground must be present in CampusGisMap');
  assert.ok(gisContent.includes('University Fitness Centre & Gymnasium'), 'Gymnasium must be present in CampusGisMap');
  assert.ok(gisContent.includes('University Volleyball Arena & Courts'), 'Volleyball Ground must be present in CampusGisMap');
  assert.ok(gisContent.includes('Faculty of Agriculture Research & Experimental Field'), 'Agriculture Field must be present in CampusGisMap');

  // Verify backward compatibility aliases
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.admin = CAMPUS_GIS_LOCATIONS.main;'), 'admin alias must resolve to main');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.cafeteria = CAMPUS_GIS_LOCATIONS.mess;'), 'cafeteria alias must resolve to mess');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.hostel_b = CAMPUS_GIS_LOCATIONS.sanaga;'), 'hostel_b alias must resolve to sanaga');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.hostel_g = CAMPUS_GIS_LOCATIONS.mira;'), 'hostel_g alias must resolve to mira');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.sports = CAMPUS_GIS_LOCATIONS.basketball;'), 'sports alias must resolve to basketball');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.mandir = CAMPUS_GIS_LOCATIONS.temple;'), 'mandir alias must resolve to temple');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.farm = CAMPUS_GIS_LOCATIONS.agriculture;'), 'farm alias must resolve to agriculture');

  // Verify authentic ground-truth coordinates
  assert.ok(gisContent.includes('25.032009'), 'Gate 1 must be at the NH-48 entrance portal (25.032009)');
  assert.ok(gisContent.includes('25.033475'), 'Gate 2 must be at perimeter boundary portal (25.033475)');
  assert.ok(gisContent.includes('25.032755'), 'Main Building center must be 25.032755');
  assert.ok(gisContent.includes('25.033669'), 'Temple center must be 25.033669');
  assert.ok(gisContent.includes('25.031181'), 'Parking center must be 25.031181');
  assert.ok(gisContent.includes('25.030293'), 'Cricket Ground center must be 25.030293');
  assert.ok(gisContent.includes('25.030837'), 'Gymnasium center must be 25.030837');
  assert.ok(gisContent.includes('25.030757'), 'Volleyball Ground center must be 25.030757');
  assert.ok(gisContent.includes('25.030157'), 'Agriculture Field center must be 25.030157');

  // Verify Dijkstra road graph exports
  assert.ok(gisContent.includes('export const MEWAR_CAMPUS_GRAPH'), 'CampusGisMap must export MEWAR_CAMPUS_GRAPH');
  assert.ok(gisContent.includes('export function findShortestCampusRoute'), 'CampusGisMap must export findShortestCampusRoute');
  assert.ok(gisContent.includes('export function subdividePolyline'), 'CampusGisMap must export subdividePolyline');
  assert.ok(mapContent.includes('findShortestCampusRoute'), 'CampusMap must import and use findShortestCampusRoute');

  console.log('✅ Campus Locations & Road Routing: All 26 locations, authentic coordinates, Dijkstra routing, and backwards-compatible aliases verified.');
});
