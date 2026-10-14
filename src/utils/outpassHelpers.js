/**
 * Outpass / Gatepass Date, Time, and Expiration Helpers
 */

export function parsePassDate(dateOrTimeStr, fallbackBaseDate = new Date()) {
  if (!dateOrTimeStr) return null;
  const str = String(dateOrTimeStr).trim();

  // Try direct ISO or Date parse (e.g. "2026-10-16T17:30" or ISO timestamps)
  const directTs = Date.parse(str);
  if (!isNaN(directTs)) {
    return new Date(directTs);
  }

  // Handle strings like "Today 05:00 PM", "Friday 05:00 PM", "05:00 PM", "17:00"
  const timeMatch = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const meridian = timeMatch[4] ? timeMatch[4].toUpperCase() : null;

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    const d = new Date(fallbackBaseDate);
    if (/tomorrow/i.test(str)) {
      d.setDate(d.getDate() + 1);
    }
    const dateMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      d.setFullYear(parseInt(dateMatch[1], 10), parseInt(dateMatch[2], 10) - 1, parseInt(dateMatch[3], 10));
    }

    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  return null;
}

export function formatTime12(time24) {
  if (!time24) return '05:00 PM';
  if (time24.includes('AM') || time24.includes('PM')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ? mStr.padStart(2, '0') : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}

export function addHoursToTime(time24, hoursToAdd) {
  if (!time24) return '19:00';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr || '17', 10);
  const m = parseInt(mStr || '0', 10);
  const totalMinutes = h * 60 + m + Math.round(hoursToAdd * 60);
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

export function calculateDurationHours(outTime24, inTime24) {
  if (!outTime24 || !inTime24) return 2;
  const [outH, outM] = outTime24.split(':').map((v) => parseInt(v, 10));
  const [inH, inM] = inTime24.split(':').map((v) => parseInt(v, 10));

  let outTotal = outH * 60 + (outM || 0);
  let inTotal = inH * 60 + (inM || 0);

  if (inTotal <= outTotal) {
    // Treat as next day return
    inTotal += 24 * 60;
  }

  const diffMins = inTotal - outTotal;
  return Math.max(0.5, Math.round((diffMins / 60) * 10) / 10);
}

export function getOutpassTimeInfo(pass, now = new Date()) {
  const baseDate = pass.createdAt ? new Date(pass.createdAt) : now;
  const outDate = parsePassDate(pass.outTime, baseDate);
  const inDate = pass.expiresAt ? new Date(pass.expiresAt) : parsePassDate(pass.expectedInTime, outDate || baseDate);

  let durationMinutes = 0;
  if (outDate && inDate) {
    durationMinutes = Math.max(0, Math.round((inDate.getTime() - outDate.getTime()) / (60 * 1000)));
  } else if (pass.durationHours) {
    durationMinutes = Math.round(pass.durationHours * 60);
  }

  const isExpired = inDate ? now.getTime() >= inDate.getTime() : false;
  const isUpcoming = outDate ? now.getTime() < outDate.getTime() : false;

  let remainingMinutes = 0;
  let remainingText = '';
  let progressPercent = 0;

  if (outDate && inDate) {
    const totalDurationMs = inDate.getTime() - outDate.getTime();
    const elapsedMs = now.getTime() - outDate.getTime();
    if (totalDurationMs > 0) {
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));
    }
  }

  if (inDate) {
    const diffMs = inDate.getTime() - now.getTime();
    remainingMinutes = Math.round(diffMs / (60 * 1000));
    if (diffMs > 0) {
      const hrs = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      if (hrs > 0) {
        remainingText = `${hrs}h ${mins}m left`;
      } else {
        remainingText = `${mins}m left`;
      }
    } else {
      const elapsedMins = Math.abs(remainingMinutes);
      const hrs = Math.floor(elapsedMins / 60);
      const mins = elapsedMins % 60;
      remainingText = hrs > 0 ? `Expired ${hrs}h ${mins}m ago` : `Expired ${mins}m ago`;
    }
  }

  const formatHoursText = (mins) => {
    if (!mins || mins <= 0) return 'Custom Limit';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h} ${h === 1 ? 'Hour' : 'Hours'}`;
    return `${m} Mins`;
  };

  const cleanFallbackString = (str) => {
    if (!str) return '--';
    // Clean out latex $\rightarrow$ or raw characters
    return String(str).replace(/\$\\rightarrow\$/g, '→').trim();
  };

  const formatDisplayTime = (d, fallbackStr) => {
    if (!d || isNaN(d.getTime())) return cleanFallbackString(fallbackStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDisplayDate = (d) => {
    if (!d || isNaN(d.getTime())) return '';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return {
    outDate,
    inDate,
    durationMinutes,
    durationHours: Math.round((durationMinutes / 60) * 10) / 10,
    durationText: formatHoursText(durationMinutes),
    isExpired,
    isUpcoming,
    remainingMinutes,
    remainingText,
    progressPercent,
    outFormatted: formatDisplayTime(outDate, pass.outTime),
    inFormatted: formatDisplayTime(inDate, pass.expectedInTime),
    outDateFormatted: formatDisplayDate(outDate),
    inDateFormatted: formatDisplayDate(inDate),
  };
}
