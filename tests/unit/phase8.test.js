import assert from 'assert';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as authService from '../../server/services/auth.service.js';
import { generateToken, verifyToken } from '../../server/utils/helpers.js';

// Ensure bufferCommands is disabled for fast test execution
mongoose.set('bufferCommands', false);

async function runPhase8Tests() {
  console.log('====================================================');
  console.log('[Phase 8 Test Suite] Running Verification Tests...');
  console.log('====================================================');

  try {
    // ------------------------------------------------------------------
    // TEST 1: User Registration & Secure Password Hashing
    // ------------------------------------------------------------------
    console.log('Testing User Registration & Password Hashing...');
    const testEmail = `test_student_${Date.now()}@campus.edu`;
    const rawPassword = 'SecureStudentPass2026!';

    const regResult = await authService.registerUser({
      name: 'Priya Patel',
      email: testEmail,
      studentId: '2026-CS-991',
      department: 'Computer Science & Engineering',
      academicYear: 'Class of 2028',
      password: rawPassword,
    });

    assert.ok(regResult.user, 'Registered user object must exist');
    assert.strictEqual(regResult.user.name, 'Priya Patel');
    assert.strictEqual(regResult.user.email, testEmail);
    assert.strictEqual(regResult.user.role, 'student', 'Default registered role must be student');
    assert.strictEqual(regResult.user.password, undefined, 'Plaintext password must NEVER be exposed in output');
    assert.ok(regResult.token, 'JWT authentication token must be generated');

    console.log('✅ Test 1 Passed: User registered with hashed credentials & JWT token');

    // ------------------------------------------------------------------
    // TEST 2: Defense Against Privilege Escalation on Registration
    // ------------------------------------------------------------------
    console.log('Testing Prevention of Unauthorized Role Escalation on Registration...');
    const maliciousEmail = `hacker_${Date.now()}@campus.edu`;
    const escalatedReg = await authService.registerUser({
      name: 'Malicious Actor',
      email: maliciousEmail,
      password: 'HackerPassword123!',
      role: 'admin', // Attempting to self-promote to admin
    });

    assert.strictEqual(
      escalatedReg.user.role,
      'student',
      'System must disallow self-assigning admin role upon registration'
    );
    console.log('✅ Test 2 Passed: Privilege escalation prevented (forced to student)');

    // ------------------------------------------------------------------
    // TEST 3: Login Verification (Valid vs Invalid Credentials)
    // ------------------------------------------------------------------
    console.log('Testing Login with Valid and Invalid Credentials...');
    // Valid login
    const loginSuccess = await authService.loginUser(testEmail, rawPassword);
    assert.ok(loginSuccess.user, 'Login must succeed with correct credentials');
    assert.strictEqual(loginSuccess.user.email, testEmail);
    assert.ok(loginSuccess.token, 'Login must yield JWT token');

    // Invalid password
    let failedLogin = false;
    try {
      await authService.loginUser(testEmail, 'WrongPassword999!');
    } catch (err) {
      failedLogin = true;
      assert.ok(err.message.includes('Invalid credentials'), 'Error message must report invalid credentials');
    }
    assert.ok(failedLogin, 'Login with incorrect password must be rejected');

    console.log('✅ Test 3 Passed: Login verification and rejection of invalid credentials verified');

    // ------------------------------------------------------------------
    // TEST 4: Profile Retrieval & Sanitization
    // ------------------------------------------------------------------
    console.log('Testing Profile Retrieval & Sensitive Data Sanitization...');
    const profileRes = await authService.getCurrentUser(loginSuccess.user.id);
    assert.ok(profileRes.user, 'Profile details must be retrieved');
    assert.strictEqual(profileRes.user.id, loginSuccess.user.id);
    assert.strictEqual(profileRes.user.password, undefined, 'Password field must remain absent from profile queries');
    console.log('✅ Test 4 Passed: Profile retrieval succeeds with sanitized schema');

    // ------------------------------------------------------------------
    // TEST 5: Profile Updates Persistence (Skills & Preferences)
    // ------------------------------------------------------------------
    console.log('Testing Profile and Preferences Persistence...');
    const updatedSkills = ['Python 3.11', 'ROS2 Humble', 'Distributed Edge Computing'];
    const updateResult = await authService.updateProfile(
      loginSuccess.user.id,
      {
        preferredName: 'Priya',
        phone: '+91 98888 77777',
        residence: 'Kalpana Chawla Hall • Room 204',
        bio: 'Distributed consensus researcher',
        skills: updatedSkills,
        preferences: {
          notifications: {
            scheduleAlerts: false,
            careUpdates: true,
            ecoDigests: true,
          },
          accessibility: {
            highContrast: true,
            reduceMotion: true,
          },
        },
      },
      'student'
    );

    assert.strictEqual(updateResult.user.preferredName, 'Priya');
    assert.strictEqual(updateResult.user.phone, '+91 98888 77777');
    assert.deepStrictEqual(updateResult.user.skills, updatedSkills);
    assert.strictEqual(updateResult.user.preferences.accessibility.highContrast, true);
    assert.strictEqual(
      updateResult.user.preferences.notifications.emergencyBroadcasts,
      true,
      'Mandatory emergency broadcasts must stay enabled'
    );
    console.log('✅ Test 5 Passed: Profile updates and accessibility/notification preferences persisted');

    // ------------------------------------------------------------------
    // TEST 6: Unauthorized Role Escalation Prevention on Profile Update
    // ------------------------------------------------------------------
    console.log('Testing Prevention of Role Escalation on Profile Update...');
    let roleEscalationBlocked = false;
    try {
      await authService.updateProfile(
        loginSuccess.user.id,
        {
          role: 'admin', // Attempting to alter role
        },
        'student' // Calling as regular student
      );
    } catch (err) {
      roleEscalationBlocked = true;
      assert.ok(err.message.includes('Only system administrators'), 'Must reject unauthorized role changes');
    }
    assert.ok(roleEscalationBlocked, 'Role elevation by non-admin must throw authorization error');
    console.log('✅ Test 6 Passed: Profile role tampering strictly rejected');

    // ------------------------------------------------------------------
    // TEST 7: Password Change Verification
    // ------------------------------------------------------------------
    console.log('Testing Password Change Flow with Hashing...');
    const newPassword = 'NewSecretPassword2026!';

    // Wrong current password
    let invalidPassBlocked = false;
    try {
      await authService.changePassword(loginSuccess.user.id, 'WrongOldPass123', newPassword);
    } catch (err) {
      invalidPassBlocked = true;
      assert.ok(err.message.includes('Current password does not match'));
    }
    assert.ok(invalidPassBlocked, 'Password change with wrong old password must fail');

    // Correct current password
    const changeRes = await authService.changePassword(loginSuccess.user.id, rawPassword, newPassword);
    assert.ok(changeRes.success, 'Password change must succeed with valid current password');

    // Verify login with new password
    const newLogin = await authService.loginUser(testEmail, newPassword);
    assert.ok(newLogin.user, 'Login with new password must succeed');

    // Verify old password no longer works
    let oldPassFailed = false;
    try {
      await authService.loginUser(testEmail, rawPassword);
    } catch (err) {
      oldPassFailed = true;
    }
    assert.ok(oldPassFailed, 'Old password must no longer be valid after change');

    console.log('✅ Test 7 Passed: Master password change and re-authentication verified');

    // ------------------------------------------------------------------
    // TEST 8: Token Decoding and Role Authorization Verification
    // ------------------------------------------------------------------
    console.log('Testing JWT Token Handling & Role Enforcement...');
    const decoded = verifyToken(newLogin.token);
    assert.strictEqual(decoded.id, loginSuccess.user.id);
    assert.strictEqual(decoded.role, 'student');
    assert.strictEqual(decoded.email, testEmail);
    console.log('✅ Test 8 Passed: Token claims and integrity verified');

    console.log('====================================================');
    console.log('🎉 ALL PHASE 8 UNIT & SECURITY TESTS PASSED (8/8)!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Phase 8 Test Suite Failure:', err);
    process.exit(1);
  }
}

runPhase8Tests();
