import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

async function runNavbarSidebarTests() {
  console.log('================================================================');
  console.log('🧭 [Navbar & Collapsible Sidebar Test Suite] Verification Tests');
  console.log('================================================================');

  let passedTests = 0;
  const totalTests = 5;

  try {
    // ------------------------------------------------------------------
    // TEST 1: AI Assistant Removed from Sidebar
    // ------------------------------------------------------------------
    console.log('\n[Test 1/5] Verifying AI Assistant removed from Sidebar...');
    const sidebarPath = path.join(projectRoot, 'src/components/layout/Sidebar.jsx');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

    assert.ok(
      !sidebarContent.includes("label: 'AI Assistant'"),
      'Sidebar must no longer contain the "AI Assistant" navigation item'
    );
    assert.ok(
      !sidebarContent.includes("path: '/ai-assistant'"),
      'Sidebar must no longer contain link to /ai-assistant'
    );
    console.log('✅ Test 1 Passed: AI Assistant successfully removed from Sidebar');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 2: AI Assistant Added to Global Navbar
    // ------------------------------------------------------------------
    console.log('\n[Test 2/5] Verifying AI Assistant button in Navbar...');
    const navbarPath = path.join(projectRoot, 'src/components/layout/Navbar.jsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');

    assert.ok(
      navbarContent.includes('to="/ai-assistant"'),
      'Navbar must link to /ai-assistant'
    );
    assert.ok(
      navbarContent.includes('aria-label="AI Assistant"'),
      'Navbar button must declare aria-label="AI Assistant"'
    );
    assert.ok(
      navbarContent.includes('title="AI Assistant"'),
      'Navbar button must provide accessible tooltip title="AI Assistant"'
    );
    assert.ok(
      navbarContent.includes('Sparkles'),
      'Navbar button must render Sparkles icon'
    );
    console.log('✅ Test 2 Passed: AI Assistant button verified in Navbar');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 3: Collapsible Sidebar Width, Tooltips & Toggle Controls
    // ------------------------------------------------------------------
    console.log('\n[Test 3/5] Verifying Collapsible Sidebar states and non-clipping tooltips...');
    assert.ok(
      sidebarContent.includes('isCollapsed ? \'w-[72px] overflow-visible\' : \'w-[260px]\''),
      'Sidebar must transition between 72px rail (overflow-visible) and 260px expanded'
    );
    assert.ok(
      sidebarContent.includes('role="tooltip"'),
      'Collapsed rail items must declare role="tooltip" for accessibility'
    );
    assert.ok(
      sidebarContent.includes('group-hover/tooltip:opacity-100') &&
      sidebarContent.includes('group-focus-within/tooltip:opacity-100'),
      'Tooltips must display on hover and keyboard focus-within'
    );
    assert.ok(
      sidebarContent.includes('PanelLeftClose') && sidebarContent.includes('PanelLeftOpen'),
      'Sidebar must provide expand and collapse toggle controls'
    );
    assert.ok(
      sidebarContent.includes('aria-expanded={false}') && sidebarContent.includes('aria-expanded={true}'),
      'Sidebar toggle button must declare dynamic aria-expanded'
    );
    console.log('✅ Test 3 Passed: Collapsible Sidebar layout, tooltips, and accessibility verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 4: AppLayout Persistence, Keyboard Shortcut (Cmd+B), and Navbar Controls
    // ------------------------------------------------------------------
    console.log('\n[Test 4/5] Verifying AppLayout state persistence & keyboard shortcuts...');
    const appLayoutPath = path.join(projectRoot, 'src/components/layout/AppLayout.jsx');
    const appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');

    assert.ok(
      appLayoutContent.includes("localStorage.getItem('nextcampus_sidebar_collapsed')"),
      'AppLayout must read sidebar collapsed state from localStorage'
    );
    assert.ok(
      appLayoutContent.includes("localStorage.setItem('nextcampus_sidebar_collapsed'"),
      'AppLayout must persist sidebar collapsed state to localStorage'
    );
    assert.ok(
      appLayoutContent.includes("key.toLowerCase() === 'b'"),
      'AppLayout must support Cmd+B / Ctrl+B keyboard shortcut to toggle sidebar'
    );
    assert.ok(
      appLayoutContent.includes('isSidebarCollapsed={isSidebarCollapsed}'),
      'AppLayout must pass isSidebarCollapsed to Navbar'
    );
    assert.ok(
      appLayoutContent.includes('isCollapsed={false}'),
      'AppLayout must force expanded state on mobile drawer'
    );
    console.log('✅ Test 4 Passed: AppLayout state persistence, shortcuts, and drawer behavior verified');
    passedTests++;

    // ------------------------------------------------------------------
    // TEST 5: Mobile Bottom Navigation
    // ------------------------------------------------------------------
    console.log('\n[Test 5/5] Verifying MobileNav destinations...');
    const mobileNavPath = path.join(projectRoot, 'src/components/layout/MobileNav.jsx');
    const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf8');

    assert.ok(
      mobileNavContent.includes("path: '/directory'"),
      'MobileNav must include Directory in primary bottom nav items'
    );
    assert.ok(
      !mobileNavContent.includes("path: '/ai-assistant'"),
      'MobileNav bottom bar does not duplicate AI Assistant now present in top Navbar'
    );
    console.log('✅ Test 5 Passed: Mobile navigation destinations verified');
    passedTests++;

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} NAVBAR & COLLAPSIBLE SIDEBAR TESTS PASSED!`);
    console.log('================================================================');
  } catch (err) {
    console.error('\n❌ Test Failure:', err.message);
    process.exit(1);
  }
}

runNavbarSidebarTests();
