import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('Campus Locations Update: All 20 real Mewar University locations exist in CampusGisMap and CampusMap', () => {
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
  ];

  for (const id of expectedLocations) {
    assert.ok(gisContent.includes(id), `CampusGisMap.jsx must contain location "${id}"`);
    assert.ok(mapContent.includes(id), `CampusMap.jsx must contain location "${id}"`);
  }

  // Verify updated names
  assert.ok(gisContent.includes('Main Academic & Administrative Building'), 'Main Building must be present in CampusGisMap');
  assert.ok(gisContent.includes('Sanaga Boys Residential Hostel'), 'Sanaga Hostel must be present in CampusGisMap');
  assert.ok(gisContent.includes('Central Student Dining Mess'), 'Mess must be present in CampusGisMap');
  assert.ok(gisContent.includes('Faculty of Law & Legal Studies'), 'Law Building must be present in CampusGisMap');
  assert.ok(gisContent.includes('University Football Ground & Arena'), 'Football Ground must be present in CampusGisMap');
  assert.ok(gisContent.includes('Basketball & Outdoor Sports Court'), 'Basketball Ground must be present in CampusGisMap');

  // Verify backward compatibility aliases
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.admin = CAMPUS_GIS_LOCATIONS.main;'), 'admin alias must resolve to main');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.cafeteria = CAMPUS_GIS_LOCATIONS.mess;'), 'cafeteria alias must resolve to mess');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.hostel_b = CAMPUS_GIS_LOCATIONS.sanaga;'), 'hostel_b alias must resolve to sanaga');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.hostel_g = CAMPUS_GIS_LOCATIONS.mira;'), 'hostel_g alias must resolve to mira');
  assert.ok(gisContent.includes('CAMPUS_GIS_LOCATIONS.sports = CAMPUS_GIS_LOCATIONS.basketball;'), 'sports alias must resolve to basketball');

  console.log('✅ Campus Locations Update: All 20 locations and backwards-compatible aliases verified.');
});
