/**
 * ==========================================================================
 * ENTERPRISE REAL-TIME VISITOR ANALYTICS & SECURITY CONSOLE (LIVE TICKING)
 * ==========================================================================
 */
export function initAdminPanel() {
  if (document.getElementById('secret-admin-trigger')) return;

  const adminBtn = document.createElement('button');
  adminBtn.id = 'secret-admin-trigger';
  adminBtn.title = "Admin Security Console";
  adminBtn.innerHTML = `<span style="font-family: inherit; font-weight: 700; font-size: 13px;">A</span>`;
  
  Object.assign(adminBtn.style, {
    position: 'fixed', bottom: '20px', left: '20px', width: '32px', height: '32px',
    borderRadius: '50%', background: '#14151c', border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff', cursor: 'pointer', zIndex: '999998', display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    transition: 'all 0.2s ease'
  });

  adminBtn.addEventListener('mouseenter', () => {
    adminBtn.style.borderColor = '#33b5ff';
    adminBtn.style.transform = 'scale(1.1)';
  });
  adminBtn.addEventListener('mouseleave', () => {
    adminBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    adminBtn.style.transform = 'scale(1)';
  });

  document.body.appendChild(adminBtn);

  trackAndCheckVisitor();
  startVisitorHeartbeat();
  startLiveSessionTicker(); // Live UI timer ticker

  if (!document.getElementById('admin-console-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'admin-console-styles';
    styleEl.textContent = `
      .admin-table-row { border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.15s ease; cursor: pointer; }
      .admin-table-row:hover { background: rgba(255,255,255,0.03); }
      .admin-input-field { background: #14151c; border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; }
      .admin-input-field:focus { border-color: rgba(255,255,255,0.4); }
      .admin-btn { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.12); padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
      .admin-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); }
      
      #visitor-detail-drawer {
        position: fixed; top: 0; right: -500px; width: 460px; max-width: 100vw; height: 100vh;
        background: #111218; border-left: 1px solid rgba(255,255,255,0.12); z-index: 10000000;
        box-shadow: -20px 0 50px rgba(0,0,0,0.8); transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; flex-direction: column; box-sizing: border-box; overflow-y: auto; color: #ddd; font-size: 13px;
      }
      #visitor-detail-drawer.is-open { right: 0; }
      
      @media(max-width: 768px) {
        .desktop-table-view { display: none !important; }
        .mobile-card-view { display: flex !important; }
      }
      @media(min-width: 769px) {
        .mobile-card-view { display: none !important; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  const overlay = document.createElement('div');
  overlay.id = 'secret-admin-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    backgroundColor: '#0a0a0f', zIndex: '9999999', display: 'none',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '20px', fontFamily: 'inherit', boxSizing: 'border-box', overflowY: 'auto'
  });

  overlay.innerHTML = `
    <div id="admin-gate-view" style="max-width: 420px; width: 100%; text-align: center;">
      <div style="font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 8px;">This is admin access only. Go back.</div>
      <div style="font-size: 12px; color: #666; margin-bottom: 24px;">(its on final version to publish)</div>
      
      <input type="text" id="admin-secret-input" placeholder="..." class="admin-input-field" style="width: 100%; text-align: center; margin-bottom: 12px; box-sizing: border-box;" autocomplete="off" />
      <button id="admin-back-btn" class="admin-btn" style="width: 100%; color: #888;">Go Back</button>
    </div>

    <div id="admin-dashboard-view" style="display: none; max-width: 1350px; width: 100%; background: #14151c; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.9); max-height: 94vh; flex-direction: column; box-sizing: border-box;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 14px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #fff;">SECURITY & TELEMETRY CONSOLE</span>
          <span style="font-size: 11px; background: rgba(0,255,128,0.1); color: #00ff80; border: 1px solid rgba(0,255,128,0.3); padding: 3px 8px; border-radius: 20px;">LIVE ACTIVE</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button id="export-csv-btn" class="admin-btn" style="background: rgba(0,128,255,0.1); color: #33b5ff; border-color: rgba(0,128,255,0.3);">Export CSV</button>
          <button id="clear-logs-btn" class="admin-btn" style="background: rgba(255,77,77,0.1); color: #ff4d4d; border-color: rgba(255,77,77,0.3);">Clear Logs</button>
          <button id="admin-close-dash" class="admin-btn" style="font-size: 16px; padding: 2px 10px;">&times;</button>
        </div>
      </div>

      <div id="analytics-summary-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px;"></div>

      <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;">
        <input type="text" id="visitor-search-input" placeholder="Search IP, city, device, page..." class="admin-input-field" style="flex: 1; min-width: 220px;" />
        
        <select id="filter-status" class="admin-input-field" style="cursor: pointer;">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="IDLE">Idle</option>
          <option value="OFFLINE">Offline</option>
        </select>

        <select id="filter-device" class="admin-input-field" style="cursor: pointer;">
          <option value="">All Devices</option>
          <option value="Desktop">Desktop</option>
          <option value="Mobile">Mobile</option>
          <option value="Tablet">Tablet</option>
        </select>

        <select id="sort-visitors-by" class="admin-input-field" style="cursor: pointer;">
          <option value="newest">Newest Visitor</option>
          <option value="oldest">Oldest Visitor</option>
          <option value="activity">Last Activity</option>
          <option value="session">Longest Session</option>
          <option value="pages">Most Pages Viewed</option>
        </select>
      </div>

      <div style="overflow-y: auto; flex-grow: 1; max-height: 52vh; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;">
        <table class="desktop-table-view" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; color: #ccc;">
          <thead style="position: sticky; top: 0; background: #181922; z-index: 10;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #888; text-transform: uppercase; font-size: 11px;">
              <th style="padding: 12px 10px;">SN</th>
              <th style="padding: 12px 10px;">Status</th>
              <th style="padding: 12px 10px;">IP Address</th>
              <th style="padding: 12px 10px;">Location</th>
              <th style="padding: 12px 10px;">Device / OS</th>
              <th style="padding: 12px 10px;">Browser</th>
              <th style="padding: 12px 10px;">Current Page</th>
              <th style="padding: 12px 10px;">Session Time</th>
              <th style="padding: 12px 10px; text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody id="visitor-table-body"></tbody>
        </table>

        <div class="mobile-card-view" id="visitor-mobile-list" style="flex-direction: column; gap: 10px; padding: 12px; display: none;"></div>
      </div>
    </div>
  `;

  const drawer = document.createElement('div');
  drawer.id = 'visitor-detail-drawer';
  drawer.innerHTML = `<div id="drawer-content-inner" style="padding: 24px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;"></div>`;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  adminBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    document.getElementById('admin-gate-view').style.display = 'block';
    document.getElementById('admin-dashboard-view').style.display = 'none';
    const secretInput = document.getElementById('admin-secret-input');
    secretInput.value = '';
    secretInput.focus();
  });

  document.getElementById('admin-back-btn').addEventListener('click', () => { overlay.style.display = 'none'; closeVisitorDrawer(); });
  document.getElementById('admin-close-dash').addEventListener('click', () => { overlay.style.display = 'none'; closeVisitorDrawer(); });

  const secretInput = document.getElementById('admin-secret-input');
  secretInput.addEventListener('input', (e) => {
    if (e.target.value.toLowerCase().trim() === 'har har mahadev') {
      document.getElementById('admin-gate-view').style.display = 'none';
      document.getElementById('admin-dashboard-view').style.display = 'flex';
      renderDashboard();
    }
  });

  document.getElementById('visitor-search-input').addEventListener('input', renderDashboard);
  document.getElementById('filter-status').addEventListener('change', renderDashboard);
  document.getElementById('filter-device').addEventListener('change', renderDashboard);
  document.getElementById('sort-visitors-by').addEventListener('change', renderDashboard);

  document.getElementById('clear-logs-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all recorded visitor telemetry logs?")) {
      localStorage.removeItem('ar_visitor_logs');
      renderDashboard();
    }
  });

  document.getElementById('export-csv-btn').addEventListener('click', exportVisitorLogsCSV);
}

// ============================================================================
// TELEMETRY & HEARTBEAT ENGINE
// ============================================================================
async function trackAndCheckVisitor() {
  const blockedList = JSON.parse(localStorage.getItem('ar_blocked_ips') || '[]');
  let ipData = { ip: '127.0.0.1', city: 'Unknown City', region: 'Unknown Region', country_name: 'Unknown Country', org: 'Local Network' };
  
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      ipData.ip = data.ip || data.query || '127.0.0.1';
      ipData.city = data.city || 'Unknown City';
      ipData.region = data.region || '';
      ipData.country_name = data.country_name || data.country || 'Unknown Country';
      ipData.org = data.org || data.asn || 'Local Provider';
    }
  } catch (e) {}

  const visitorIP = ipData.ip;

  if (blockedList.includes(visitorIP)) {
    document.body.innerHTML = `
      <div style="background: #0a0a0f; color: #fff; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
        <div style="color: #ff4d4d; font-size: 18px; font-weight: bold; margin-bottom: 10px;">ACCESS PERMANENTLY BLOCKED</div>
        <div style="color: #888; font-size: 14px;">Your device or IP address has been restricted by the administrator.</div>
      </div>
    `;
    return;
  }

  const ua = navigator.userAgent;
  let deviceType = /mobile/i.test(ua) ? 'Mobile' : (/tablet/i.test(ua) ? 'Tablet' : 'Desktop');
  let os = /windows/i.test(ua) ? 'Windows' : (/mac/i.test(ua) ? 'MacOS' : (/android/i.test(ua) ? 'Android' : (/iphone|ipad/i.test(ua) ? 'iOS' : 'Linux')));
  let browser = /chrome/i.test(ua) && !/edge|opr/i.test(ua) ? 'Google Chrome' : (/safari/i.test(ua) && !/chrome/i.test(ua) ? 'Apple Safari' : (/firefox/i.test(ua) ? 'Mozilla Firefox' : 'Other Browser'));

  let logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
  let existing = logs.find(l => l && l.ip === visitorIP);

  const now = Date.now();
  const currentPath = window.location.pathname && window.location.pathname.trim() !== '' ? window.location.pathname : '/';
  const locationString = ipData.region ? `${ipData.city}, ${ipData.region}, ${ipData.country_name}` : `${ipData.city}, ${ipData.country_name}`;

  if (existing) {
    existing.lastActivity = now;
    existing.status = 'ACTIVE';
    existing.currentPage = currentPath;
    existing.device = existing.device || deviceType;
    existing.os = existing.os || os;
    existing.browser = existing.browser || browser;
    existing.deviceModel = existing.deviceModel || `${deviceType} (${os})`;
    existing.location = existing.location || locationString;
    if (!existing.sessionStart) existing.sessionStart = now; // Preserve original session start
    
    if (!existing.pagesViewedList) existing.pagesViewedList = [currentPath];
    if (!existing.pagesViewedList.includes(currentPath)) {
      existing.pagesViewedList.push(currentPath);
      existing.pagesViewed = existing.pagesViewedList.length;
    }
  } else {
    const newRecord = {
      sessionId: 'SID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ip: visitorIP,
      city: ipData.city,
      region: ipData.region,
      country: ipData.country_name,
      location: locationString,
      isp: ipData.org,
      device: deviceType,
      os: os,
      deviceModel: `${deviceType} (${os})`,
      browser: browser,
      screenResolution: `${window.innerWidth}px × ${window.innerHeight}px`,
      language: navigator.language || 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      connectionType: navigator.connection?.effectiveType ? navigator.connection.effectiveType.toUpperCase() : 'Unavailable',
      currentPage: currentPath,
      entryPage: currentPath,
      referrer: document.referrer || 'Direct / Bookmark',
      firstSeen: now,
      lastActivity: now,
      sessionStart: now,
      pagesViewedList: [currentPath],
      pagesViewed: 1,
      status: 'ACTIVE',
      activityTimeline: ['Visitor arrived', `Opened ${currentPath}`]
    };
    logs.unshift(newRecord);
  }

  logs = logs.filter(l => l && l.ip);
  if (logs.length > 50) logs = logs.slice(0, 50);
  
  localStorage.setItem('ar_visitor_logs', JSON.stringify(logs));
}

function startVisitorHeartbeat() {
  setInterval(() => {
    let logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
    const now = Date.now();
    let updated = false;

    logs.forEach(log => {
      if (!log) return;
      const lastAct = log.lastActivity || now;
      const inactiveTime = now - lastAct;
      if (inactiveTime > 60000) {
        if (log.status !== 'OFFLINE') { log.status = 'OFFLINE'; updated = true; }
      } else if (inactiveTime > 20000) {
        if (log.status !== 'IDLE') { log.status = 'IDLE'; updated = true; }
      }
    });

    if (updated) {
      localStorage.setItem('ar_visitor_logs', JSON.stringify(logs));
      const dashView = document.getElementById('admin-dashboard-view');
      if (dashView && dashView.style.display === 'flex') {
        renderDashboard();
      }
    }
  }, 5000);
}

// ============================================================================
// LIVE TICKING ENGINE (CONTINUOUS SECOND-BY-SECOND UPDATE)
// ============================================================================
function startLiveSessionTicker() {
  setInterval(() => {
    const dashView = document.getElementById('admin-dashboard-view');
    if (!dashView || dashView.style.display !== 'flex') return;

    // Update table rows session timers directly without re-rendering everything
    const rows = document.querySelectorAll('.admin-table-row');
    rows.forEach(row => {
      const sessionIdAttr = row.getAttribute('data-session-id');
      if (!sessionIdAttr) return;
      
      const logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
      const visitor = logs.find(l => l && l.sessionId === sessionIdAttr);
      if (!visitor) return;

      const sessionSec = Math.floor((Date.now() - (visitor.sessionStart || Date.now())) / 1000);
      const sMins = Math.floor(sessionSec / 60);
      const sSecs = sessionSec % 60;

      const timeCell = row.querySelector('.session-time-cell');
      if (timeCell) {
        timeCell.textContent = `${sMins}m ${sSecs}s`;
      }
    });
  }, 1000);
}

// ============================================================================
// DASHBOARD RENDERING & ANALYTICS CARDS
// ============================================================================
function renderDashboard() {
  let logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
  logs = logs.filter(l => l && l.ip);
  const blockedList = JSON.parse(localStorage.getItem('ar_blocked_ips') || '[]');

  const totalToday = logs.filter(l => (Date.now() - (l.firstSeen || Date.now())) < 86400000).length;
  const activeCount = logs.filter(l => l.status === 'ACTIVE').length;
  const totalPageViews = logs.reduce((sum, l) => sum + (l.pagesViewed || 1), 0);
  const uniqueCountries = new Set(logs.map(l => l.country || 'Unknown')).size;
  
  const avgDurationSec = logs.length ? Math.floor(logs.reduce((sum, l) => sum + ((Date.now() - (l.sessionStart || Date.now())) / 1000), 0) / logs.length) : 0;
  const avgMins = Math.floor(avgDurationSec / 60);
  const avgSecs = avgDurationSec % 60;

  let pageCounts = {};
  logs.forEach(l => {
    (l.pagesViewedList || [l.currentPage || '/']).forEach(p => { pageCounts[p] = (pageCounts[p] || 0) + 1; });
  });
  let mostViewedPage = Object.keys(pageCounts).length ? Object.keys(pageCounts).reduce((a, b) => pageCounts[a] > pageCounts[b] ? a : b) : '/';

  const summaryCardsEl = document.getElementById('analytics-summary-cards');
  if (summaryCardsEl) {
    summaryCardsEl.innerHTML = `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888; text-transform: uppercase;">Live Visitors</div>
        <div style="font-size: 20px; font-weight: bold; color: #00ff80; margin-top: 4px;">🟢 ${activeCount}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888; text-transform: uppercase;">Visitors Today</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff; margin-top: 4px;">👥 ${totalToday}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888; text-transform: uppercase;">Total Page Views</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff; margin-top: 4px;">📄 ${totalPageViews}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888; text-transform: uppercase;">Countries</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff; margin-top: 4px;">🌎 ${uniqueCountries}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888; text-transform: uppercase;">Avg Session</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff; margin-top: 4px;">⏱️ ${avgMins}m ${avgSecs}s</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888; text-transform: uppercase;">Most Viewed Page</div>
        <div style="font-size: 14px; font-weight: bold; color: #33b5ff; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${mostViewedPage}">🔥 ${mostViewedPage}</div>
      </div>
    `;
  }

  const searchQuery = (document.getElementById('visitor-search-input')?.value || '').toLowerCase();
  const filterStatus = document.getElementById('filter-status')?.value || '';
  const filterDevice = document.getElementById('filter-device')?.value || '';
  const sortBy = document.getElementById('sort-visitors-by')?.value || 'newest';

  let filtered = logs.filter(log => {
    const matchSearch = !searchQuery || 
      (log.ip && log.ip.toLowerCase().includes(searchQuery)) ||
      (log.city && log.city.toLowerCase().includes(searchQuery)) ||
      (log.country && log.country.toLowerCase().includes(searchQuery)) ||
      (log.browser && log.browser.toLowerCase().includes(searchQuery)) ||
      (log.os && log.os.toLowerCase().includes(searchQuery)) ||
      (log.currentPage && log.currentPage.toLowerCase().includes(searchQuery)) ||
      (log.referrer && log.referrer.toLowerCase().includes(searchQuery)) ||
      (log.sessionId && log.sessionId.toLowerCase().includes(searchQuery));

    const matchStatus = !filterStatus || log.status === filterStatus;
    const matchDevice = !filterDevice || log.device === filterDevice;

    return matchSearch && matchStatus && matchDevice;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'oldest') return (a.firstSeen || 0) - (b.firstSeen || 0);
    if (sortBy === 'activity') return (b.lastActivity || 0) - (a.lastActivity || 0);
    if (sortBy === 'session') return ((b.lastActivity || 0) - (b.sessionStart || 0)) - ((a.lastActivity || 0) - (a.sessionStart || 0));
    if (sortBy === 'pages') return (b.pagesViewed || 1) - (a.pagesViewed || 1);
    return (b.firstSeen || 0) - (a.firstSeen || 0);
  });

  const tbody = document.getElementById('visitor-table-body');
  const mobileList = document.getElementById('visitor-mobile-list');

  if (!tbody || !mobileList) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding: 25px; text-align: center; color: #888;">No matching visitor records found.</td></tr>`;
    mobileList.innerHTML = `<div style="text-align: center; color: #888; padding: 20px;">No matching visitors found.</div>`;
    return;
  }

  tbody.innerHTML = filtered.map((log, index) => {
    const isBlocked = blockedList.includes(log.ip);
    const sessionSec = Math.floor((Date.now() - (log.sessionStart || Date.now())) / 1000);
    const sMins = Math.floor(sessionSec / 60);
    const sSecs = sessionSec % 60;
    const statusVal = log.status || 'ACTIVE';
    const statusColor = statusVal === 'ACTIVE' ? '#00ff80' : (statusVal === 'IDLE' ? '#ffcc00' : '#888');

    return `
      <tr class="admin-table-row" data-session-id="${log.sessionId}" onclick="window.openVisitorDrawer('${log.sessionId}')">
        <td style="padding: 12px 10px; color: #888;">${index + 1}</td>
        <td style="padding: 12px 10px;">
          <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: ${statusColor};">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${statusColor}; box-shadow: 0 0 8px ${statusColor};"></span>
            ${statusVal}
          </span>
        </td>
        <td style="padding: 12px 10px; font-family: monospace; color: #fff;">${log.ip || 'Unknown'}</td>
        <td style="padding: 12px 10px;">${log.location || 'Unknown Location'}</td>
        <td style="padding: 12px 10px;">${log.deviceModel || 'Desktop (Unknown)'}</td>
        <td style="padding: 12px 10px;">${log.browser || 'Unknown Browser'}</td>
        <td style="padding: 12px 10px; font-family: monospace; color: #33b5ff;">${log.currentPage || '/'}</td>
        <td style="padding: 12px 10px; color: #aaa;" class="session-time-cell">${sMins}m ${sSecs}s</td>
        <td style="padding: 12px 10px; text-align: center;" onclick="event.stopPropagation()">
          <div style="display: flex; gap: 6px; justify-content: center;">
            <button onclick="window.openVisitorDrawer('${log.sessionId}')" class="admin-btn" style="padding: 4px 8px; font-size: 11px;">Details</button>
            <button onclick="window.toggleBlockVisitor('${log.ip}')" class="admin-btn" style="background: ${isBlocked ? 'rgba(0,255,128,0.1)' : 'rgba(255,77,77,0.1)'}; color: ${isBlocked ? '#00ff80' : '#ff4d4d'}; border-color: ${isBlocked ? 'rgba(0,255,128,0.3)' : 'rgba(255,77,77,0.3)'}; padding: 4px 8px; font-size: 11px;">
              ${isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  mobileList.innerHTML = filtered.map((log) => {
    const isBlocked = blockedList.includes(log.ip);
    const statusVal = log.status || 'ACTIVE';
    const statusColor = statusVal === 'ACTIVE' ? '#00ff80' : (statusVal === 'IDLE' ? '#ffcc00' : '#888');

    return `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px;" onclick="window.openVisitorDrawer('${log.sessionId}')">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-family: monospace; font-weight: bold; color: #fff;">${log.ip || 'Unknown'}</span>
          <span style="font-size: 11px; font-weight: 600; color: ${statusColor};">${statusVal}</span>
        </div>
        <div style="font-size: 12px; color: #aaa; margin-bottom: 4px;">📍 ${log.location || 'Unknown'} &bull; ${log.deviceModel || 'Desktop'}</div>
        <div style="font-size: 12px; color: #33b5ff; font-family: monospace; margin-bottom: 8px;">Page: ${log.currentPage || '/'}</div>
        <div style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
          <button onclick="window.openVisitorDrawer('${log.sessionId}')" class="admin-btn" style="flex: 1; padding: 6px;">View Details</button>
          <button onclick="window.toggleBlockVisitor('${log.ip}')" class="admin-btn" style="background: ${isBlocked ? 'rgba(0,255,128,0.1)' : 'rgba(255,77,77,0.1)'}; color: ${isBlocked ? '#00ff80' : '#ff4d4d'}; padding: 6px;">${isBlocked ? 'Unblock' : 'Block'}</button>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// GLOBAL WINDOW HELPERS
// ============================================================================
window.openVisitorDrawer = function(sessionId) {
  const logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
  const visitor = logs.find(l => l && l.sessionId === sessionId);
  if (!visitor) return;

  const drawer = document.getElementById('visitor-detail-drawer');
  const inner = document.getElementById('drawer-content-inner');
  if (!drawer || !inner) return;

  const sessionDurationSec = Math.floor((Date.now() - (visitor.sessionStart || Date.now())) / 1000);
  const sMins = Math.floor(sessionDurationSec / 60);
  const sSecs = sessionDurationSec % 60;

  inner.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
      <div>
        <div style="font-size: 11px; color: #888; letter-spacing: 1px;">VISITOR TELEMETRY PROFILE</div>
        <div style="font-size: 16px; font-weight: bold; color: #fff; font-family: monospace;">${visitor.sessionId}</div>
      </div>
      <button onclick="window.closeVisitorDrawer()" class="admin-btn" style="font-size: 18px; padding: 2px 10px;">&times;</button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px; color: #ccc; overflow-y: auto; flex-grow: 1; padding-right: 4px;">
      <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
        <div style="color: #888; font-size: 10px; text-transform: uppercase;">Network & Location</div>
        <div style="color: #fff; font-family: monospace; margin-top: 2px;">IP: ${visitor.ip || 'Unknown'}</div>
        <div style="margin-top: 2px;">Location: ${visitor.location || 'Unknown'}</div>
        <div style="margin-top: 2px;">ISP: ${visitor.isp || 'Unknown'}</div>
        <div style="margin-top: 2px;">Connection Type: ${visitor.connectionType || 'Unavailable'}</div>
      </div>

      <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
        <div style="color: #888; font-size: 10px; text-transform: uppercase;">Device & Environment</div>
        <div style="color: #fff; margin-top: 2px;">Device: ${visitor.deviceModel || 'Unknown'}</div>
        <div style="margin-top: 2px;">Browser: ${visitor.browser || 'Unknown'}</div>
        <div style="margin-top: 2px;">Screen Resolution: ${visitor.screenResolution || 'Unknown'}</div>
        <div style="margin-top: 2px;">Language / TZ: ${visitor.language || 'en-US'} (${visitor.timezone || 'UTC'})</div>
      </div>

      <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
        <div style="color: #888; font-size: 10px; text-transform: uppercase;">Session Analytics</div>
        <div style="margin-top: 2px;">Current Page: <span style="font-family: monospace; color: #33b5ff;">${visitor.currentPage || '/'}</span></div>
        <div style="margin-top: 2px;">Entry Page: <span style="font-family: monospace;">${visitor.entryPage || '/'}</span></div>
        <div style="margin-top: 2px;">Referrer: ${visitor.referrer || 'Direct'}</div>
        <div style="margin-top: 2px;">Pages Viewed: ${visitor.pagesViewed || 1}</div>
        <div style="margin-top: 2px;">Session Duration: ${sMins}m ${sSecs}s</div>
        <div style="margin-top: 2px;">First Seen: ${visitor.firstSeen ? new Date(visitor.firstSeen).toLocaleTimeString() : 'Unknown'}</div>
      </div>

      <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
        <div style="color: #888; font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">Activity Chronology Timeline</div>
        <div style="display: flex; flex-direction: column; gap: 6px; border-left: 2px solid rgba(255,255,255,0.15); padding-left: 10px; margin-left: 4px;">
          ${(visitor.activityTimeline || ['Arrived on site']).map(act => `<div style="font-size: 11px; color: #ddd;">&bull; ${act}</div>`).join('')}
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
      <button onclick="navigator.clipboard.writeText('${visitor.ip}'); alert('IP Copied to clipboard!');" class="admin-btn" style="flex: 1;">Copy IP</button>
      <button onclick="navigator.clipboard.writeText('${visitor.sessionId}'); alert('Session ID Copied!');" class="admin-btn" style="flex: 1;">Copy SID</button>
      <button onclick="window.removeVisitorSession('${visitor.sessionId}')" class="admin-btn" style="background: rgba(255,77,77,0.1); color: #ff4d4d; border-color: rgba(255,77,77,0.3);">Remove</button>
    </div>
  `;

  drawer.classList.add('is-open');
};

window.closeVisitorDrawer = function() {
  const drawer = document.getElementById('visitor-detail-drawer');
  if (drawer) drawer.classList.remove('is-open');
};

window.toggleBlockVisitor = function(ipAddress) {
  let blockedList = JSON.parse(localStorage.getItem('ar_blocked_ips') || '[]');
  if (blockedList.includes(ipAddress)) {
    blockedList = blockedList.filter(ip => ip !== ipAddress);
  } else {
    blockedList.push(ipAddress);
  }
  localStorage.setItem('ar_blocked_ips', JSON.stringify(blockedList));
  renderDashboard();
};

window.removeVisitorSession = function(sessionId) {
  if (confirm("Remove this session record from the dashboard?")) {
    let logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
    logs = logs.filter(l => l && l.sessionId !== sessionId);
    localStorage.setItem('ar_visitor_logs', JSON.stringify(logs));
    window.closeVisitorDrawer();
    renderDashboard();
  }
};

function exportVisitorLogsCSV() {
  const logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
  if (logs.length === 0) {
    alert("No visitor logs available to export.");
    return;
  }

  const headers = ['SessionID', 'IP', 'Location', 'ISP', 'Device', 'Browser', 'CurrentPage', 'Status', 'PagesViewed', 'FirstSeen'];
  let csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...logs.map(l => [
    l.sessionId, l.ip, `"${l.location}"`, `"${l.isp}"`, `"${l.deviceModel}"`, `"${l.browser}"`, l.currentPage, l.status, l.pagesViewed, new Date(l.firstSeen || Date.now()).toISOString()
  ].join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `visitor_telemetry_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}