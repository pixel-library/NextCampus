import { generateToken, verifyToken } from '../../server/utils/helpers.js';

/**
 * Basic Unit Test Suite for JWT Token Helper Functions
 */
export const runAuthTests = () => {
  console.log('[Test Suite] Running Authentication Unit Tests...');

  const payload = { id: 'test_user_123', role: 'student', email: 'test@nextcampus.edu' };
  const token = generateToken(payload);

  if (!token || typeof token !== 'string') {
    throw new Error('FAILED: generateToken did not return a valid string token');
  }

  const decoded = verifyToken(token);
  if (decoded.id !== payload.id || decoded.role !== payload.role) {
    throw new Error('FAILED: verifyToken payload mismatch');
  }

  console.log('✅ Auth Token Unit Test PASSED');
};

runAuthTests();
