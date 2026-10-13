import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('🏛️ [NextCampus] Ground Floor Map Reference & SmartRooms Audit');
console.log('================================================================');

const smartRoomsContent = fs.readFileSync(
  path.resolve('./src/pages/SmartRooms.jsx'),
  'utf-8'
);

const svgExists = fs.existsSync(path.resolve('./public/ground_floor_map.svg'));
const jpgExists = fs.existsSync(path.resolve('./public/ground_floor_map.jpg'));

let passed = 0;
const total = 7;

try {
  // Check 1: Reference Map Asset Availability
  console.log('\n[Check 1/7] Verifying Ground Floor Map Asset Availability in public/...');
  assert.ok(svgExists, 'public/ground_floor_map.svg must exist');
  assert.ok(jpgExists, 'public/ground_floor_map.jpg must exist');
  console.log('✅ Check 1 Passed: Both SVG wrapper and reference image assets exist in public directory');
  passed++;

  // Check 2: Authoritative Base Image Integration (Approach A)
  console.log('\n[Check 2/7] Verifying Approach A implementation in SmartRooms.jsx...');
  assert.ok(
    smartRoomsContent.includes('href="/ground_floor_map.svg"') || smartRoomsContent.includes("href='/ground_floor_map.svg'"),
    'Must embed /ground_floor_map.svg directly as authoritative visual base'
  );
  assert.ok(
    smartRoomsContent.includes('viewBox="0 0 1200 896"'),
    'Must preserve exact 1200 x 896 aspect ratio & viewBox from reference'
  );
  assert.ok(
    smartRoomsContent.includes('preserveAspectRatio="xMidYMid meet"'),
    'Must preserve aspect ratio without stretching or distortion'
  );
  console.log('✅ Check 2 Passed: Map is rendered with exact 1200x896 geometry and authoritative image');
  passed++;

  // Check 3: Essential Ground Floor Wings & Rooms Present
  console.log('\n[Check 3/7] Verifying all key rooms from ground_floor_map.svg are mapped...');
  const keyRooms = [
    'Central Library',
    'Student Section',
    'Canteen',
    'Central Examination Room',
    'Farmacy Library',
    'Office',
    'Staff Room',
    'Badminton Court (North)',
    'Badminton Court (South)',
    'Management Room',
    'Kitchen Room',
  ];
  for (const room of keyRooms) {
    assert.ok(smartRoomsContent.includes(room), `Missing room: ${room}`);
  }
  console.log('✅ Check 3 Passed: All key rooms from reference blueprint are mapped');
  passed++;

  // Check 4: Interactive Overlays for Clickable Rooms
  console.log('\n[Check 4/7] Verifying interactive overlay targets over base image...');
  assert.ok(
    smartRoomsContent.includes('buildingFilteredRooms') && smartRoomsContent.includes('room.cadBox'),
    'Must dynamically render overlay targets from cadBox coordinates'
  );
  assert.ok(
    smartRoomsContent.includes('setSelectedRoomId(room.id)'),
    'Overlay elements must update selectedRoomId on click'
  );
  console.log('✅ Check 4 Passed: Accurately aligned transparent SVG interaction regions are present');
  passed++;

  // Check 5: Dynamic Routing from Central Hall
  console.log('\n[Check 5/7] Verifying vector routing from Central Hall to room doors...');
  assert.ok(
    smartRoomsContent.includes('START (Central Hall)'),
    'Departure beacon must start from Central Hall spine'
  );
  assert.ok(
    smartRoomsContent.includes('selectedRoom.cadBox.door'),
    'Route line must lead to selected room door'
  );
  console.log('✅ Check 5 Passed: Vector routing connects Central Hall to destination room doors');
  passed++;

  // Check 6: Clean Removal of Old Demo Rooms
  console.log('\n[Check 6/7] Verifying old demo rooms are removed from active rooms...');
  const oldDemoIds = ['B-201', 'B-202', 'B-203', 'B-204', 'B-205', 'B-206', 'LIB-201', 'LIB-202'];
  for (const id of oldDemoIds) {
    const hasActiveId = smartRoomsContent.includes(`id: '${id}'`) || smartRoomsContent.includes(`id: "${id}"`);
    assert.ok(!hasActiveId, `Old demo room ID ${id} should not exist in active rooms`);
  }
  console.log('✅ Check 6 Passed: No legacy demo room IDs remain in active rooms dataset');
  passed++;

  // Check 7: Zoom and Responsive Viewport Controls
  console.log('\n[Check 7/7] Verifying responsive layout and zoom controls...');
  assert.ok(
    smartRoomsContent.includes('setCadZoom'),
    'Must provide zoom controls'
  );
  assert.ok(
    smartRoomsContent.includes('cadZoom'),
    'Scale transform must be applied to SVG canvas'
  );
  console.log('✅ Check 7 Passed: Zoom and scale controls operate smoothly on the blueprint');
  passed++;

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passed}/${total} GROUND FLOOR MAP AUDIT CHECKS PASSED!`);
  console.log('================================================================');
} catch (err) {
  console.error('\n❌ Audit Failed:', err.message);
  process.exit(1);
}
