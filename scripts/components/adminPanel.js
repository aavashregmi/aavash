/**
 * ==========================================================================
 * GLOBAL CLOUD TELEMETRY CONSOLE (FIREBASE POWERED - SILENT STRIKE TRACKER)
 * ==========================================================================
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3oXli1q0cHcIG76OKg7H6fAn-yfwmZws",
  authDomain: "visitoranalytics-b716e.firebaseapp.com",
  databaseURL: "https://visitoranalytics-b716e-default-rtdb.firebaseio.com",
  projectId: "visitoranalytics-b716e",
  storageBucket: "visitoranalytics-b716e.firebasestorage.app",
  messagingSenderId: "436769862863",
  appId: "1:436769862863:web:cb3142696e3e92b4d0f3ba",
  measurementId: "G-CC42S77XD8"
};

let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (err) {
  console.error("Firebase Init Error:", err);
}

/**
 * ==========================================================================
 * ADVANCED NO-COPY PROTECTION & SILENT STRIKE TRACKER
 * ==========================================================================
 */
function enableNoCopyProtection() {
  // Helper to check if admin is fully authenticated right now
  function isAdmin() {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true' || document.body.classList.contains('admin-auth');
  }

  async function registerViolation(e, type) {
    if (isAdmin()) return; // Instant exit if admin
    
    e.preventDefault();
    
    const visitorKey = sessionStorage.getItem('ar_firebase_vkey');
    if (!visitorKey || !db) return;

    const visitorRef = ref(db, `visitors/${visitorKey}`);
    try {
      const snap = await get(visitorRef);
      if (snap.exists()) {
        const data = snap.val();
        const currentViolations = (data.violations || 0) + 1;
        
        await set(visitorRef, {
          ...data,
          violations: currentViolations,
          lastViolationAction: type,
          lastActivity: Date.now()
        });
      }
    } catch (err) {
      console.error("Violation tracking error:", err);
    }
    
    return false;
  }

  document.addEventListener('contextmenu', (e) => {
    if (isAdmin()) {
      return true; // Let browser handle standard right-click for admin
    }
    registerViolation(e, 'Right-Click / Tap');
  });

  document.addEventListener('keydown', (e) => {
    if (isAdmin()) return;
    if (
      e.key === 'F12' ||
      (e.ctrlKey && ['c', 'a', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
    ) {
      registerViolation(e, `Forbidden Key: ${e.key}`);
    }
  });

  ['copy', 'cut', 'dragstart'].forEach((eventType) => {
    document.addEventListener(eventType, (e) => {
      if (isAdmin()) return;
      registerViolation(e, eventType);
    });
  });

  if (!document.getElementById('nocopy-styles')) {
    const style = document.createElement('style');
    style.id = 'nocopy-styles';
    style.innerHTML = `
      body:not(.admin-auth) * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      body.admin-auth * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export function initAdminPanel() {
  if (document.getElementById('secret-admin-trigger')) return;

  // ENSURE FRESH STARTUP ON REFRESH: Wipe admin authentication flag on fresh load
  sessionStorage.removeItem('isAdminAuthenticated');
  document.body.classList.remove('admin-auth');

  enableNoCopyProtection();

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

  trackAndCheckVisitor().catch(err => console.error("Tracking error:", err));
  startGlobalHeartbeat();
  startLiveSessionTicker();

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
          <span style="font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #fff;">GLOBAL CLOUD TELEMETRY CONSOLE</span>
          <span style="font-size: 11px; background: rgba(0,255,128,0.1); color: #00ff80; border: 1px solid rgba(0,255,128,0.3); padding: 3px 8px; border-radius: 20px;">FIREBASE LIVE</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button id="refresh-logs-btn" class="admin-btn" style="background: rgba(0,128,255,0.1); color: #33b5ff; border-color: rgba(0,128,255,0.3);">Refresh Data</button>
          <button id="clear-logs-btn" class="admin-btn" style="background: rgba(255,77,77,0.1); color: #ff4d4d; border-color: rgba(255,77,77,0.3);">Clear Cloud Logs</button>
          <button id="admin-close-dash" class="admin-btn" style="font-size: 16px; padding: 2px 10px;">&times;</button>
        </div>
      </div>

      <div id="analytics-summary-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px;"></div>

      <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;">
        <input type="text" id="visitor-search-input" placeholder="Search IP, location, device, page..." class="admin-input-field" style="flex: 1; min-width: 220px;" />
        
        <select id="filter-status" class="admin-input-field" style="cursor: pointer;">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="IDLE">Idle</option>
          <option value="OFFLINE">Offline</option>
          <option value="BLOCKED">Blocked</option>
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
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      document.body.classList.add('admin-auth'); 
      document.getElementById('admin-gate-view').style.display = 'none';
      document.getElementById('admin-dashboard-view').style.display = 'flex';
      renderDashboard();
    }
  });

  document.getElementById('visitor-search-input').addEventListener('input', renderDashboard);
  document.getElementById('filter-status').addEventListener('change', renderDashboard);
  document.getElementById('filter-device').addEventListener('change', renderDashboard);
  document.getElementById('sort-visitors-by').addEventListener('change', renderDashboard);
  document.getElementById('refresh-logs-btn').addEventListener('click', renderDashboard);

  document.getElementById('clear-logs-btn').addEventListener('click', async () => {
    if (confirm("Clear all cloud visitor telemetry logs from Firebase?")) {
      await remove(ref(db, 'visitors'));
      renderDashboard();
    }
  });
}

async function trackAndCheckVisitor() {
  if (!db) return;

  let ipData = { ip: "127.0.0.1", location: "Direct / Network", isp: "Standard ISP" };

  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        ipData.ip = data.ip;
        ipData.location = `${data.city}, ${data.country}`;
        ipData.isp = data.connection?.isp || data.connection?.org || "Internet Provider";
      }
    }
  } catch (e) {
    try {
      const fallbackRes = await fetch('https://api.ipify.org?format=json');
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        ipData.ip = fbData.ip;
        ipData.location = "Nepal (Local Routing)";
      }
    } catch (err) {
      ipData.ip = "Web Visitor (Hidden)";
    }
  }

  const cleanIpKey = ipData.ip.replace(/[.#$[\]]/g, '_');

  try {
    const blockedSnap = await get(ref(db, `blocked_ips/${cleanIpKey}`));
    if (blockedSnap.exists() && blockedSnap.val() === true) {
      document.body.innerHTML = `<div style="background:#0a0a0f;color:#ff4d4d;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:18px;text-align:center;padding:20px;">Access Denied. Your IP address has been blocked.</div>`;
      return;
    }
  } catch(e) {}

  let visitorKey = sessionStorage.getItem('ar_firebase_vkey');
  if (!visitorKey) {
    visitorKey = 'VKEY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    sessionStorage.setItem('ar_firebase_vkey', visitorKey);
  }

  const ua = navigator.userAgent || '';
  let deviceType = 'Desktop';
  if (/mobi|android|iphone|ipod/i.test(ua)) deviceType = 'Mobile';
  else if (/ipad|tablet|kindle/i.test(ua)) deviceType = 'Tablet';

  let os = 'Windows OS';
  if (/android/i.test(ua)) os = 'Android OS';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux OS';
  else if (/cros/i.test(ua)) os = 'Chrome OS';

  let browser = 'Web Browser';
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/opr|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua)) browser = 'Apple Safari';
  else if (/firefox/i.test(ua)) browser = 'Mozilla Firefox';

  const now = Date.now();
  const currentPath = window.location.pathname || '/';

  const visitorRecord = {
    sessionId: 'SID-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    vkey: visitorKey,
    ip: ipData.ip,
    cleanIpKey: cleanIpKey,
    location: ipData.location,
    isp: ipData.isp,
    device: deviceType,
    os: os,
    deviceModel: `${deviceType} • ${os}`,
    browser: browser,
    screenResolution: `${window.innerWidth}px × ${window.innerHeight}px`,
    currentPage: currentPath,
    firstSeen: now,
    lastActivity: now,
    sessionStart: now,
    pagesViewed: 1,
    status: 'ACTIVE'
  };

  try {
    const visitorRef = ref(db, 'visitors/' + visitorKey);
    const snapshot = await get(visitorRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      visitorRecord.firstSeen = existing.firstSeen || now;
      visitorRecord.sessionStart = existing.sessionStart || now;
      visitorRecord.pagesViewed = (existing.pagesViewed || 1) + (existing.currentPage !== currentPath ? 1 : 0);
      visitorRecord.violations = existing.violations || 0;
      visitorRecord.lastViolationAction = existing.lastViolationAction || 'None';
    } else {
      visitorRecord.violations = 0;
      visitorRecord.lastViolationAction = 'None';
    }
    await set(visitorRef, visitorRecord);
  } catch (err) {
    console.error("Firebase write failed:", err);
  }
}

function startGlobalHeartbeat() {
  setInterval(async () => {
    if (!db) return;
    const visitorKey = sessionStorage.getItem('ar_firebase_vkey');
    if (!visitorKey) return;
    try {
      const snap = await get(ref(db, `visitors/${visitorKey}`));
      if (snap.exists()) {
        const v = snap.val();
        if (v.cleanIpKey) {
          const blockedSnap = await get(ref(db, `blocked_ips/${v.cleanIpKey}`));
          if (blockedSnap.exists() && blockedSnap.val() === true) {
            document.body.innerHTML = `<div style="background:#0a0a0f;color:#ff4d4d;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:18px;text-align:center;padding:20px;">Access Denied. Your IP address has been blocked.</div>`;
            return;
          }
        }
      }
      await set(ref(db, `visitors/${visitorKey}/lastActivity`), Date.now());
      await set(ref(db, `visitors/${visitorKey}/status`), 'ACTIVE');
    } catch (e) {}
  }, 10000);
}

function startLiveSessionTicker() {
  setInterval(() => {
    const dashView = document.getElementById('admin-dashboard-view');
    if (!dashView || dashView.style.display !== 'flex') return;

    document.querySelectorAll('.admin-table-row').forEach(row => {
      const sessionStart = parseInt(row.getAttribute('data-session-start') || '0', 10);
      if (!sessionStart) return;
      const sec = Math.floor((Date.now() - sessionStart) / 1000);
      const timeCell = row.querySelector('.session-time-cell');
      if (timeCell) timeCell.textContent = `${Math.floor(sec / 60)}m ${sec % 60}s`;
    });
  }, 1000);
}

async function renderDashboard() {
  const tbody = document.getElementById('visitor-table-body');
  const summaryCardsEl = document.getElementById('analytics-summary-cards');
  if (!tbody || !db) return;

  tbody.innerHTML = `<tr><td colspan="9" style="padding: 25px; text-align: center; color: #888;">Syncing with Firebase cloud...</td></tr>`;

  let logs = [];
  let blockedIpsMap = {};
  try {
    const [snapshot, blockedSnap] = await Promise.all([
      get(child(ref(db), 'visitors')),
      get(child(ref(db), 'blocked_ips'))
    ]);
    if (snapshot.exists()) logs = Object.values(snapshot.val());
    if (blockedSnap.exists()) blockedIpsMap = blockedSnap.val();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding: 25px; text-align: center; color: #ff4d4d;">Error loading Firebase data.</td></tr>`;
    return;
  }

  const now = Date.now();
  logs.forEach(l => {
    const isIpBlocked = l.cleanIpKey && blockedIpsMap[l.cleanIpKey] === true;
    if (isIpBlocked) {
      l.status = 'BLOCKED';
    } else {
      const inactive = now - (l.lastActivity || now);
      l.status = inactive > 60000 ? 'OFFLINE' : (inactive > 20000 ? 'IDLE' : 'ACTIVE');
    }
  });

  const activeCount = logs.filter(l => l.status === 'ACTIVE').length;
  const totalViews = logs.reduce((sum, l) => sum + (l.pagesViewed || 1), 0);
  const devicesSet = new Set(logs.map(l => l.device || 'Desktop')).size;

  if (summaryCardsEl) {
    summaryCardsEl.innerHTML = `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888;">ONLINE</div>
        <div style="font-size: 20px; font-weight: bold; color: #00ff80;">🟢 ${activeCount}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888;">TOTAL VISITORS</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff;">👥 ${logs.length}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888;">PAGE VIEWS</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff;">📄 ${totalViews}</div>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px;">
        <div style="font-size: 10px; color: #888;">DEVICE TYPES</div>
        <div style="font-size: 20px; font-weight: bold; color: #fff;">💻 ${devicesSet}</div>
      </div>
    `;
  }

  const searchQuery = document.getElementById('visitor-search-input').value.toLowerCase();
  const filterStatus = document.getElementById('filter-status').value;
  const filterDevice = document.getElementById('filter-device').value;
  const sortBy = document.getElementById('sort-visitors-by').value;

  logs = logs.filter(l => {
    const matchSearch = !searchQuery || [l.ip, l.location, l.deviceModel, l.browser, l.currentPage].some(val => (val || '').toLowerCase().includes(searchQuery));
    const matchStatus = !filterStatus || l.status === filterStatus;
    const matchDevice = !filterDevice || l.device === filterDevice;
    return matchSearch && matchStatus && matchDevice;
  });

  logs.sort((a, b) => {
    if (sortBy === 'oldest') return (a.firstSeen || 0) - (b.firstSeen || 0);
    if (sortBy === 'activity') return (b.lastActivity || 0) - (a.lastActivity || 0);
    if (sortBy === 'session') return ((b.lastActivity || 0) - (b.sessionStart || 0)) - ((a.lastActivity || 0) - (a.sessionStart || 0));
    return (b.firstSeen || 0) - (a.firstSeen || 0);
  });

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding: 25px; text-align: center; color: #888;">No matching visitors found.</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map((log, index) => {
    const sec = Math.floor((now - (log.sessionStart || now)) / 1000);
    let color = '#888';
    if (log.status === 'ACTIVE') color = '#00ff80';
    else if (log.status === 'IDLE') color = '#ffcc00';
    else if (log.status === 'BLOCKED') color = '#ff4d4d';

    return `
      <tr class="admin-table-row" data-session-start="${log.sessionStart || now}" onclick="window.openVisitorDrawer('${log.vkey}')">
        <td style="padding: 12px 10px; color: #888;">${index + 1}</td>
        <td style="padding: 12px 10px;"><span style="color: ${color}; font-weight: bold;">&bull; ${log.status}</span></td>
        <td style="padding: 12px 10px; font-family: monospace; color: #fff;">${log.ip}</td>
        <td style="padding: 12px 10px;">${log.location}</td>
        <td style="padding: 12px 10px;">${log.deviceModel}</td>
        <td style="padding: 12px 10px;">${log.browser}</td>
        <td style="padding: 12px 10px; color: #33b5ff; font-family: monospace;">${log.currentPage}</td>
        <td style="padding: 12px 10px;" class="session-time-cell">${Math.floor(sec / 60)}m ${sec % 60}s</td>
        <td style="padding: 12px 10px; text-align: center;" onclick="event.stopPropagation()">
          <button onclick="window.openVisitorDrawer('${log.vkey}')" class="admin-btn" style="padding: 4px 8px;">Details</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.openVisitorDrawer = async function(vkey) {
  if (!db) return;
  const snap = await get(ref(db, `visitors/${vkey}`));
  if (!snap.exists()) return;
  const v = snap.val();

  const drawer = document.getElementById('visitor-detail-drawer');
  const inner = document.getElementById('drawer-content-inner');
  if (!drawer || !inner) return;

  let isBlocked = false;
  if (v.cleanIpKey) {
    const blockedSnap = await get(ref(db, `blocked_ips/${v.cleanIpKey}`));
    isBlocked = blockedSnap.exists() && blockedSnap.val() === true;
  }

  inner.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
      <div style="font-weight: bold; color: #fff; font-family: monospace; font-size: 14px;">${v.sessionId || vkey}</div>
      <button onclick="window.closeVisitorDrawer()" class="admin-btn" style="font-size: 16px; padding: 2px 8px;">&times;</button>
    </div>

    <div style="color: #ccc; display: flex; flex-direction: column; gap: 12px; font-size: 13px; flex-grow: 1;">
      <div><strong>Status:</strong> <span style="color: ${isBlocked ? '#ff4d4d' : '#00ff80'}">${isBlocked ? 'MANUALLY BANNED' : v.status}</span></div>
      <div><strong>Right-Click / Copy Attempts:</strong> <span style="color: ${(v.violations || 0) > 0 ? '#ffcc00' : '#00ff80'}; font-weight: bold;">${v.violations || 0} times</span></div>
      <div><strong>Last Blocked Action:</strong> ${v.lastViolationAction || 'None'}</div>
      <div><strong>IP Address:</strong> <span style="color:#fff; font-family:monospace;">${v.ip}</span></div>
      <div><strong>Location:</strong> ${v.location}</div>
      <div><strong>Device & OS:</strong> ${v.deviceModel}<span></div>
      <div><strong>Browser Name:</strong> ${v.browser}</div>
      <div><strong>Current Page:</strong> <span style="color:#33b5ff; font-family:monospace;">${v.currentPage}</span></div>
    </div>

    <div style="display: flex; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.08);">
      <button onclick="window.toggleBlockIP('${v.cleanIpKey}', ${!isBlocked})" class="admin-btn" style="flex: 1; background: ${isBlocked ? 'rgba(0,255,128,0.1)' : 'rgba(255,77,77,0.1)'}; color: ${isBlocked ? '#00ff80' : '#ff4d4d'}; border-color: ${isBlocked ? 'rgba(0,255,128,0.3)' : 'rgba(255,77,77,0.3)'};">
        ${isBlocked ? 'Unban IP' : 'Ban IP Manually'}
      </button>
      <button onclick="window.removeCloudVisitor('${vkey}')" class="admin-btn" style="background: rgba(255,77,77,0.1); color: #ff4d4d; border-color: rgba(255,77,77,0.3);">
        Delete Log
      </button>
    </div>
  `;
  drawer.classList.add('is-open');
};

window.closeVisitorDrawer = function() {
  document.getElementById('visitor-detail-drawer')?.classList.remove('is-open');
};

window.toggleBlockIP = async function(cleanIpKey, blockState) {
  if (!db || !cleanIpKey) return;
  const ipRef = ref(db, `blocked_ips/${cleanIpKey}`);
  if (blockState) {
    await set(ipRef, true);
  } else {
    await remove(ipRef);
  }
  window.closeVisitorDrawer();
  renderDashboard();
};

window.removeCloudVisitor = async function(vkey) {
  if (confirm("Delete visitor record?")) {
    await remove(ref(db, `visitors/${vkey}`));
    window.closeVisitorDrawer();
    renderDashboard();
  }
};