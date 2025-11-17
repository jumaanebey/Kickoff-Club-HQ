const fs = require('fs');
const path = require('path');
const https = require('https');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickoff-club-hq.vercel.app';

async function httpRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {timeout: 10000}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({status: res.statusCode, data, headers: res.headers}));
    }).on('error', reject).on('timeout', () => reject(new Error('Request timeout')));
  });
}

async function prelaunchChecklist() {
  console.log('🚀 PRE-LAUNCH CHECKLIST\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  const results = {
    timestamp: new Date().toISOString(),
    passed: 0,
    failed: 0,
    warnings: 0,
    checks: [],
  };

  function check(name, status, message, severity = 'info') {
    const icons = {passed: '✅', failed: '❌', warning: '⚠️'};
    console.log(`${icons[status]} ${name}`);
    if (message) console.log(`   ${message}`);
    console.log('');

    results.checks.push({name, status, message, severity});
    if (status === 'passed') results.passed++;
    else if (status === 'failed') results.failed++;
    else if (status === 'warning') results.warnings++;
  }

  // 1. Homepage Accessibility
  console.log('🌐 WEBSITE CHECKS:\n');
  try {
    const response = await httpRequest(SITE_URL);
    if (response.status === 200) {
      check('Homepage loads', 'passed', `${SITE_URL} returned 200 OK`);
    } else {
      check('Homepage loads', 'failed', `Got status ${response.status}`, 'critical');
    }
  } catch (error) {
    check('Homepage loads', 'failed', error.message, 'critical');
  }

  // 2. Critical routes
  const routes = ['/auth/sign-in', '/auth/sign-up', '/courses'];
  for (const route of routes) {
    try {
      const response = await httpRequest(`${SITE_URL}${route}`);
      if (response.status === 200 || response.status === 302) {
        check(`Route ${route}`, 'passed', `Accessible`);
      } else {
        check(`Route ${route}`, 'warning', `Got status ${response.status}`);
      }
    } catch (error) {
      check(`Route ${route}`, 'failed', error.message, 'critical');
    }
  }

  // 3. Environment variables
  console.log('🔧 ENVIRONMENT CHECKS:\n');

  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      check(`Env: ${envVar}`, 'passed', 'Set');
    } else {
      check(`Env: ${envVar}`, 'failed', 'Missing', 'critical');
    }
  });

  // 4. Video system
  console.log('🎥 VIDEO SYSTEM CHECKS:\n');

  const videoUrlPath = path.join(__dirname, '../../app/api/video-url/route.ts');
  if (fs.existsSync(videoUrlPath)) {
    check('Video URL API exists', 'passed');

    const content = fs.readFileSync(videoUrlPath, 'utf-8');
    const youtubeVideoCount = (content.match(/youtube\.com\/embed/g) || []).length;

    if (youtubeVideoCount > 0) {
      check('YouTube videos configured', 'passed', `Found ${youtubeVideoCount} references`);
    } else {
      check('YouTube videos configured', 'warning', 'No YouTube embeds found');
    }
  } else {
    check('Video URL API exists', 'failed', 'route.ts not found', 'critical');
  }

  // 5. Free lessons configured
  const freeLesson = path.join(__dirname, '../../app/api/video-url/route.ts');
  if (fs.existsSync(freeLesson)) {
    const content = fs.readFileSync(freeLesson, 'utf-8');
    if (content.includes('FREE_LESSONS')) {
      check('Free lessons configured', 'passed');
    } else {
      check('Free lessons configured', 'warning', 'FREE_LESSONS array not found');
    }
  }

  // 6. YouTube credentials
  console.log('📺 YOUTUBE CHECKS:\n');

  const ytCredsPath = path.join(__dirname, '../../config/youtube-credentials.json');
  const ytTokenPath = path.join(__dirname, '../../config/youtube-token.json');

  if (fs.existsSync(ytCredsPath)) {
    check('YouTube credentials', 'passed');
  } else {
    check('YouTube credentials', 'warning', 'Not configured (optional for launch)');
  }

  if (fs.existsSync(ytTokenPath)) {
    check('YouTube auth token', 'passed');
  } else {
    check('YouTube auth token', 'warning', 'Not configured (optional for launch)');
  }

  // 7. Security headers
  console.log('🔒 SECURITY CHECKS:\n');

  try {
    const response = await httpRequest(SITE_URL);
    const headers = response.headers;

    if (headers['x-frame-options']) {
      check('X-Frame-Options header', 'passed');
    } else {
      check('X-Frame-Options header', 'warning', 'Not set (prevents clickjacking)');
    }

    if (headers['strict-transport-security']) {
      check('HSTS header', 'passed');
    } else {
      check('HSTS header', 'warning', 'Not set (enforces HTTPS)');
    }
  } catch (error) {
    check('Security headers', 'warning', 'Could not verify');
  }

  // 8. Metadata
  try {
    const response = await httpRequest(SITE_URL);
    if (response.data.includes('<meta') && response.data.includes('description')) {
      check('Meta description', 'passed');
    } else {
      check('Meta description', 'warning', 'Not found (important for SEO)');
    }

    if (response.data.includes('og:title') || response.data.includes('twitter:title')) {
      check('Social media tags', 'passed');
    } else {
      check('Social media tags', 'warning', 'Not found (improves sharing)');
    }
  } catch (error) {
    check('Metadata', 'warning', 'Could not verify');
  }

  // Summary
  console.log('══════════════════════════════════════════════════════');
  console.log('\n📊 CHECKLIST SUMMARY\n');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log(`   Total: ${results.checks.length}\n`);

  const criticalIssues = results.checks.filter(c => c.status === 'failed' && c.severity === 'critical');

  if (criticalIssues.length > 0) {
    console.log('🚨 CRITICAL ISSUES - FIX BEFORE LAUNCH:\n');
    criticalIssues.forEach(issue => {
      console.log(`   - ${issue.name}: ${issue.message}`);
    });
    console.log('');
  }

  if (results.failed === 0 && results.warnings === 0) {
    console.log('🎉 ALL CHECKS PASSED! Ready for launch!\n');
  } else if (criticalIssues.length === 0) {
    console.log('✅ No critical issues. Safe to launch!\n');
    console.log('💡 Consider addressing warnings for optimal performance.\n');
  } else {
    console.log('❌ NOT READY FOR LAUNCH. Fix critical issues first.\n');
  }

  // Save results
  const resultsPath = path.join(__dirname, '../../logs/pre-launch-results.json');
  fs.mkdirSync(path.dirname(resultsPath), {recursive: true});
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log(`📁 Results saved to: logs/pre-launch-results.json\n`);

  // Exit code
  if (criticalIssues.length > 0) {
    process.exit(1);
  }
}

prelaunchChecklist();
