const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickoff-club-hq.vercel.app';
const ALERT_THRESHOLD = 3; // Number of consecutive failures before alert

async function checkSite(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    https.get(url, {timeout: 10000}, (res) => {
      const responseTime = Date.now() - startTime;
      res.on('data', () => {});
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    }).on('error', (error) => {
      resolve({
        status: 0,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message,
      });
    }).on('timeout', () => {
      resolve({
        status: 0,
        responseTime: 10000,
        success: false,
        error: 'Request timeout',
      });
    });
  });
}

async function uptimeMonitor() {
  const timestamp = new Date().toISOString();
  const logPath = path.join(__dirname, '../../logs/uptime-history.json');

  // Load history
  let history = [];
  if (fs.existsSync(logPath)) {
    history = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  }

  // Check site
  const result = await checkSite(SITE_URL);

  // Log result
  const entry = {
    timestamp,
    url: SITE_URL,
    ...result,
  };

  history.push(entry);

  // Keep only last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  history = history.filter(h => new Date(h.timestamp) > sevenDaysAgo);

  // Save history
  fs.mkdirSync(path.dirname(logPath), {recursive: true});
  fs.writeFileSync(logPath, JSON.stringify(history, null, 2));

  // Check for consecutive failures
  const recentChecks = history.slice(-ALERT_THRESHOLD);
  const consecutiveFailures = recentChecks.every(check => !check.success);

  if (result.success) {
    console.log(`✅ ${SITE_URL} is UP`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Response Time: ${result.responseTime}ms`);
  } else {
    console.log(`❌ ${SITE_URL} is DOWN`);
    console.log(`   Error: ${result.error || 'Unknown'}`);
    console.log(`   Response Time: ${result.responseTime}ms`);
  }

  if (consecutiveFailures) {
    console.log(`\n🚨 ALERT: Site has been down for ${ALERT_THRESHOLD} consecutive checks!`);
    console.log(`   Please investigate immediately.\n`);

    // Save alert
    const alertPath = path.join(__dirname, '../../logs/uptime-alerts.log');
    const alertMsg = `[${timestamp}] SITE DOWN: ${ALERT_THRESHOLD} consecutive failures\n`;
    fs.appendFileSync(alertPath, alertMsg);

    process.exit(1);
  }

  // Calculate uptime percentage (last 24 hours)
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  const last24Hours = history.filter(h => new Date(h.timestamp) > twentyFourHoursAgo);

  if (last24Hours.length > 0) {
    const successCount = last24Hours.filter(h => h.success).length;
    const uptime = ((successCount / last24Hours.length) * 100).toFixed(2);
    const avgResponseTime = (last24Hours.reduce((sum, h) => sum + h.responseTime, 0) / last24Hours.length).toFixed(0);

    console.log(`\n📊 Last 24 Hours:`);
    console.log(`   Uptime: ${uptime}%`);
    console.log(`   Checks: ${last24Hours.length}`);
    console.log(`   Avg Response Time: ${avgResponseTime}ms\n`);
  }
}

uptimeMonitor();
