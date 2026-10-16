import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('Facility Admin Update & Photo Management: Admin edit modal, image uploading, and persistence exist in CampusMap.jsx', () => {
  const campusMapPath = path.join(projectRoot, 'src/pages/CampusMap.jsx');
  const mapContent = fs.readFileSync(campusMapPath, 'utf8');

  // 1. Verify Image upload and Camera icons are imported and used
  assert.ok(mapContent.includes('Camera'), 'Camera icon must be imported in CampusMap.jsx');
  assert.ok(mapContent.includes('Upload'), 'Upload icon must be imported in CampusMap.jsx');

  // 2. Verify handleImageFileChange and FileReader support
  assert.ok(mapContent.includes('handleImageFileChange'), 'handleImageFileChange must be defined in CampusMap.jsx');
  assert.ok(mapContent.includes('readAsDataURL'), 'FileReader.readAsDataURL must be implemented for local photo upload');

  // 3. Verify LocalStorage persistence for building custom overrides
  assert.ok(mapContent.includes('nextcampus_custom_buildings'), 'localStorage persistence key nextcampus_custom_buildings must be present');
  assert.ok(mapContent.includes('handleResetBuildingToDefault'), 'handleResetBuildingToDefault must allow reverting back to university defaults');

  // 4. Verify Admin Edit modal has all required field categories
  assert.ok(mapContent.includes('editModalTab'), 'editModalTab must be present for tabbed organization');
  assert.ok(mapContent.includes('Live Telemetry'), 'Live Telemetry tab must exist for editing metrics');
  assert.ok(mapContent.includes('Facility Info'), 'Facility Info tab must exist');
  assert.ok(mapContent.includes('Photo & Media'), 'Photo & Media tab must exist');
  assert.ok(mapContent.includes('Space & GPS'), 'Space & GPS tab must exist');

  // 5. Verify image editing overlay button on Drawer
  assert.ok(mapContent.includes('Edit Photo & Info'), 'Drawer image must have an Edit Photo & Info overlay button');
  assert.ok(mapContent.includes('Admin: Edit Facility Details & Photo'), 'Drawer must have Admin Edit Facility button');

  // 6. Verify sync to runtime CAMPUS_GIS_LOCATIONS
  assert.ok(mapContent.includes('CAMPUS_GIS_LOCATIONS[bldgKey].name = updatedBuilding.name'), 'Edits must sync directly to runtime CAMPUS_GIS_LOCATIONS');

  console.log('✅ Facility Admin Update & Photo Management test passed successfully.');
});
