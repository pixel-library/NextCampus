import assert from 'assert';
import mongoose from 'mongoose';
mongoose.set('bufferCommands', false);
import * as campusService from '../../server/services/campus.service.js';
import * as roomService from '../../server/services/room.service.js';
import * as careService from '../../server/services/care.service.js';
import { generateToken, verifyToken } from '../../server/utils/helpers.js';


export const runPhase7Tests = async () => {
  console.log('====================================================');
  console.log('[Phase 7 Test Suite] Running Verification Tests...');
  console.log('====================================================');

  // Test 1: Campus Management - Building Creation & Retrieval
  console.log('Testing Campus Management - Building Creation...');
  const testBuilding = await campusService.createLocation({
    name: 'Ada Lovelace Tech Pavilion',
    code: 'TEST-L01',
    category: 'academic',
    precinct: 'North Quadrangle',
    totalFloors: 3,
    grossFloorArea: 12500,
    departments: ['Bio-Informatics', 'Quantum Simulation'],
  });

  assert(testBuilding, 'Building should be created');
  assert.strictEqual(testBuilding.code, 'TEST-L01');
  console.log('✅ Test 1 Passed: Building created successfully');

  // Test 2: Room Creation linked to Building
  console.log('Testing Room Management - Creation with Dependent Reference...');
  const testRoom = await roomService.createRoom({
    roomNumber: 'L-101',
    name: 'Quantum Optics Simulation Suite',
    building: 'Ada Lovelace Tech Pavilion',
    buildingCode: 'TEST-L01',
    floor: 'Level 1',
    type: 'Smart Classrooms',
    capacity: 35,
    features: ['Dual 4K Laser Projector', 'Quantum Rig', 'NFC Smart Lock'],
  });

  assert(testRoom, 'Room should be created');
  assert.strictEqual(testRoom.roomNumber, 'L-101');
  console.log('✅ Test 2 Passed: Room created and linked to facility');

  // Test 3: Dependent-Record Deletion Safety
  console.log('Testing Dependent-Record Validation on Facility Deletion...');
  const safeDeleteAttempt = await campusService.deleteLocation('TEST-L01', false);
  // Should reject deletion due to dependent room L-101
  assert(safeDeleteAttempt, 'Delete attempt should return result');
  assert.strictEqual(safeDeleteAttempt.success, false, 'Non-cascade deletion must fail when rooms exist');
  assert.strictEqual(safeDeleteAttempt.conflict, true, 'Conflict flag must be true');
  console.log('✅ Test 3 Passed: Safe deletion prevented removing facility with dependent rooms');

  // Test 4: Cascade Deletion Handling
  console.log('Testing Confirmed Cascade Deletion...');
  const cascadeDeleteResult = await campusService.deleteLocation('TEST-L01', true);
  assert.strictEqual(cascadeDeleteResult.success, true, 'Cascade deletion should succeed');
  console.log('✅ Test 4 Passed: Facility and dependent rooms cascade-deleted safely');

  // Test 5: Complaint Administration - Assignment & Status Update
  console.log('Testing Complaint Administration - Staff Assignment & Status Persistence...');
  const testComplaint = await careService.createComplaint({
    title: 'Lab Air Flow Damper Stuck',
    category: 'hvac',
    priority: 'high',
    location: 'Alan Turing Hall Room B-204',
    description: 'Chamber air pressure differential warning.',
    authorName: 'Faculty Dean',
  });

  assert(testComplaint, 'Complaint ticket should be lodged');
  const assigned = await careService.assignStaff(
    testComplaint._id || testComplaint.ticketId,
    'tech_42',
    'Marcus Vance',
    'Dr. Eleanor Vance'
  );
  assert(assigned, 'Assignment must succeed');
  assert.strictEqual(assigned.assignedToName, 'Marcus Vance', 'Technician must be persisted');

  const updatedStatus = await careService.updateComplaintStatus(
    testComplaint._id || testComplaint.ticketId,
    'in_progress',
    'Hardware inspection started',
    'Marcus Vance'
  );
  assert.strictEqual(updatedStatus.status, 'in_progress', 'Status must be updated');
  console.log('✅ Test 5 Passed: Complaint assigned and status persisted with audit updates');

  // Test 6: Note Privacy & Student Sanitization (CRITICAL SECURITY CHECK)
  console.log('Testing Internal Notes Privacy - Strict Student Separation...');
  const confidentialNote = 'CONFIDENTIAL: Damper coil short-circuited; warranty claim #W-981 filed.';
  await careService.addInternalNote(
    testComplaint._id || testComplaint.ticketId,
    confidentialNote,
    'admin_1',
    'Dr. Eleanor Vance (SuperAdmin)'
  );

  await careService.addPublicUpdate(
    testComplaint._id || testComplaint.ticketId,
    'Technician dispatched with diagnostic tools.',
    'Operations Dispatch'
  );

  // Retrieve as ADMIN
  const adminView = await careService.getComplaintById(testComplaint._id || testComplaint.ticketId, true);
  assert(adminView.internalNotes, 'Admin MUST have access to internal notes');
  assert(
    adminView.internalNotes.some((n) => n.note.includes('CONFIDENTIAL')),
    'Admin should see confidential notes'
  );

  // Retrieve as STUDENT (isAdmin = false)
  const studentView = await careService.getComplaintById(testComplaint._id || testComplaint.ticketId, false);
  assert(
    !studentView.internalNotes || studentView.internalNotes.length === 0,
    'STUDENT VIEW MUST NEVER CONTAIN INTERNAL NOTES'
  );
  assert.strictEqual(studentView.internalNotes, undefined, 'internalNotes field must be stripped for students');
  console.log('✅ Test 6 Passed: Internal administrative notes NEVER leak into student responses');

  // Test 7: RBAC Authorization & Token Generation
  console.log('Testing Role-Based Security Tokens...');
  const studentToken = generateToken({ id: 's1', role: 'student' });
  const adminToken = generateToken({ id: 'a1', role: 'admin' });

  const decodedStudent = verifyToken(studentToken);
  const decodedAdmin = verifyToken(adminToken);

  assert.strictEqual(decodedStudent.role, 'student', 'Student token verified');
  assert.strictEqual(decodedAdmin.role, 'admin', 'Admin token verified');
  console.log('✅ Test 7 Passed: Role-based authorization tokens verified');

  console.log('====================================================');
  console.log('🎉 ALL PHASE 7 UNIT & SECURITY TESTS PASSED (7/7)!');
  console.log('====================================================');
};

runPhase7Tests().catch((err) => {
  console.error('❌ Phase 7 Tests FAILED:', err);
  process.exit(1);
});
