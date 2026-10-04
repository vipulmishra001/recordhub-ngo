const jwt = require('jsonwebtoken');
const config = require('../config/env');

const BASE_URL = `http://localhost:${config.PORT}/api/v1`;

const results = [];

const record = (num, name, passed, details) => {
  results.push({ num, name, passed, details });
  console.log(`${passed ? '✅' : '❌'} Test ${num.toString().padStart(2, ' ')}: ${name.padEnd(38, ' ')} -> ${passed ? 'PASSED' : 'FAILED'} (${details})`);
};

const apiRequest = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // If not json
  }

  return { status: res.status, ok: res.ok, data };
};

const runTests = async () => {
  console.log('\n================================================================');
  console.log('   RUNNING PHASE 2 AUTHENTICATION & RBAC AUTOMATED TEST SUITE   ');
  console.log('================================================================\n');

  let adminToken = '';
  let staffToken = '';
  let volunteerToken = '';
  let studentToken = '';

  // 1. Admin login
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@ngo.org', password: 'AdminPass123!' })
    });
    adminToken = res.data?.data?.token;
    const ok = res.status === 200 && res.data?.data?.user?.role === 'admin' && !!adminToken;
    record(1, 'Admin login', ok, `HTTP ${res.status}, role=${res.data?.data?.user?.role}`);
  } catch (err) {
    record(1, 'Admin login', false, err.message);
  }

  // 2. Staff login
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'staff@ngo.org', password: 'StaffPassword123!' })
    });
    staffToken = res.data?.data?.token;
    const ok = res.status === 200 && res.data?.data?.user?.role === 'staff' && !!staffToken;
    record(2, 'Staff login', ok, `HTTP ${res.status}, role=${res.data?.data?.user?.role}`);
  } catch (err) {
    record(2, 'Staff login', false, err.message);
  }

  // 3. Volunteer login
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'volunteer@ngo.org', password: 'VolunteerPass123!' })
    });
    volunteerToken = res.data?.data?.token;
    const ok = res.status === 200 && res.data?.data?.user?.role === 'volunteer' && !!volunteerToken;
    record(3, 'Volunteer login', ok, `HTTP ${res.status}, role=${res.data?.data?.user?.role}`);
  } catch (err) {
    record(3, 'Volunteer login', false, err.message);
  }

  // 4. Student login
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'student@ngo.org', password: 'StudentPass123!' })
    });
    studentToken = res.data?.data?.token;
    const ok = res.status === 200 && res.data?.data?.user?.role === 'student' && !!studentToken;
    record(4, 'Student login', ok, `HTTP ${res.status}, role=${res.data?.data?.user?.role}`);
  } catch (err) {
    record(4, 'Student login', false, err.message);
  }

  // 5. Wrong password
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@ngo.org', password: 'WrongPassword999!' })
    });
    const ok = res.status === 401 && res.data?.success === false;
    record(5, 'Wrong password', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(5, 'Wrong password', false, err.message);
  }

  // 6. Non-existent user
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@ngo.org', password: 'Password123!' })
    });
    const ok = res.status === 401 && res.data?.success === false;
    record(6, 'Non-existent user', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(6, 'Non-existent user', false, err.message);
  }

  // 7. Inactive user
  try {
    const res = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'inactive@ngo.org', password: 'InactivePass123!' })
    });
    const ok = res.status === 401 && res.data?.message?.includes('deactivated');
    record(7, 'Inactive user', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(7, 'Inactive user', false, err.message);
  }

  // 8. Missing JWT
  try {
    const res = await apiRequest(`${BASE_URL}/auth/me`);
    const ok = res.status === 401 && res.data?.success === false;
    record(8, 'Missing JWT', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(8, 'Missing JWT', false, err.message);
  }

  // 9. Invalid JWT
  try {
    const res = await apiRequest(`${BASE_URL}/auth/me`, {
      headers: { Authorization: 'Bearer this.is.invalid.jwt' }
    });
    const ok = res.status === 401 && res.data?.success === false;
    record(9, 'Invalid JWT', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(9, 'Invalid JWT', false, err.message);
  }

  // 10. Expired JWT
  try {
    const expiredToken = jwt.sign(
      { id: '6abfe97d5a03f1a9e35b49ff', role: 'admin', email: 'admin@ngo.org' },
      config.JWT_SECRET,
      { expiresIn: '1ms' }
    );
    await new Promise((r) => setTimeout(r, 15));
    const res = await apiRequest(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` }
    });
    const ok = res.status === 401 && res.data?.message?.includes('expired');
    record(10, 'Expired JWT', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(10, 'Expired JWT', false, err.message);
  }

  // 11. Student accessing admin route
  try {
    const res = await apiRequest(`${BASE_URL}/test/admin-only`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const ok = res.status === 403 && res.data?.success === false;
    record(11, 'Student accessing admin route', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(11, 'Student accessing admin route', false, err.message);
  }

  // 12. Volunteer accessing admin route
  try {
    const res = await apiRequest(`${BASE_URL}/test/admin-only`, {
      headers: { Authorization: `Bearer ${volunteerToken}` }
    });
    const ok = res.status === 403 && res.data?.success === false;
    record(12, 'Volunteer accessing admin route', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(12, 'Volunteer accessing admin route', false, err.message);
  }

  // 13. Staff accessing admin-only route
  try {
    const res = await apiRequest(`${BASE_URL}/test/admin-only`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    const ok = res.status === 403 && res.data?.success === false;
    record(13, 'Staff accessing admin-only route', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(13, 'Staff accessing admin-only route', false, err.message);
  }

  // 14. /auth/me
  try {
    const res = await apiRequest(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const user = res.data?.data?.user;
    const ok = res.status === 200 && user?.email === 'admin@ngo.org' && user?.role === 'admin';
    record(14, '/auth/me profile retrieval', ok, `HTTP ${res.status}, email=${user?.email}`);
  } catch (err) {
    record(14, '/auth/me profile retrieval', false, err.message);
  }

  // 15. Change password
  try {
    const res1 = await apiRequest(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({
        currentPassword: 'StaffPassword123!',
        newPassword: 'StaffNewPass456!'
      })
    });

    const res2 = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'staff@ngo.org',
        password: 'StaffNewPass456!'
      })
    });

    // Revert password
    await apiRequest(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${res2.data?.data?.token}` },
      body: JSON.stringify({
        currentPassword: 'StaffNewPass456!',
        newPassword: 'StaffPassword123!'
      })
    });

    const ok = res1.status === 200 && res2.status === 200;
    record(15, 'Change password', ok, 'Password updated & verified via login');
  } catch (err) {
    record(15, 'Change password', false, err.message);
  }

  // 16. Logout
  try {
    const res = await apiRequest(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const ok = res.status === 200 && res.data?.success === true;
    record(16, 'Logout endpoint', ok, `HTTP ${res.status}: ${res.data?.message}`);
  } catch (err) {
    record(16, 'Logout endpoint', false, err.message);
  }

  // 17. Password hash not exposed in responses
  try {
    const loginRes = await apiRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@ngo.org', password: 'AdminPass123!' })
    });
    const meRes = await apiRequest(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginRes.data?.data?.token}` }
    });

    const hasPasswordInLogin = 'password' in (loginRes.data?.data?.user || {});
    const hasPasswordInMe = 'password' in (meRes.data?.data?.user || {});
    const jsonString = JSON.stringify(loginRes.data) + JSON.stringify(meRes.data);
    const hasHashString = jsonString.includes('$2b$') || jsonString.includes('$2a$');

    const ok = !hasPasswordInLogin && !hasPasswordInMe && !hasHashString;
    record(17, 'Password hash not exposed', ok, 'No password field or hash in JSON payload');
  } catch (err) {
    record(17, 'Password hash not exposed', false, err.message);
  }

  console.log('\n================================================================');
  const allPassed = results.every((r) => r.passed);
  console.log(`TEST SUITE RESULT: ${allPassed ? 'ALL 17 TESTS PASSED SUCCESSFULLY! ✅' : 'SOME TESTS FAILED ❌'}`);
  console.log('================================================================\n');

  process.exit(allPassed ? 0 : 1);
};

runTests();
