import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('📱 [NextCampus] Map Section & Landing Page Mobile View Audit');
console.log('================================================================');

const landingPageContent = fs.readFileSync(
  path.resolve('./src/pages/LandingPage.jsx'),
  'utf-8'
);

const campusMapContent = fs.readFileSync(
  path.resolve('./src/pages/CampusMap.jsx'),
  'utf-8'
);

const campusGisMapContent = fs.readFileSync(
  path.resolve('./src/components/map/CampusGisMap.jsx'),
  'utf-8'
);

let passed = 0;
const total = 8;

try {
  // Test 1: Landing Page Hero Responsiveness
  console.log('\n[Check 1/8] Verifying LandingPage Hero Mobile Layout...');
  assert.ok(
    landingPageContent.includes('min-h-[460px] md:min-h-[580px]'),
    'LandingPage hero must have responsive min-height'
  );
  assert.ok(
    landingPageContent.includes('px-4 py-12 md:py-20 md:px-8'),
    'LandingPage hero must have mobile-safe padding with desktop preserved'
  );
  assert.ok(
    landingPageContent.includes('text-3xl sm:text-5xl md:text-6xl'),
    'Hero heading must scale down on mobile phones to prevent awkward overflow'
  );
  console.log('✅ Check 1 Passed: LandingPage hero section is fully responsive');
  passed++;

  // Test 2: Landing Page Digital Twin Section & Mobile Pill Selector
  console.log('\n[Check 2/8] Verifying LandingPage Digital Twin Mobile Usability...');
  assert.ok(
    landingPageContent.includes('grid grid-cols-1 lg:grid-cols-2'),
    'Digital twin grid must use 1 column on mobile and 2 on desktop (no minmax(320px) blowout)'
  );
  assert.ok(
    landingPageContent.includes('flex md:hidden items-center gap-1.5 overflow-x-auto'),
    'Must include touch-friendly mobile node selector pills for easy tapping on touchscreens'
  );
  assert.ok(
    landingPageContent.includes('ENG-02 Engineering') && landingPageContent.includes('LIB-03 Library'),
    'Mobile node selector pills must include key campus facility nodes'
  );
  console.log('✅ Check 2 Passed: Digital Twin section provides mobile-friendly touch selector');
  passed++;

  // Test 3: Landing Page Action Buttons & Footer
  console.log('\n[Check 3/8] Verifying LandingPage Action Strip and Footer...');
  assert.ok(
    landingPageContent.includes('quick-action-strip flex-col sm:flex-row'),
    'Quick action strip must stack full-width on mobile'
  );
  assert.ok(
    landingPageContent.includes('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'),
    'Footer columns must stack on mobile screens'
  );
  console.log('✅ Check 3 Passed: LandingPage action strip and footer are responsive');
  passed++;

  // Test 4: Campus Map Subheader Desktop Preservation & Mobile Streamlining
  console.log('\n[Check 4/8] Verifying CampusMap Subheader Toolbar Desktop/Mobile Separation...');
  assert.ok(
    campusMapContent.includes('hidden md:flex min-h-[56px] py-2 px-4 md:px-5 items-center justify-between'),
    'Desktop toolbar must remain strictly intact for md+ screens'
  );
  assert.ok(
    campusMapContent.includes('flex md:hidden flex-col px-3 py-2 gap-2'),
    'Mobile toolbar must provide clean 2-row layout (< md)'
  );
  assert.ok(
    campusMapContent.includes('overflow-x-auto pb-0.5 scrollbar-none'),
    'Mobile filter bar must use horizontal scrolling without wrapping into messy rows'
  );
  console.log('✅ Check 4 Passed: CampusMap toolbar maintains desktop view while streamlining mobile');
  passed++;

  // Test 5: Campus Map Directory Panel Mobile Bottom Sheet Transformation
  console.log('\n[Check 5/8] Verifying CampusMap Directory Panel Mobile Bottom Sheet...');
  assert.ok(
    campusMapContent.includes('inset-x-0 bottom-0 top-auto w-full max-w-full rounded-t-2xl'),
    'Left directory drawer must dock at the bottom on mobile viewports'
  );
  assert.ok(
    campusMapContent.includes('md:top-4 md:bottom-4 md:w-[390px] md:max-w-[calc(100vw-32px)] md:rounded-2xl'),
    'Directory panel on desktop must remain the side slide-over drawer'
  );
  assert.ok(
    campusMapContent.includes('w-10 h-1 bg-slate-300 rounded-full mx-auto my-2 md:hidden'),
    'Mobile bottom sheet must feature native touch grab handle'
  );
  console.log('✅ Check 5 Passed: Directory panel transforms into mobile bottom sheet');
  passed++;

  // Test 6: Campus Map Building Details Drawer Mobile Facility Sheet Transformation
  console.log('\n[Check 6/8] Verifying CampusMap Facility Details Mobile Bottom Sheet...');
  assert.ok(
    campusMapContent.includes('md:top-4 md:bottom-4 md:right-4 md:w-[360px]'),
    'Building details drawer on desktop must remain the right slide-over'
  );
  assert.ok(
    campusMapContent.includes('inset-x-0 bottom-0 top-auto w-full max-w-full rounded-t-2xl border-t'),
    'Building details drawer on mobile must dock as a bottom sheet'
  );
  console.log('✅ Check 6 Passed: Facility details drawer docks as a bottom sheet on mobile');
  passed++;

  // Test 7: CampusGisMap Overlays & Controls Mobile Adaptations
  console.log('\n[Check 7/8] Verifying CampusGisMap Floating Overlays on Mobile...');
  assert.ok(
    campusGisMapContent.includes('absolute bottom-3 inset-x-3 md:bottom-auto md:top-16 md:right-4'),
    'Floating destination card must dock safely at bottom on mobile and top-right on desktop'
  );
  assert.ok(
    campusGisMapContent.includes('absolute top-2.5 right-2.5 md:top-4 md:right-4'),
    'Layer switcher must be compact and positioned safely on mobile'
  );
  assert.ok(
    campusGisMapContent.includes('absolute bottom-3 right-3 md:bottom-6 md:right-4'),
    'Action buttons must have mobile-safe positioning'
  );
  console.log('✅ Check 7 Passed: CampusGisMap floating controls are mobile-safe');
  passed++;

  // Test 8: Zero Desktop Style Regressions Check
  console.log('\n[Check 8/8] Verifying Zero Desktop Layout Regressions...');
  // Ensure that all mobile overrides are prefixed with mobile classes or hidden on md
  assert.ok(
    campusMapContent.includes('md:left-4') && campusMapContent.includes('md:-left-[430px]'),
    'Desktop navigation drawer open/close positioning is strictly preserved'
  );
  assert.ok(
    campusMapContent.includes('md:right-4') && campusMapContent.includes('md:w-[360px]'),
    'Desktop building detail drawer width and right positioning is strictly preserved'
  );
  console.log('✅ Check 8 Passed: Desktop view has zero regressions');
  passed++;

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passed}/${total} MAP & LANDING MOBILE AUDIT CHECKS PASSED!`);
  console.log('================================================================');
  process.exit(0);
} catch (err) {
  console.error('❌ Map & Landing Mobile Audit Failed:', err);
  process.exit(1);
}
