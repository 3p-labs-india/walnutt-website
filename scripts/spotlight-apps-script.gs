/**
 * Spotlight weekly count — Google Apps Script web app.
 *
 * Temporary source for walnutt.co/spotlight until learning-engine serves
 * GET https://api.walnutt.co/api/public/spotlight/week. Answers with the same
 * shape, so the site only swaps SPOTLIGHT_URL in src/lib/spotlight.ts:
 *
 *   { "sent": 14, "cap": 40, "week_start": "2026-09-28" }
 *
 * Sheet — a tab named "Spotlight", header row then one row per week:
 *
 *   week_start  | sent | cap
 *   2026-09-28  | 14   | 40
 *
 * week_start is that week's Monday (IST). A week with no row yet answers
 * sent 0 at the default cap, so the page never breaks on a Monday morning.
 *
 * Deploy: in the sheet, Extensions → Apps Script, paste this file, then
 * Deploy → New deployment → Web app, Execute as: Me, Who has access: Anyone.
 * Copy the /exec URL into SPOTLIGHT_URL. Later edits: Deploy → Manage
 * deployments → edit → New version, which keeps the same URL.
 */

var SHEET_NAME = 'Spotlight';
var DEFAULT_CAP = 40;
var TZ = 'Asia/Kolkata';
var CACHE_SECONDS = 60;

function doGet() {
  var weekStart = currentWeekStart_();
  var cache = CacheService.getScriptCache();
  var key = 'spotlight:' + weekStart;

  var body = cache.get(key);
  if (!body) {
    body = JSON.stringify(readWeek_(weekStart));
    cache.put(key, body, CACHE_SECONDS);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

function readWeek_(weekStart) {
  var out = { sent: 0, cap: DEFAULT_CAP, week_start: weekStart };
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return out;

  var sheetTz = ss.getSpreadsheetTimeZone();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (toIsoDate_(rows[i][0], sheetTz) !== weekStart) continue;
    var sent = Number(rows[i][1]);
    var cap = Number(rows[i][2]);
    out.sent = sent >= 0 ? Math.floor(sent) : 0;
    out.cap = cap > 0 ? Math.floor(cap) : DEFAULT_CAP;
    break;
  }
  return out;
}

/** Monday of the current week in IST, as yyyy-MM-dd. */
function currentWeekStart_() {
  var now = new Date();
  var isoDay = Number(Utilities.formatDate(now, TZ, 'u')); // 1 = Mon … 7 = Sun
  var monday = new Date(now.getTime() - (isoDay - 1) * 86400000);
  return Utilities.formatDate(monday, TZ, 'yyyy-MM-dd');
}

/** A date cell arrives as a Date in the sheet's timezone; text passes through. */
function toIsoDate_(value, sheetTz) {
  if (value instanceof Date) return Utilities.formatDate(value, sheetTz, 'yyyy-MM-dd');
  return String(value).trim();
}
