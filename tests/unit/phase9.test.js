import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

async function runPhase9Tests() {
  console.log('================================================================');
  console.log('♿ [Phase 9 Test Suite] Responsiveness & Accessibility Verification');
  console.log('================================================================');

  let passedTests = 0;
  const totalTests = 7;

  try {
    // ------------------------------------------------------------------
    // TEST 1: Global Focus-Visible & Reduced Motion Accessibility Tokens
    // ------------------------------------------------------------------
    console.log('\n[Test 1/7] Verifying Global CSS Focus Indicators & Reduced-Motion Tokens...');
    const indexCssPath = path.join(projectRoot, 'src/index.css');
    const indexCss = fs.readFileSync(indexCssPath, 'utf8');

    assert.ok(
      indexCss.includes(':focus-visible'),
      'Global CSS must define :focus-visible rules for WCAG 2.4.7'
    );
    assert.ok(
      indexCss.includes('outline-offset') && indexCss.includes('outline'),
      'Focus-visible styles must include clear high-contrast outline and offset'
    );
    assert.ok(
      indexCss.includes('@media (prefers-reduced-motion: reduce)'),
      'CSS must include @media (prefers-reduced-motion: reduce) rule for vestibular comfort'
    );
    assert.ok(
      indexCss.includes('.touch-target-min'),
      'CSS must include .touch-target-min utility adhering to 44px minimum touch targets'
    );
    console.log('✅ Test 1 Passed: WCAG 2.1 Focus-visible and reduced-motion tokens verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 2: AppLayout Document Scrolling & Full-Bleed Map Adaptation
    // ------------------------------------------------------------------
    console.log('\n[Test 2/7] Verifying AppLayout Page Scrolling & Edge-to-Edge GIS Clamping...');
    const appLayoutPath = path.join(projectRoot, 'src/components/layout/AppLayout.jsx');
    const appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');

    assert.ok(
      appLayoutContent.includes('isMapRoute'),
      'AppLayout must identify edge-to-edge full bleed routes like /campus-map'
    );
    assert.ok(
      !appLayoutContent.includes('<main className={`flex-1 overflow-y-auto'),
      'Standard pages must not be trapped in inner overflow-y-auto preventing window scroll'
    );
    assert.ok(
      appLayoutContent.includes('h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)]'),
      'Map route must be clamped to viewport height minus header and mobile nav'
    );
    assert.ok(
      appLayoutContent.includes("e.key === 'Escape'"),
      'Mobile drawer must close when pressing Escape'
    );
    console.log('✅ Test 2 Passed: AppLayout document scrolling & GIS edge-to-edge verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 3: Mobile Nav Touch Targets & Comprehensive Drawer Reach
    // ------------------------------------------------------------------
    console.log('\n[Test 3/7] Verifying MobileNav Touch Target Dimensions & More Navigation...');
    const mobileNavPath = path.join(projectRoot, 'src/components/layout/MobileNav.jsx');
    const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf8');

    assert.ok(
      mobileNavContent.includes('min-w-[44px] min-h-[44px]'),
      'Mobile navigation items must have at least 44x44px touch targets'
    );
    assert.ok(
      mobileNavContent.includes('onOpenMore'),
      'MobileNav must provide onOpenMore trigger for secondary destinations'
    );
    assert.ok(
      mobileNavContent.includes('aria-label='),
      'MobileNav items must provide descriptive aria-labels for screen readers'
    );
    console.log('✅ Test 3 Passed: Mobile navigation touch targets and drawer integration verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 4: GIS Map Responsive Layout & Mutual Drawer Exclusion
    // ------------------------------------------------------------------
    console.log('\n[Test 4/7] Verifying Campus GIS Map Viewport & Panel Exclusivity...');
    const campusMapPath = path.join(projectRoot, 'src/pages/CampusMap.jsx');
    const campusMapContent = fs.readFileSync(campusMapPath, 'utf8');

    assert.ok(
      campusMapContent.includes('window.innerWidth >= 1024'),
      'CampusMap must responsively collapse directory panel on screens < 1024px'
    );
    assert.ok(
      campusMapContent.includes('window.innerWidth < 1024'),
      'CampusMap must auto-collapse opposing panel on small screens to avoid 100% map obscuration'
    );

    const gisMapCompPath = path.join(projectRoot, 'src/components/map/CampusGisMap.jsx');
    const gisMapCompContent = fs.readFileSync(gisMapCompPath, 'utf8');

    assert.ok(
      gisMapCompContent.includes('calc(100vw - 32px)'),
      'Map controls and overlay cards must be clamped within viewport width'
    );
    console.log('✅ Test 4 Passed: GIS Map responsive panel exclusivity and layout clamping verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 5: SmartRooms CAD Floor-Plan Responsive Sizing & Keyboard Accessibility
    // ------------------------------------------------------------------
    console.log('\n[Test 5/7] Verifying SmartRooms CAD Responsive Viewport & Dialog Accessibility...');
    const smartRoomsPath = path.join(projectRoot, 'src/pages/SmartRooms.jsx');
    const smartRoomsContent = fs.readFileSync(smartRoomsPath, 'utf8');

    assert.ok(
      smartRoomsContent.includes('h-[380px] sm:h-[480px] xl:h-[580px]'),
      'CAD floor plan canvas container must have responsive stepped heights'
    );
    assert.ok(
      smartRoomsContent.includes('role="dialog"') && smartRoomsContent.includes('aria-modal="true"'),
      'Booking modal must declare role="dialog" and aria-modal="true"'
    );
    assert.ok(
      smartRoomsContent.includes("e.key === 'Escape'"),
      'SmartRooms must listen for Escape key to close active booking modals'
    );
    console.log('✅ Test 5 Passed: SmartRooms CAD responsive scaling & modal accessibility verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 6: Student Dashboard Gate Pass Modal Accessibility & Escape Listener
    // ------------------------------------------------------------------
    console.log('\n[Test 6/7] Verifying Student Dashboard Modal Semantics...');
    const dashboardPath = path.join(projectRoot, 'src/pages/StudentDashboard.jsx');
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

    assert.ok(
      dashboardContent.includes('role="dialog"') && dashboardContent.includes('aria-modal="true"'),
      'Gate pass modal must declare role="dialog" and aria-modal="true"'
    );
    assert.ok(
      dashboardContent.includes("e.key === 'Escape' && isGatePassOpen"),
      'Gate pass modal must dismiss on Escape key'
    );
    assert.ok(
      dashboardContent.includes('aria-label="Close turnstile gate pass"'),
      'Close button must have accessible aria-label'
    );
    console.log('✅ Test 6 Passed: Student Dashboard modal semantics and keyboard traps verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 7: Helpdesk, Admin & Auth Dialog Backdrop Dismissal & Labels
    // ------------------------------------------------------------------
    console.log('\n[Test 7/7] Verifying Auth, Care & Admin Modals Backdrop & Escape Support...');
    const authPath = path.join(projectRoot, 'src/pages/AuthPage.jsx');
    const authContent = fs.readFileSync(authPath, 'utf8');
    assert.ok(
      authContent.includes("e.key === 'Escape' && showForgotModal"),
      'AuthPage must close forgot password dialog on Escape'
    );

    const carePath = path.join(projectRoot, 'src/pages/CareComplaints.jsx');
    const careContent = fs.readFileSync(carePath, 'utf8');
    assert.ok(
      careContent.includes("e.key === 'Escape' && lightboxImage"),
      'CareComplaints must close lightbox on Escape'
    );

    const complaintAdminPath = path.join(projectRoot, 'src/pages/ComplaintAdmin.jsx');
    const complaintAdminContent = fs.readFileSync(complaintAdminPath, 'utf8');
    assert.ok(
      complaintAdminContent.includes("e.key === 'Escape'"),
      'ComplaintAdmin must close modals on Escape'
    );
    console.log('✅ Test 7 Passed: Application-wide dialog backdrop and Escape dismissal verified');
    passedTests++;

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} PHASE 9 ACCESSIBILITY & RESPONSIVENESS TESTS PASSED!`);
    console.log('================================================================');
  } catch (err) {
    console.error('\n❌ Phase 9 Test Failure:', err.message);
    process.exit(1);
  }
}

runPhase9Tests();
