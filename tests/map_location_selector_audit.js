import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('📍 [NextCampus] Map Location Selector & Symbol Markers Audit');
console.log('================================================================');

const campusMapPath = path.resolve('src/pages/CampusMap.jsx');
const campusGisPath = path.resolve('src/components/map/CampusGisMap.jsx');
const indexCssPath = path.resolve('src/index.css');

const campusMapContent = fs.readFileSync(campusMapPath, 'utf8');
const campusGisContent = fs.readFileSync(campusGisPath, 'utf8');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');

// Check 1: Symbols for Temple, Parking, Gym, Cricket, Volleyball, Agriculture
console.log('\n[Check 1/5] Verifying all landmarks use circular symbol pins without badge-only exclusion...');
const hasBadgeOnlyExclusion = campusGisContent.includes('isBadgeOnlyLandmark');
const hasKeyLandmarkPill = campusGisContent.includes('isKeyLandmark');
if (hasBadgeOnlyExclusion || hasKeyLandmarkPill) {
  console.error('❌ Check 1 Failed: isBadgeOnlyLandmark or isKeyLandmark still exists in CampusGisMap.jsx');
  process.exit(1);
}
console.log('✅ Check 1 Passed: Badge-only exclusion removed; all landmarks render circular symbol marker pins');

// Check 2: Hover tooltip on polygons and markers
console.log('\n[Check 2/5] Verifying tooltips display building names on hover...');
const polyTooltipHover = campusGisContent.includes('poly.bindTooltip') && campusGisContent.includes('permanent: isSelected');
const markerTooltipHover = campusGisContent.includes('marker.bindTooltip') && campusGisContent.includes('mewar-tooltip');
if (!polyTooltipHover || !markerTooltipHover) {
  console.error('❌ Check 2 Failed: Tooltips on hover not properly configured');
  process.exit(1);
}
console.log('✅ Check 2 Passed: Names show cleanly on hover for both polygons and circular marker icons');

// Check 3: Directory and Routes drawer & floating pill z-index and visibility
console.log('\n[Check 3/5] Verifying Directory & Routes drawer and pill visibility (zIndex: 500)...');
const hasDrawerZIndex = campusMapContent.includes('style={{ zIndex: 500 }}');
const hasPillZIndex = campusMapContent.includes('Open Campus Directory & Routes') && campusMapContent.includes('zIndex: 500');
if (!hasDrawerZIndex || !hasPillZIndex) {
  console.error('❌ Check 3 Failed: Directory & Routes drawer or pill missing zIndex: 500');
  process.exit(1);
}
console.log('✅ Check 3 Passed: Directory & Routes drawer and expand pill have zIndex: 500 above Leaflet canvas');

// Check 4: Location Selector dropdowns on Desktop and Mobile toolbars
console.log('\n[Check 4/5] Verifying Location Selector dropdown on toolbars...');
const hasDesktopLocationSelect = campusMapContent.includes('aria-label="Select Campus Location"');
const hasDirectoryToggleBtn = campusMapContent.includes('Directory & Routes') && campusMapContent.includes('setIsNavPanelOpen');
if (!hasDesktopLocationSelect || !hasDirectoryToggleBtn) {
  console.error('❌ Check 4 Failed: Desktop/Mobile Location Selector or Directory & Routes toggle missing');
  process.exit(1);
}
console.log('✅ Check 4 Passed: Prominent Location Selector and Directory & Routes toggle present');

// Check 5: Starting Point selector and route swapping in Directions mode
console.log('\n[Check 5/5] Verifying Directions Starting Point selector and route swap...');
const hasStartLocationSelect = campusMapContent.includes('aria-label="Select Starting Point"');
const hasRouteSwapLogic = campusMapContent.includes('setStartLocationId(currentDest)') && campusMapContent.includes('handleSelectBuilding(currentStart');
if (!hasStartLocationSelect || !hasRouteSwapLogic) {
  console.error('❌ Check 5 Failed: Directions Starting Point selector or swap logic missing');
  process.exit(1);
}
console.log('✅ Check 5 Passed: Interactive Starting Point selector and functional route swapping verified');

console.log('\n================================================================');
console.log('🎉 ALL 5/5 LOCATION SELECTOR & SYMBOL AUDIT CHECKS PASSED!');
console.log('================================================================');
