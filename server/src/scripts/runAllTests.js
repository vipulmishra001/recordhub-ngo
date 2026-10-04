const { fork } = require('child_process');
const path = require('path');

const testSuites = [
  { name: 'Phase 2: Authentication & RBAC', script: 'testPhase2Auth.js', expected: 17 },
  { name: 'Phase 3A: User Management', script: 'testPhase3Users.js', expected: 23 },
  { name: 'Phase 3B: Student Management', script: 'testPhase3Students.js', expected: 24 },
  { name: 'Phase 3C: Dynamic Program Management', script: 'testPhase3Programs.js', expected: 32 },
];

let currentIndex = 0;
let totalPassed = 0;
let totalExpected = testSuites.reduce((acc, s) => acc + s.expected, 0);

console.log('\n================================================================');
console.log('   RUNNING COMPLETE NGO DIGITAL RECORD SYSTEM TEST SUITE        ');
console.log(`   Target: ${totalExpected} Automated Regression Tests Across 4 Phases`);
console.log('================================================================\n');

function runNextSuite() {
  if (currentIndex >= testSuites.length) {
    console.log('\n================================================================');
    console.log(`GRAND TEST RESULT: ${totalPassed}/${totalExpected} TESTS PASSED SUCCESSFULLY! ✅`);
    console.log('================================================================\n');
    process.exit(0);
  }

  const suite = testSuites[currentIndex];
  const scriptPath = path.join(__dirname, suite.script);

  console.log(`\n▶ Starting [${suite.name}] (${suite.expected} tests)...`);

  const child = fork(scriptPath, [], { stdio: 'inherit' });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Test suite failed: ${suite.name} exited with code ${code}`);
      process.exit(code || 1);
    }
    totalPassed += suite.expected;
    currentIndex++;
    runNextSuite();
  });
}

runNextSuite();
