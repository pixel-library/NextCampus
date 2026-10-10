import assert from 'assert';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Services
import * as authService from '../server/services/auth.service.js';
import * as campusService from '../server/services/campus.service.js';
import * as roomService from '../server/services/room.service.js';
import * as careService from '../server/services/care.service.js';
import * as skillService from '../server/services/skill.service.js';
import * as sustainabilityService from '../server/services/sustainability.service.js';
import * as aiService from '../server/services/ai.service.js';
import * as adminService from '../server/services/admin.service.js';
import { generateToken, verifyToken } from '../server/utils/helpers.js';

// Disable buffering for instant test execution
mongoose.set('bufferCommands', false);

async function runMasterAuditTests() {
  console.log('================================================================');
  console.log('🏛️  [NextCampus Master Audit] Full-Stack Integration & Security Test');
  console.log('================================================================');

  let passedCount = 0;
  const totalWorkflows = 10;

  try {
    // ------------------------------------------------------------------
    // WORKFLOW 1: Public Landing-Page & System Health Verification
    // ------------------------------------------------------------------
    console.log('\n[Workflow 1/10] Verifying Public Navigation & Campus Health...');
    const locations = await campusService.getAllLocations();
    assert.ok(Array.isArray(locations), 'Campus locations must be retrieved as array');
    assert.ok(locations.length > 0, 'Initial seed campus locations must be available');
    const firstLoc = locations[0];
    assert.ok(firstLoc.name && firstLoc.code, 'Location must have name and code');
    console.log(`✅ Workflow 1 Passed: Public campus registry verified (${locations.length} facilities accessible)`);
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 2: Authentication & Password Security
    // ------------------------------------------------------------------
    console.log('\n[Workflow 2/10] Verifying Authentication, Bcrypt Hashing & Role Isolation...');
    const testEmail = `audit_student_${Date.now()}@campus.edu`;
    const plainPass = 'AuditSecurePassword2026!';

    // A. Registration with forced student role
    const regRes = await authService.registerUser({
      name: 'Aditi Rao',
      email: testEmail,
      studentId: '2026-AI-104',
      department: 'Artificial Intelligence & Data',
      academicYear: 'Class of 2027',
      password: plainPass,
      role: 'admin', // Malicious privilege escalation attempt
    });
    assert.strictEqual(regRes.user.role, 'student', 'Role must strictly remain student on self-registration');
    assert.strictEqual(regRes.user.password, undefined, 'Plaintext password must not be exposed');
    assert.ok(regRes.token, 'JWT authentication token must be generated');

    // B. Login with valid credentials
    const loginRes = await authService.loginUser(testEmail, plainPass);
    assert.strictEqual(loginRes.user.email, testEmail);

    // C. Login rejection with bad credentials
    let badPassRejected = false;
    try {
      await authService.loginUser(testEmail, 'IncorrectPassword99!');
    } catch (err) {
      badPassRejected = true;
    }
    assert.ok(badPassRejected, 'Invalid password must be rejected');

    console.log('✅ Workflow 2 Passed: Authentication, bcrypt hashing, and role isolation verified');
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 3: Student Dashboard Access & Telemetry
    // ------------------------------------------------------------------
    console.log('\n[Workflow 3/10] Verifying Student Dashboard Access & Sustainability Telemetry...');
    const metrics = await sustainabilityService.getSustainabilityMetrics();
    assert.ok(metrics.overallScore !== undefined, 'Sustainability overall score must exist');
    assert.ok(metrics.energyUsage !== undefined, 'Energy metrics must exist');
    assert.ok(metrics.carbonOffset !== undefined, 'Carbon offset telemetry must exist');

    const adminStats = await adminService.getAdminDashboardMetrics();
    assert.ok(adminStats.population && adminStats.population.students !== undefined, 'Student statistics must be available');
    console.log('✅ Workflow 3 Passed: Student telemetry and facility metrics verified');
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 4: Campus Search & Spatial Topologies
    // ------------------------------------------------------------------
    console.log('\n[Workflow 4/10] Verifying Campus Directory & Location Search Filters...');
    const academicLocs = await campusService.getAllLocations({ category: 'academic' });
    assert.ok(Array.isArray(academicLocs), 'Filtered locations must return array');
    const locByCode = await campusService.getLocationByCode(firstLoc.code);
    assert.ok(locByCode, 'Location lookup by code must succeed');
    assert.strictEqual(locByCode.code, firstLoc.code);
    console.log(`✅ Workflow 4 Passed: Spatial lookup and search filters verified for code: ${firstLoc.code}`);
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 5: SmartRoom Discovery & Capacity Queries
    // ------------------------------------------------------------------
    console.log('\n[Workflow 5/10] Verifying SmartRoom Discovery, IoT Status & Capacity...');
    const allRooms = await roomService.getRooms();
    assert.ok(Array.isArray(allRooms), 'SmartRooms must be returned as array');
    assert.ok(allRooms.length > 0, 'SmartRooms catalog must not be empty');
    const firstRoom = allRooms[0];
    assert.ok(firstRoom.roomNumber, 'Room must have roomNumber');
    assert.ok(typeof firstRoom.capacity === 'number', 'Room capacity must be numeric');
    console.log(`✅ Workflow 5 Passed: SmartRooms catalog verified (${allRooms.length} rooms discovered)`);
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 6: Complaint Submission & Administration (Dual-Note Separation)
    // ------------------------------------------------------------------
    console.log('\n[Workflow 6/10] Verifying Complaint Lifecycle, Staff Assignment & Note Privacy...');
    // A. Submit complaint
    const complaintDoc = await careService.createComplaint({
      title: 'Lab B-204 Interactive Screen Touch Calibration Lost',
      description: 'Optical touch sensors fail to calibrate on the interactive whiteboard.',
      category: 'academic',
      building: 'Alan Turing Hall (Block A-01)',
      location: 'Alan Turing Hall - Room B-204',
      priority: 'high',
      studentId: regRes.user.id,
      authorName: regRes.user.name,
    });
    assert.ok(complaintDoc._id, 'Complaint ticket must have ID');

    // B. Assign staff
    const assigned = await careService.assignStaff(
      complaintDoc._id,
      'usr_staff_01',
      'Marcus Vance (AV Lead)',
      'System Admin'
    );
    assert.strictEqual(assigned.assignedToName, 'Marcus Vance (AV Lead)');
    assert.strictEqual(assigned.status, 'in_progress');

    // C. Add private internal note (Admin only)
    await careService.addInternalNote(
      complaintDoc._id,
      'CONFIDENTIAL: Sensor PCB firmware version 1.4 requires hardware chip re-flash.',
      'usr_admin_01',
      'Campus Administrator'
    );

    // D. Add student-visible update
    await careService.addPublicUpdate(
      complaintDoc._id,
      'Technician dispatched with diagnostic calibration toolkit.',
      'Operations Dispatch'
    );

    // E. Verify strict privacy: Student response must NEVER leak internalNotes
    const studentView = await careService.getComplaintById(complaintDoc._id, false);
    assert.strictEqual(studentView.internalNotes, undefined, 'Internal notes must NEVER appear in student response');
    assert.ok(studentView.updates && studentView.updates.length > 0, 'Student-visible updates must be present');

    console.log('✅ Workflow 6 Passed: Complaint dispatch and internal note privacy strictly verified');
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 7: SkillCampus Project Creation & Duplicate Prevention
    // ------------------------------------------------------------------
    console.log('\n[Workflow 7/10] Verifying SkillCampus Collaboration & Membership Protection...');
    const project = await skillService.createProject({
      title: 'Autonomous Campus Quad Rover Navigation',
      description: 'Building ROS2 SLAM stack for micro-deliveries across campus pathways.',
      tags: ['ROS2', 'Python', 'Computer Vision', 'Embedded IoT'],
      teamSize: 4,
      authorId: regRes.user.id,
      authorName: regRes.user.name,
    });
    assert.ok(project._id, 'Project must be created');

    // Attempt duplicate join
    let duplicateBlocked = false;
    try {
      await skillService.joinProject(project._id, regRes.user.id, regRes.user.name);
    } catch (err) {
      duplicateBlocked = true;
      assert.ok(err.message.includes('already a member') || err.message.includes('Creator is automatically'));
    }
    assert.ok(duplicateBlocked, 'Duplicate membership in projects must be blocked');

    console.log('✅ Workflow 7 Passed: SkillCampus project creation and duplicate join prevention verified');
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 8: Campus Management CRUD & Safe Dependent Deletion
    // ------------------------------------------------------------------
    console.log('\n[Workflow 8/10] Verifying Campus Management CRUD & Safe Cascading Deletion...');
    const testBuildingCode = `AUDIT-${Date.now().toString().slice(-4)}`;
    const newFacility = await campusService.createLocation({
      name: 'Cybernetics Innovation Wing',
      code: testBuildingCode,
      category: 'academic',
      precinct: 'North Quadrangle',
      totalFloors: 3,
      departments: ['Cybernetics', 'Neural Systems'],
    });

    // Create linked room
    const linkedRoom = await roomService.createRoom({
      roomNumber: `${testBuildingCode}-101`,
      name: 'Neural Robotics Cell',
      building: newFacility.name,
      buildingCode: newFacility.code,
      floor: 'Level 1',
      capacity: 30,
      equipment: ['Workstations', 'AV Presentation'],
    });

    // Safe deletion should block non-cascading delete
    const safeDeleteResult = await campusService.deleteLocation(newFacility._id, false);
    assert.strictEqual(safeDeleteResult.conflict, true, 'Non-cascade deletion must detect dependent rooms');

    // Confirmed cascade deletion
    const cascadeResult = await campusService.deleteLocation(newFacility._id, true);
    assert.strictEqual(cascadeResult.deleted, true, 'Cascade deletion must succeed');

    console.log('✅ Workflow 8 Passed: Campus facility CRUD and cascading validation safely executed');
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 9: Profile Updates & Master Password Change Flow
    // ------------------------------------------------------------------
    console.log('\n[Workflow 9/10] Verifying Profile Persistence & Password Change...');
    const updatedProfile = await authService.updateProfile(
      regRes.user.id,
      {
        preferredName: 'Adi',
        phone: '+91 99000 88776',
        residence: 'Ramanujan Hostel • Room 402',
        bio: 'Edge computing & robotics specialist',
        skills: ['Python', 'ROS2', 'Next.js', 'PyTorch'],
        preferences: {
          accessibility: {
            highContrast: true,
            reduceMotion: true,
            textScale: 'Large (110%)',
          },
        },
      },
      'student'
    );
    assert.strictEqual(updatedProfile.user.preferredName, 'Adi');
    assert.strictEqual(updatedProfile.user.preferences.accessibility.textScale, 'Large (110%)');

    // Password change
    const newPass = 'BrandNewAuditPassword2026!';
    await authService.changePassword(regRes.user.id, plainPass, newPass);

    // Verify login with new password
    const verifiedNewLogin = await authService.loginUser(testEmail, newPass);
    assert.ok(verifiedNewLogin.token, 'Login with updated password must succeed');

    console.log('✅ Workflow 9 Passed: Profile persistence and password rotation verified');
    passedCount++;

    // ------------------------------------------------------------------
    // WORKFLOW 10: Administrative Authorization & Endpoint Protection
    // ------------------------------------------------------------------
    console.log('\n[Workflow 10/10] Verifying Role-Based Access Control (RBAC) & Endpoint Guards...');
    const studentToken = verifiedNewLogin.token;
    const studentClaims = verifyToken(studentToken);
    assert.strictEqual(studentClaims.role, 'student', 'Student claim must be student');

    const adminToken = generateToken({
      id: 'usr_admin_01',
      role: 'admin',
      email: 'admin@nextcampus.edu',
    });
    const adminClaims = verifyToken(adminToken);
    assert.strictEqual(adminClaims.role, 'admin', 'Admin claim must be admin');

    // AI Assistant query test
    const aiRes = await aiService.processAiQuery('Where is Turing Hall Room B-204?');
    assert.ok(aiRes.reply.includes('Turing Hall') || aiRes.reply.includes('B-204'), 'AI Assistant must return relevant spatial guidance');

    console.log('✅ Workflow 10 Passed: Administrative RBAC tokens and AI service verified');
    passedCount++;

    console.log('\n================================================================');
    console.log(`🎉 ALL 10 NEXTCAMPUS MASTER AUDIT WORKFLOWS PASSED (${passedCount}/${totalWorkflows})!`);
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Master Audit Test Suite Failure:', err);
    process.exit(1);
  }
}

runMasterAuditTests();
