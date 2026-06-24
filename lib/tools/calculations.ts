/**
 * Shared mathematical and calendar calculation utilities for "The God of Time".
 */

export function formatTimeInSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

/**
 * Animates a numeric text transition over a given duration (default 600ms).
 * Incorporates an ease-out cubic animation and locale formatting.
 */
export function animateCountUp(
  element: HTMLElement | null,
  targetValue: number,
  duration: number = 600
): void {
  if (!element) return;

  const targetElement = element;
  const startValue = 0;
  const startTime = performance.now();
  const decimalPlaces = (targetValue.toString().split('.')[1] || '').length;

  function updateCount(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic: f(t) = 1 - (1 - t)^3
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = startValue + easeOutProgress * (targetValue - startValue);

    targetElement.textContent = currentValue.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      targetElement.textContent = targetValue.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
    }
  }

  // Handle prefers-reduced-motion media query
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    targetElement.textContent = targetValue.toLocaleString();
    return;
  }

  requestAnimationFrame(updateCount);
}

export type DaysBetweenResult = {
  totalDays: number;
  totalWeeks: number;
  remainderDays: number;
  totalMonths: number;
  remainderDaysAfterMonths: number;
  businessDays: number;
  weekendDays: number;
  leapDaysIncluded: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateDaysBetween(
  startDateStr: string,
  endDateStr: string,
  includeEndDate: boolean = false,
  excludeWeekends: boolean = false
): DaysBetweenResult {
  if (!startDateStr || !endDateStr) {
    return {
      totalDays: 0,
      totalWeeks: 0,
      remainderDays: 0,
      totalMonths: 0,
      remainderDaysAfterMonths: 0,
      businessDays: 0,
      weekendDays: 0,
      leapDaysIncluded: 0,
      isValid: false,
      errorMessage: "Please select both dates",
    };
  }

  const parts1 = startDateStr.split("-");
  const parts2 = endDateStr.split("-");

  if (parts1.length !== 3 || parts2.length !== 3) {
    return {
      totalDays: 0,
      totalWeeks: 0,
      remainderDays: 0,
      totalMonths: 0,
      remainderDaysAfterMonths: 0,
      businessDays: 0,
      weekendDays: 0,
      leapDaysIncluded: 0,
      isValid: false,
      errorMessage: "Please enter valid dates",
    };
  }

  const y1 = parseInt(parts1[0], 10);
  const m1 = parseInt(parts1[1], 10);
  const d1 = parseInt(parts1[2], 10);

  const y2 = parseInt(parts2[0], 10);
  const m2 = parseInt(parts2[1], 10);
  const d2 = parseInt(parts2[2], 10);

  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      totalDays: 0,
      totalWeeks: 0,
      remainderDays: 0,
      totalMonths: 0,
      remainderDaysAfterMonths: 0,
      businessDays: 0,
      weekendDays: 0,
      leapDaysIncluded: 0,
      isValid: false,
      errorMessage: "Please enter valid dates",
    };
  }

  let tempStart = new Date(start);
  let tempEnd = new Date(end);

  if (tempStart > tempEnd) {
    const swap = tempStart;
    tempStart = tempEnd;
    tempEnd = swap;
  }

  const diffTime = tempEnd.getTime() - tempStart.getTime();
  let totalDays = Math.round(diffTime / 86400000);

  if (start.getTime() === end.getTime()) {
    return {
      totalDays: 0,
      totalWeeks: 0,
      remainderDays: 0,
      totalMonths: 0,
      remainderDaysAfterMonths: 0,
      businessDays: 0,
      weekendDays: 0,
      leapDaysIncluded: 0,
      isValid: true,
    };
  }

  if (includeEndDate) {
    totalDays += 1;
  }

  const totalWeeks = Math.floor(totalDays / 7);
  const remainderDays = totalDays % 7;

  // Calendar Months calculation
  const calendarEnd = new Date(tempEnd);
  if (includeEndDate) {
    calendarEnd.setDate(calendarEnd.getDate() + 1);
  }

  let totalMonths = (calendarEnd.getFullYear() - tempStart.getFullYear()) * 12 + (calendarEnd.getMonth() - tempStart.getMonth());
  let checkDate = new Date(tempStart.getFullYear(), tempStart.getMonth() + totalMonths, tempStart.getDate());

  if (checkDate > calendarEnd) {
    totalMonths--;
    checkDate = new Date(tempStart.getFullYear(), tempStart.getMonth() + totalMonths, tempStart.getDate());
  }

  const remDiffTime = calendarEnd.getTime() - checkDate.getTime();
  const remainderDaysAfterMonths = Math.round(remDiffTime / 86400000);

  // Business Days calculation
  let businessDays = 0;
  let weekendDays = 0;

  if (excludeWeekends) {
    const current = new Date(tempStart);
    const limit = new Date(tempEnd);
    if (includeEndDate) {
      while (current <= limit) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++;
        } else {
          weekendDays++;
        }
        current.setDate(current.getDate() + 1);
      }
    } else {
      while (current < limit) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++;
        } else {
          weekendDays++;
        }
        current.setDate(current.getDate() + 1);
      }
    }
  } else {
    businessDays = totalDays;
    weekendDays = 0;
  }

  // Count leap days
  let leapDaysIncluded = 0;
  const startYear = tempStart.getFullYear();
  const endYear = tempEnd.getFullYear();
  for (let y = startYear; y <= endYear; y++) {
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    if (isLeap) {
      const feb29 = new Date(y, 1, 29);
      if (includeEndDate) {
        if (feb29 >= tempStart && feb29 <= tempEnd) {
          leapDaysIncluded++;
        }
      } else {
        if (feb29 >= tempStart && feb29 < tempEnd) {
          leapDaysIncluded++;
        }
      }
    }
  }

  return {
    totalDays,
    totalWeeks,
    remainderDays,
    totalMonths,
    remainderDaysAfterMonths,
    businessDays,
    weekendDays,
    leapDaysIncluded,
    isValid: true,
  };
}

// ----------------------------------------------------
// NEW GROUP 1 CALCULATION FUNCTIONS (TOOLS 2-20)
// ----------------------------------------------------

export type AddDaysResult = {
  resultDate: Date;
  resultDateFormatted: string;
  dayOfWeek: string;
  weekNumber: number;
  dayOfYear: number;
  isLeapYear: boolean;
  isValid: boolean;
  errorMessage?: string;
};

export function getISOWeekNumber(d: Date): number {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayNum = (date.getDay() + 6) % 7; // Mon = 0, Sun = 6
  date.setDate(date.getDate() - dayNum + 3); // Get Thursday of this week
  const firstThursday = date.getTime();
  date.setMonth(0, 1);
  if (date.getDay() !== 4) {
    date.setMonth(0, 1 + ((4 - date.getDay() + 7) % 7));
  }
  const diff = firstThursday - date.getTime();
  return 1 + Math.round(diff / 604800000);
}

export function getDayOfYear(d: Date): number {
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  let dayOfYear = day;
  for (let m = 0; m < month; m++) {
    dayOfYear += new Date(year, m + 1, 0).getDate();
  }
  return dayOfYear;
}

export function isLeapYearVal(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function addDaysToDate(
  startDateStr: string,
  daysToAdd: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
): AddDaysResult {
  if (!startDateStr) {
    return {
      resultDate: new Date(),
      resultDateFormatted: "",
      dayOfWeek: "",
      weekNumber: 0,
      dayOfYear: 0,
      isLeapYear: false,
      isValid: false,
      errorMessage: "Please select a start date",
    };
  }

  if (isNaN(daysToAdd)) {
    return {
      resultDate: new Date(),
      resultDateFormatted: "",
      dayOfWeek: "",
      weekNumber: 0,
      dayOfYear: 0,
      isLeapYear: false,
      isValid: false,
      errorMessage: "Please enter a number",
    };
  }

  const parts = startDateStr.split("-");
  if (parts.length !== 3) {
    return {
      resultDate: new Date(),
      resultDateFormatted: "",
      dayOfWeek: "",
      weekNumber: 0,
      dayOfYear: 0,
      isLeapYear: false,
      isValid: false,
      errorMessage: "Please enter a valid date",
    };
  }

  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const start = new Date(y, m, d);

  if (isNaN(start.getTime())) {
    return {
      resultDate: new Date(),
      resultDateFormatted: "",
      dayOfWeek: "",
      weekNumber: 0,
      dayOfYear: 0,
      isLeapYear: false,
      isValid: false,
      errorMessage: "Please enter a valid date",
    };
  }

  let resultDate = new Date(start);

  if (unit === 'days') {
    resultDate.setDate(start.getDate() + daysToAdd);
  } else if (unit === 'weeks') {
    resultDate.setDate(start.getDate() + daysToAdd * 7);
  } else if (unit === 'months') {
    const year = start.getFullYear();
    const targetMonth = start.getMonth() + daysToAdd;
    // Get year/month of target
    const dummyDate = new Date(year, targetMonth, 1);
    const targetYear = dummyDate.getFullYear();
    const finalMonth = dummyDate.getMonth();
    // Clamp to last day of target month if day overflows
    const lastDayOfTargetMonth = new Date(targetYear, finalMonth + 1, 0).getDate();
    const finalDay = Math.min(start.getDate(), lastDayOfTargetMonth);
    resultDate = new Date(targetYear, finalMonth, finalDay);
  } else if (unit === 'years') {
    const targetYear = start.getFullYear() + daysToAdd;
    const finalMonth = start.getMonth();
    const lastDayOfTargetMonth = new Date(targetYear, finalMonth + 1, 0).getDate();
    const finalDay = Math.min(start.getDate(), lastDayOfTargetMonth);
    resultDate = new Date(targetYear, finalMonth, finalDay);
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = days[resultDate.getDay()];
  const weekNumber = getISOWeekNumber(resultDate);
  const dayOfYear = getDayOfYear(resultDate);
  const isLeap = isLeapYearVal(resultDate.getFullYear());

  const resultDateFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(resultDate);

  return {
    resultDate,
    resultDateFormatted,
    dayOfWeek,
    weekNumber,
    dayOfYear,
    isLeapYear: isLeap,
    isValid: true,
  };
}

export function subtractDaysFromDate(
  startDateStr: string,
  daysToSubtract: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
): AddDaysResult {
  return addDaysToDate(startDateStr, -daysToSubtract, unit);
}

export type TimeDurationResult = {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  decimalHours: number;
  isOvernight: boolean;
  isValid: boolean;
  errorMessage?: string;
};

export function parseTimeToSeconds(timeStr: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  const hrs = parseInt(parts[0], 10);
  const mins = parseInt(parts[1], 10);
  const secs = parts.length > 2 ? parseInt(parts[2], 10) : 0;
  if (isNaN(hrs) || isNaN(mins) || isNaN(secs)) return null;
  if (hrs < 0 || hrs > 23 || mins < 0 || mins > 59 || secs < 0 || secs > 59) return null;
  return hrs * 3600 + mins * 60 + secs;
}

export function calculateTimeDuration(
  startTimeStr: string,
  endTimeStr: string,
  includeSeconds: boolean = false
): TimeDurationResult {
  const startSec = parseTimeToSeconds(startTimeStr);
  const endSec = parseTimeToSeconds(endTimeStr);

  if (startSec === null || endSec === null) {
    return {
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      decimalHours: 0,
      isOvernight: false,
      isValid: false,
      errorMessage: "Please enter valid times",
    };
  }

  let diff = endSec - startSec;
  let isOvernight = false;
  if (diff < 0) {
    isOvernight = true;
    diff += 86400; // 24 hours in seconds
  }

  const totalSeconds = diff;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalSeconds / 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const decimalHours = parseFloat((totalSeconds / 3600).toFixed(4));

  return {
    totalHours,
    totalMinutes,
    totalSeconds,
    hours,
    minutes,
    seconds,
    decimalHours,
    isOvernight,
    isValid: true,
  };
}

export type AddSubtractTimeResult = {
  resultTime: string;
  resultTime12h: string;
  totalMinutesAdded: number;
  crossedMidnight: boolean;
  daysOffset: number;
  isValid: boolean;
  errorMessage?: string;
};

export function addSubtractTime(
  baseTimeStr: string,
  hours: number,
  minutes: number,
  seconds: number,
  operation: 'add' | 'subtract'
): AddSubtractTimeResult {
  const baseSec = parseTimeToSeconds(baseTimeStr);
  if (baseSec === null) {
    return {
      resultTime: "",
      resultTime12h: "",
      totalMinutesAdded: 0,
      crossedMidnight: false,
      daysOffset: 0,
      isValid: false,
      errorMessage: "Please enter a valid base time",
    };
  }

  const offsetSec = hours * 3600 + minutes * 60 + seconds;
  const totalSec = operation === 'add' ? baseSec + offsetSec : baseSec - offsetSec;

  let daysOffset = 0;
  let resultSeconds = totalSec;
  if (resultSeconds < 0) {
    daysOffset = Math.floor(resultSeconds / 86400);
    resultSeconds = (resultSeconds % 86400) + 86400;
    if (resultSeconds === 86400) {
      resultSeconds = 0;
    }
  } else if (resultSeconds >= 86400) {
    daysOffset = Math.floor(resultSeconds / 86400);
    resultSeconds = resultSeconds % 86400;
  }

  const rHrs = Math.floor(resultSeconds / 3600);
  const rMins = Math.floor((resultSeconds % 3600) / 60);
  const rSecs = resultSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  const resultTime = `${pad(rHrs)}:${pad(rMins)}:${pad(rSecs)}`;

  const ampm = rHrs >= 12 ? "PM" : "AM";
  const displayHrs = rHrs % 12 === 0 ? 12 : rHrs % 12;
  const resultTime12h = `${displayHrs}:${pad(rMins)}:${pad(rSecs)} ${ampm}`;

  const totalMinutesAdded = Math.floor(offsetSec / 60);

  return {
    resultTime,
    resultTime12h,
    totalMinutesAdded,
    crossedMidnight: daysOffset !== 0,
    daysOffset,
    isValid: true,
  };
}

export type BusinessDaysResult = {
  businessDays: number;
  calendarDays: number;
  weekendDays: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateBusinessDaysWithHolidays(
  startDateStr: string,
  endDateStr: string,
  holidays: string[] = []
): BusinessDaysResult & { holidaysExcluded: number } {
  if (!startDateStr || !endDateStr) {
    return { businessDays: 0, calendarDays: 0, weekendDays: 0, holidaysExcluded: 0, isValid: false, errorMessage: "Please select both dates" };
  }

  const parts1 = startDateStr.split("-");
  const parts2 = endDateStr.split("-");
  if (parts1.length !== 3 || parts2.length !== 3) {
    return { businessDays: 0, calendarDays: 0, weekendDays: 0, holidaysExcluded: 0, isValid: false, errorMessage: "Please select valid dates" };
  }
  const start = new Date(parseInt(parts1[0], 10), parseInt(parts1[1], 10) - 1, parseInt(parts1[2], 10));
  const end = new Date(parseInt(parts2[0], 10), parseInt(parts2[1], 10) - 1, parseInt(parts2[2], 10));

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { businessDays: 0, calendarDays: 0, weekendDays: 0, holidaysExcluded: 0, isValid: false, errorMessage: "Please select valid dates" };
  }

  let tempStart = new Date(start);
  let tempEnd = new Date(end);
  const isSwapped = tempStart > tempEnd;
  if (isSwapped) {
    const swap = tempStart;
    tempStart = tempEnd;
    tempEnd = swap;
  }

  const calendarDays = Math.round((tempEnd.getTime() - tempStart.getTime()) / 86400000) + 1;

  let businessDays = 0;
  let weekendDays = 0;
  let holidaysExcluded = 0;

  const current = new Date(tempStart);
  const holidaySet = new Set(holidays);

  while (current <= tempEnd) {
    const dayOfWeek = current.getDay();
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else if (holidaySet.has(dateStr)) {
      holidaysExcluded++;
    } else {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    businessDays,
    calendarDays,
    weekendDays,
    holidaysExcluded,
    isValid: true
  };
}

export function calculateBusinessDays(
  startDateStr: string,
  endDateStr: string
): BusinessDaysResult {
  const res = calculateBusinessDaysWithHolidays(startDateStr, endDateStr, []);
  return {
    businessDays: res.businessDays,
    calendarDays: res.calendarDays,
    weekendDays: res.weekendDays,
    isValid: res.isValid,
    errorMessage: res.errorMessage
  };
}

export type DateDifferenceDetail = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

export function calculateDateDifferenceDetail(targetDate: Date, referenceDate: Date = new Date()): DateDifferenceDetail {
  const diffMs = targetDate.getTime() - referenceDate.getTime();
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const totalSeconds = Math.floor(absDiff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast };
}

export function hoursMinutesToDecimal(hours: number, minutes: number): number {
  return parseFloat((hours + minutes / 60).toFixed(4));
}

export function decimalToHoursMinutes(decimal: number): { hours: number; minutes: number } {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return { hours, minutes };
}

export type LeapYearResult = {
  isLeap: boolean;
  daysInFeb: number;
  nextLeap: number;
  prevLeap: number;
  mathExplanation: string;
};

export function checkLeapYear(year: number): LeapYearResult {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  let nextLeap = year + 1;
  while (!((nextLeap % 4 === 0 && nextLeap % 100 !== 0) || (nextLeap % 400 === 0))) {
    nextLeap++;
  }

  let prevLeap = year - 1;
  while (prevLeap > 0 && !((prevLeap % 4 === 0 && prevLeap % 100 !== 0) || (prevLeap % 400 === 0))) {
    prevLeap--;
  }

  const mathExplanation = year % 400 === 0
    ? `${year} is divisible by 400 (leap year).`
    : year % 100 === 0
      ? `${year} is divisible by 100 but not by 400 (not a leap year).`
      : year % 4 === 0
        ? `${year} is divisible by 4 but not by 100 (leap year).`
        : `${year} is not divisible by 4 (not a leap year).`;

  return {
    isLeap,
    daysInFeb: isLeap ? 29 : 28,
    nextLeap,
    prevLeap,
    mathExplanation
  };
}

export type ISOWeekResult = {
  weekNumber: number;
  year: number;
  weekStart: Date;
  weekEnd: Date;
  dayOfYear: number;
};

export function calculateISOWeekDetails(date: Date): ISOWeekResult {
  const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekNumber = getISOWeekNumber(tempDate);

  const dayNum = (tempDate.getDay() + 6) % 7; // Mon = 0
  const thursDate = new Date(tempDate);
  thursDate.setDate(tempDate.getDate() - dayNum + 3);
  const isoYear = thursDate.getFullYear();

  const monday = new Date(tempDate);
  monday.setDate(tempDate.getDate() - dayNum);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const doy = getDayOfYear(date);

  return {
    weekNumber,
    year: isoYear,
    weekStart: monday,
    weekEnd: sunday,
    dayOfYear: doy
  };
}

export type DayOfWeekResult = {
  dayName: string;
  dayOfWeekISO: number; // Mon = 1, Sun = 7
  dayOfYear: number;
  weekNumber: number;
  year: number;
  daysSinceLast: number;
  nextDate: Date;
};

export function findDayOfWeekDetails(date: Date): DayOfWeekResult {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[date.getDay()];
  const dayOfWeekISO = date.getDay() === 0 ? 7 : date.getDay();
  const dayOfYear = getDayOfYear(date);
  const weekNumber = getISOWeekNumber(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDayOfWeek = date.getDay();
  const currentDayOfWeek = today.getDay();
  let diff = targetDayOfWeek - currentDayOfWeek;
  if (diff <= 0) diff += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff);

  return {
    dayName,
    dayOfWeekISO,
    dayOfYear,
    weekNumber,
    year: date.getFullYear(),
    daysSinceLast: 7,
    nextDate
  };
}

export function getDayProgressPercentage(timeStr: string): number {
  const secs = parseTimeToSeconds(timeStr);
  if (secs === null) return 0;
  return parseFloat(((secs / 86400) * 100).toFixed(2));
}

export function getYearProgressPercentage(date: Date): number {
  const doy = getDayOfYear(date);
  const totalDays = isLeapYearVal(date.getFullYear()) ? 366 : 365;
  return parseFloat(((doy / totalDays) * 100).toFixed(2));
}

export function calculateDateMidpoint(dateA: Date, dateB: Date): { midpointDate: Date; daysFromStart: number; daysToEnd: number } {
  const tA = dateA.getTime();
  const tB = dateB.getTime();
  const midpointMs = (tA + tB) / 2;
  const midpointDate = new Date(midpointMs);

  const minTime = Math.min(tA, tB);
  const maxTime = Math.max(tA, tB);

  const daysFromStart = Math.round((midpointMs - minTime) / 86400000);
  const daysToEnd = Math.round((maxTime - midpointMs) / 86400000);

  return { midpointDate, daysFromStart, daysToEnd };
}

export function dateToOrdinal(date: Date): number {
  return getDayOfYear(date);
}

export function ordinalToDate(ordinal: number, year: number): Date {
  const d = new Date(year, 0, 1);
  d.setDate(ordinal);
  return d;
}

export type Shift = {
  date: string;
  startTime: string;
  endTime: string;
};

export function calculateShiftsTotal(
  shifts: Shift[],
  otThresholdDaily: number = 8,
  otThresholdWeekly: number = 40,
  otMode: 'daily' | 'weekly' = 'daily'
): {
  totalHours: number;
  totalDaysLogged: number;
  averageHoursPerDay: number;
  overtimeHours: number;
  regularHours: number;
} {
  let totalSeconds = 0;
  let totalDaysLogged = 0;

  const dayMinutesMap: Record<string, number> = {};

  shifts.forEach(shift => {
    if (!shift.date || !shift.startTime || !shift.endTime) return;
    const startSec = parseTimeToSeconds(shift.startTime);
    const endSec = parseTimeToSeconds(shift.endTime);
    if (startSec === null || endSec === null) return;

    let diff = endSec - startSec;
    if (diff < 0) diff += 86400; // overnight

    totalSeconds += diff;
    totalDaysLogged++;

    if (!dayMinutesMap[shift.date]) {
      dayMinutesMap[shift.date] = 0;
    }
    dayMinutesMap[shift.date] += diff;
  });

  const totalHours = totalSeconds / 3600;
  const averageHoursPerDay = totalDaysLogged > 0 ? totalHours / totalDaysLogged : 0;

  let overtimeHours = 0;
  if (otMode === 'daily') {
    Object.values(dayMinutesMap).forEach(daySec => {
      const dayHrs = daySec / 3600;
      if (dayHrs > otThresholdDaily) {
        overtimeHours += (dayHrs - otThresholdDaily);
      }
    });
  } else {
    if (totalHours > otThresholdWeekly) {
      overtimeHours = totalHours - otThresholdWeekly;
    }
  }

  const regularHours = Math.max(0, totalHours - overtimeHours);

  return {
    totalHours: parseFloat(totalHours.toFixed(4)),
    totalDaysLogged,
    averageHoursPerDay: parseFloat(averageHoursPerDay.toFixed(2)),
    overtimeHours: parseFloat(overtimeHours.toFixed(4)),
    regularHours: parseFloat(regularHours.toFixed(4)),
  };
}

export type OvertimeCalculatorResult = {
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
};

export function calculateOvertimePay(
  totalHours: number,
  threshold: number = 40,
  rate: number = 0,
  multiplier: number = 1.5
): OvertimeCalculatorResult {
  const overtimeHours = Math.max(0, totalHours - threshold);
  const regularHours = Math.min(totalHours, threshold);
  const regularPay = regularHours * rate;
  const overtimePay = overtimeHours * rate * multiplier;
  const grossPay = regularPay + overtimePay;

  return {
    regularHours: parseFloat(regularHours.toFixed(4)),
    overtimeHours: parseFloat(overtimeHours.toFixed(4)),
    regularPay: parseFloat(regularPay.toFixed(2)),
    overtimePay: parseFloat(overtimePay.toFixed(2)),
    grossPay: parseFloat(grossPay.toFixed(2)),
  };
}

export type PayrollPeriod = {
  periodNumber: number;
  startDateFormatted: string;
  endDateFormatted: string;
  payDateFormatted: string;
  weekendAdjusted: boolean;
};

export function generatePayrollPeriods(
  frequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly',
  firstPayDateStr: string,
  numberOfPeriods: number
): PayrollPeriod[] {
  const parts = firstPayDateStr.split("-");
  if (parts.length !== 3) return [];
  const startYear = parseInt(parts[0], 10);
  const startMonth = parseInt(parts[1], 10) - 1;
  const startDay = parseInt(parts[2], 10);

  let basePayDate = new Date(startYear, startMonth, startDay);
  if (isNaN(basePayDate.getTime())) return [];

  const periods: PayrollPeriod[] = [];

  for (let i = 1; i <= numberOfPeriods; i++) {
    let payDate = new Date(basePayDate);
    if (i > 1) {
      if (frequency === 'weekly') {
        payDate.setDate(basePayDate.getDate() + (i - 1) * 7);
      } else if (frequency === 'bi-weekly') {
        payDate.setDate(basePayDate.getDate() + (i - 1) * 14);
      } else if (frequency === 'monthly') {
        payDate.setMonth(basePayDate.getMonth() + (i - 1));
      } else if (frequency === 'semi-monthly') {
        const currentPeriodDate = new Date(basePayDate);
        for (let step = 1; step < i; step++) {
          const d = currentPeriodDate.getDate();
          if (d <= 15) {
            const year = currentPeriodDate.getFullYear();
            const month = currentPeriodDate.getMonth();
            const lastDay = new Date(year, month + 1, 0).getDate();
            currentPeriodDate.setDate(lastDay);
          } else {
            currentPeriodDate.setMonth(currentPeriodDate.getMonth() + 1);
            currentPeriodDate.setDate(15);
          }
        }
        payDate = currentPeriodDate;
      }
    }

    let periodStart = new Date(payDate);
    let periodEnd = new Date(payDate);

    if (frequency === 'weekly') {
      periodEnd.setDate(payDate.getDate());
      periodStart.setDate(payDate.getDate() - 6);
    } else if (frequency === 'bi-weekly') {
      periodEnd.setDate(payDate.getDate());
      periodStart.setDate(payDate.getDate() - 13);
    } else if (frequency === 'monthly') {
      periodEnd.setDate(payDate.getDate());
      periodStart.setMonth(payDate.getMonth() - 1);
      periodStart.setDate(payDate.getDate() + 1);
    } else if (frequency === 'semi-monthly') {
      periodEnd.setDate(payDate.getDate());
      if (payDate.getDate() <= 15) {
        periodStart.setDate(1);
      } else {
        periodStart.setDate(16);
      }
    }

    let finalPayDate = new Date(payDate);
    let weekendAdjusted = false;
    const dow = payDate.getDay();
    if (dow === 6) {
      finalPayDate.setDate(payDate.getDate() - 1);
      weekendAdjusted = true;
    } else if (dow === 0) {
      finalPayDate.setDate(payDate.getDate() - 2);
      weekendAdjusted = true;
    }
    const formatDate = (d: Date) => new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(d);

    periods.push({
      periodNumber: i,
      startDateFormatted: formatDate(periodStart),
      endDateFormatted: formatDate(periodEnd),
      payDateFormatted: formatDate(finalPayDate),
      weekendAdjusted
    });
  }

  return periods;
}

// ----------------------------------------------------
// NEW GROUP 2 CALCULATION FUNCTIONS (TOOLS 21-40)
// ----------------------------------------------------

export type TimeCardEntry = {
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
};

export type TimeCardResult = {
  entries: {
    date: string;
    hoursWorked: number;
    hoursWorkedFormatted: string;
    isOvertime: boolean;
  }[];
  totalHours: number;
  totalHoursFormatted: string;
  totalDecimalHours: number;
  regularHours: number;
  overtimeHours: number;
  totalDays: number;
  averageHoursPerDay: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateTimeCard(
  entries: TimeCardEntry[],
  dailyOvertimeThreshold: number,
  weeklyOvertimeThreshold: number
): TimeCardResult {
  if (!entries || entries.length === 0) {
    return {
      entries: [],
      totalHours: 0,
      totalHoursFormatted: "0h 0m",
      totalDecimalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      totalDays: 0,
      averageHoursPerDay: 0,
      isValid: false,
      errorMessage: "No entries provided",
    };
  }

  let totalHours = 0;
  let totalDays = 0;

  const processedEntries = entries.map((entry) => {
    if (!entry.date || !entry.startTime || !entry.endTime) {
      return {
        date: entry.date || "",
        hoursWorked: 0,
        hoursWorkedFormatted: "0h 0m",
        isOvertime: false,
      };
    }

    const startSec = parseTimeToSeconds(entry.startTime);
    const endSec = parseTimeToSeconds(entry.endTime);
    if (startSec === null || endSec === null) {
      return {
        date: entry.date,
        hoursWorked: 0,
        hoursWorkedFormatted: "0h 0m",
        isOvertime: false,
      };
    }

    let diff = endSec - startSec;
    if (diff < 0) diff += 86400; // overnight

    const breakHours = (entry.breakMinutes || 0) / 60;
    const hoursWorked = Math.max(0, diff / 3600 - breakHours);

    totalHours += hoursWorked;
    totalDays++;

    const hrs = Math.floor(hoursWorked);
    const mins = Math.round((hoursWorked - hrs) * 60);

    const isOvertime = dailyOvertimeThreshold > 0 && hoursWorked > dailyOvertimeThreshold;

    return {
      date: entry.date,
      hoursWorked: parseFloat(hoursWorked.toFixed(4)),
      hoursWorkedFormatted: `${hrs}h ${mins}m`,
      isOvertime,
    };
  });

  let overtimeHours = 0;
  let regularHours = totalHours;

  if (weeklyOvertimeThreshold > 0 && totalHours > weeklyOvertimeThreshold) {
    overtimeHours = totalHours - weeklyOvertimeThreshold;
    regularHours = weeklyOvertimeThreshold;
  }

  const hrs = Math.floor(totalHours);
  const mins = Math.round((totalHours - hrs) * 60);
  const totalHoursFormatted = `${hrs}h ${mins}m`;

  const averageHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;

  return {
    entries: processedEntries,
    totalHours: parseFloat(totalHours.toFixed(4)),
    totalHoursFormatted,
    totalDecimalHours: parseFloat(totalHours.toFixed(4)),
    regularHours: parseFloat(regularHours.toFixed(4)),
    overtimeHours: parseFloat(overtimeHours.toFixed(4)),
    totalDays,
    averageHoursPerDay: parseFloat(averageHoursPerDay.toFixed(4)),
    isValid: true,
  };
}

export type BreakEntry = {
  startTime: string;
  endTime: string;
};

export type MultiBreakTimeCardResult = {
  grossHours: number;
  totalBreakMinutes: number;
  totalBreakHours: number;
  netHours: number;
  netHoursFormatted: string;
  netDecimalHours: number;
  paidBreakMinutes: number;
  unpaidBreakMinutes: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateMultiBreakTimeCard(
  shiftStart: string,
  shiftEnd: string,
  breaks: BreakEntry[],
  paidBreakAllowanceMinutes: number
): MultiBreakTimeCardResult {
  const startSec = parseTimeToSeconds(shiftStart);
  const endSec = parseTimeToSeconds(shiftEnd);

  if (startSec === null || endSec === null) {
    return {
      grossHours: 0,
      totalBreakMinutes: 0,
      totalBreakHours: 0,
      netHours: 0,
      netHoursFormatted: "0h 0m",
      netDecimalHours: 0,
      paidBreakMinutes: 0,
      unpaidBreakMinutes: 0,
      isValid: false,
      errorMessage: "Please select start and end times",
    };
  }

  let grossDiff = endSec - startSec;
  if (grossDiff < 0) grossDiff += 86400; // overnight
  const grossHours = grossDiff / 3600;

  let totalBreakMinutes = 0;
  breaks.forEach((b) => {
    if (!b.startTime || !b.endTime) return;
    const bStart = parseTimeToSeconds(b.startTime);
    const bEnd = parseTimeToSeconds(b.endTime);
    if (bStart === null || bEnd === null) return;
    let bDiff = bEnd - bStart;
    if (bDiff < 0) bDiff += 86400;
    totalBreakMinutes += Math.round(bDiff / 60);
  });

  const unpaidBreakMinutes = Math.max(0, totalBreakMinutes - paidBreakAllowanceMinutes);
  const totalBreakHours = totalBreakMinutes / 60;
  const netHours = Math.max(0, grossHours - unpaidBreakMinutes / 60);
  const netDecimalHours = parseFloat(netHours.toFixed(4));

  const hrs = Math.floor(netHours);
  const mins = Math.round((netHours - hrs) * 60);
  const netHoursFormatted = `${hrs}h ${mins}m`;

  return {
    grossHours: parseFloat(grossHours.toFixed(4)),
    totalBreakMinutes,
    totalBreakHours: parseFloat(totalBreakHours.toFixed(4)),
    netHours,
    netHoursFormatted,
    netDecimalHours,
    paidBreakMinutes: paidBreakAllowanceMinutes,
    unpaidBreakMinutes,
    isValid: true,
  };
}

export type OvertimePayResult = {
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  totalGrossPay: number;
  effectiveHourlyRate: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateOvertimePayDetailed(
  totalHours: number,
  hourlyRate: number,
  regularThreshold: number,
  overtimeMultiplier: number,
  doubleTimeThreshold: number,
  doubleTimeMultiplier: number,
  enableDoubleTime: boolean
): OvertimePayResult {
  if (isNaN(totalHours) || totalHours < 0) {
    return {
      regularHours: 0,
      overtimeHours: 0,
      doubleTimeHours: 0,
      regularPay: 0,
      overtimePay: 0,
      doubleTimePay: 0,
      totalGrossPay: 0,
      effectiveHourlyRate: 0,
      isValid: false,
      errorMessage: "Please enter valid total hours",
    };
  }

  let regularHours = 0;
  let overtimeHours = 0;
  let doubleTimeHours = 0;

  if (totalHours <= regularThreshold) {
    regularHours = totalHours;
  } else if (enableDoubleTime && totalHours > doubleTimeThreshold) {
    regularHours = regularThreshold;
    overtimeHours = Math.max(0, doubleTimeThreshold - regularThreshold);
    doubleTimeHours = totalHours - doubleTimeThreshold;
  } else {
    regularHours = regularThreshold;
    overtimeHours = totalHours - regularThreshold;
  }

  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * overtimeMultiplier;
  const doubleTimePay = doubleTimeHours * hourlyRate * doubleTimeMultiplier;
  const totalGrossPay = regularPay + overtimePay + doubleTimePay;
  const effectiveHourlyRate = totalHours > 0 ? totalGrossPay / totalHours : 0;

  return {
    regularHours: parseFloat(regularHours.toFixed(4)),
    overtimeHours: parseFloat(overtimeHours.toFixed(4)),
    doubleTimeHours: parseFloat(doubleTimeHours.toFixed(4)),
    regularPay: parseFloat(regularPay.toFixed(2)),
    overtimePay: parseFloat(overtimePay.toFixed(2)),
    doubleTimePay: parseFloat(doubleTimePay.toFixed(2)),
    totalGrossPay: parseFloat(totalGrossPay.toFixed(2)),
    effectiveHourlyRate: parseFloat(effectiveHourlyRate.toFixed(4)),
    isValid: true,
  };
}

export type HourlyToSalaryResult = {
  weeklyPay: number;
  biWeeklyPay: number;
  semiMonthlyPay: number;
  monthlyPay: number;
  annualSalary: number;
};

export function hourlyToSalary(
  hourlyRate: number,
  hoursPerWeek: number,
  weeksPerYear: number = 52
): HourlyToSalaryResult {
  const weeklyPay = hourlyRate * hoursPerWeek;
  const annualSalary = weeklyPay * weeksPerYear;
  const biWeeklyPay = weeklyPay * 2;
  const semiMonthlyPay = annualSalary / 24;
  const monthlyPay = annualSalary / 12;

  return {
    weeklyPay: parseFloat(weeklyPay.toFixed(2)),
    biWeeklyPay: parseFloat(biWeeklyPay.toFixed(2)),
    semiMonthlyPay: parseFloat(semiMonthlyPay.toFixed(2)),
    monthlyPay: parseFloat(monthlyPay.toFixed(2)),
    annualSalary: parseFloat(annualSalary.toFixed(2)),
  };
}

export type SalaryToHourlyResult = {
  grossHourlyRate: number;
  netHourlyRate: number;
  effectiveHourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
};

export function salaryToHourly(
  annualSalary: number,
  hoursPerWeek: number,
  weeksPerYear: number,
  ptoWeeks: number
): SalaryToHourlyResult {
  const grossHourlyRate = annualSalary / (hoursPerWeek * weeksPerYear);
  const netHourlyRate = annualSalary / (hoursPerWeek * (weeksPerYear - ptoWeeks));
  const dailyRate = annualSalary / (weeksPerYear * 5);
  const weeklyRate = annualSalary / weeksPerYear;

  return {
    grossHourlyRate: parseFloat(grossHourlyRate.toFixed(4)),
    netHourlyRate: parseFloat(netHourlyRate.toFixed(4)),
    effectiveHourlyRate: parseFloat(netHourlyRate.toFixed(4)),
    dailyRate: parseFloat(dailyRate.toFixed(2)),
    weeklyRate: parseFloat(weeklyRate.toFixed(2)),
  };
}

export type FreelanceCapacityResult = {
  billableHoursNeeded: number;
  totalHoursNeeded: number;
  daysNeeded: number;
  weeksNeeded: number;
  maxMonthlyRevenue: number;
  utilizationRate: number;
  isAchievable: boolean;
};

export function calculateFreelanceCapacity(
  targetMonthlyRevenue: number,
  hourlyRate: number,
  availableHoursPerDay: number,
  workDaysPerWeek: number,
  adminTimePercent: number
): FreelanceCapacityResult {
  const billableHoursNeeded = targetMonthlyRevenue / (hourlyRate || 1);
  const adminHoursMultiplier = 1 / (1 - (adminTimePercent || 0) / 100);
  const totalHoursNeeded = billableHoursNeeded * adminHoursMultiplier;
  const availableHoursPerMonth = availableHoursPerDay * workDaysPerWeek * 4.33;
  const maxMonthlyRevenue = (availableHoursPerMonth / adminHoursMultiplier) * hourlyRate;
  const utilizationRate = availableHoursPerMonth > 0 ? (billableHoursNeeded / availableHoursPerMonth) * 100 : 0;
  const isAchievable = totalHoursNeeded <= availableHoursPerMonth;

  return {
    billableHoursNeeded: parseFloat(billableHoursNeeded.toFixed(2)),
    totalHoursNeeded: parseFloat(totalHoursNeeded.toFixed(2)),
    daysNeeded: parseFloat((totalHoursNeeded / (availableHoursPerDay || 1)).toFixed(2)),
    weeksNeeded: parseFloat((totalHoursNeeded / (availableHoursPerDay * workDaysPerWeek || 1)).toFixed(2)),
    maxMonthlyRevenue: parseFloat(maxMonthlyRevenue.toFixed(2)),
    utilizationRate: parseFloat(utilizationRate.toFixed(2)),
    isAchievable,
  };
}

export type PTOAccrualResult = {
  accrued: number;
  newBalance: number;
  afterPlannedUsage: number;
  hoursUntilCap: number;
  daysEquivalent: number;
  weeksEquivalent: number;
  isAtCap: boolean;
};

export function calculatePTOAccrual(
  accrualRate: number,
  accrualPeriod: 'hour' | 'week' | 'pay-period' | 'month',
  hoursWorked: number,
  currentBalance: number,
  maxAccrualCap: number,
  plannedUsageHours: number
): PTOAccrualResult {
  let accrued = 0;
  if (accrualPeriod === 'hour') {
    accrued = accrualRate * hoursWorked;
  } else if (accrualPeriod === 'week') {
    accrued = accrualRate * (hoursWorked / 40);
  } else if (accrualPeriod === 'pay-period') {
    accrued = accrualRate * (hoursWorked / 80);
  } else if (accrualPeriod === 'month') {
    accrued = accrualRate * (hoursWorked / 173);
  }

  const newBalance = Math.min(currentBalance + accrued, maxAccrualCap);
  const afterPlannedUsage = Math.max(0, newBalance - plannedUsageHours);
  const hoursUntilCap = Math.max(0, maxAccrualCap - newBalance);
  const daysEquivalent = newBalance / 8;
  const weeksEquivalent = newBalance / 40;
  const isAtCap = newBalance >= maxAccrualCap;

  return {
    accrued: parseFloat(accrued.toFixed(4)),
    newBalance: parseFloat(newBalance.toFixed(4)),
    afterPlannedUsage: parseFloat(afterPlannedUsage.toFixed(4)),
    hoursUntilCap: parseFloat(hoursUntilCap.toFixed(4)),
    daysEquivalent: parseFloat(daysEquivalent.toFixed(2)),
    weeksEquivalent: parseFloat(weeksEquivalent.toFixed(2)),
    isAtCap,
  };
}

export type FurloughImpactResult = {
  dailyRate: number;
  monthlyLoss: number;
  totalLoss: number;
  reducedMonthlyPay: number;
  reducedAnnualEquivalent: number;
  percentageReduction: number;
};

export function calculateFurloughImpact(
  annualSalary: number,
  furloughDaysPerMonth: number,
  furloughDurationMonths: number,
  workDaysPerMonth: number
): FurloughImpactResult {
  const dailyRate = annualSalary / (workDaysPerMonth * 12);
  const monthlyLoss = dailyRate * furloughDaysPerMonth;
  const totalLoss = monthlyLoss * furloughDurationMonths;
  const reducedMonthlyPay = (annualSalary / 12) - monthlyLoss;
  const reducedAnnualEquivalent = reducedMonthlyPay * 12;
  const percentageReduction = ((annualSalary / 12) > 0) ? (monthlyLoss / (annualSalary / 12)) * 100 : 0;

  return {
    dailyRate: parseFloat(dailyRate.toFixed(2)),
    monthlyLoss: parseFloat(monthlyLoss.toFixed(2)),
    totalLoss: parseFloat(totalLoss.toFixed(2)),
    reducedMonthlyPay: parseFloat(reducedMonthlyPay.toFixed(2)),
    reducedAnnualEquivalent: parseFloat(reducedAnnualEquivalent.toFixed(2)),
    percentageReduction: parseFloat(percentageReduction.toFixed(2)),
  };
}

export type ShiftDifferentialResult = {
  baseEarnings: number;
  differentialEarnings: number;
  totalEarnings: number;
  effectiveHourlyRate: number;
  differentialPercentage: number;
};

export function calculateShiftDifferential(
  baseHourlyRate: number,
  shiftHours: number,
  differentialType: 'flat' | 'percentage',
  differentialValue: number
): ShiftDifferentialResult {
  let differentialEarnings = 0;
  let differentialPercentage = 0;

  if (differentialType === 'flat') {
    differentialEarnings = differentialValue * shiftHours;
    differentialPercentage = baseHourlyRate > 0 ? (differentialValue / baseHourlyRate) * 100 : 0;
  } else {
    differentialEarnings = (baseHourlyRate * differentialValue / 100) * shiftHours;
    differentialPercentage = differentialValue;
  }

  const baseEarnings = baseHourlyRate * shiftHours;
  const totalEarnings = baseEarnings + differentialEarnings;
  const effectiveHourlyRate = shiftHours > 0 ? totalEarnings / shiftHours : 0;

  return {
    baseEarnings: parseFloat(baseEarnings.toFixed(2)),
    differentialEarnings: parseFloat(differentialEarnings.toFixed(2)),
    totalEarnings: parseFloat(totalEarnings.toFixed(2)),
    effectiveHourlyRate: parseFloat(effectiveHourlyRate.toFixed(2)),
    differentialPercentage: parseFloat(differentialPercentage.toFixed(2)),
  };
}

export type NetPayResult = {
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  totalDeductions: number;
  estimatedNetPay: number;
  effectiveTaxRate: number;
};

export function estimateNetPay(
  grossPay: number,
  federalTaxRate: number,
  stateTaxRate: number,
  ficaRate: number,
  otherDeductions: number
): NetPayResult {
  const federalTax = grossPay * (federalTaxRate / 100);
  const stateTax = grossPay * (stateTaxRate / 100);
  const ficaTax = grossPay * (ficaRate / 100);
  const totalDeductions = federalTax + stateTax + ficaTax + otherDeductions;
  const estimatedNetPay = Math.max(0, grossPay - totalDeductions);
  const effectiveTaxRate = grossPay > 0 ? (totalDeductions / grossPay) * 100 : 0;

  return {
    federalTax: parseFloat(federalTax.toFixed(2)),
    stateTax: parseFloat(stateTax.toFixed(2)),
    ficaTax: parseFloat(ficaTax.toFixed(2)),
    totalDeductions: parseFloat(totalDeductions.toFixed(2)),
    estimatedNetPay: parseFloat(estimatedNetPay.toFixed(2)),
    effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
  };
}

export type BillableEntry = {
  client: string;
  projectDescription: string;
  startTime: string;
  endTime: string;
  date: string;
  hourlyRate: number;
};

export type BillableHoursResult = {
  byClient: {
    client: string;
    totalHours: number;
    totalValue: number;
  }[];
  totalHours: number;
  totalValue: number;
  averageRatePerHour: number;
};

export function calculateBillableHours(
  entries: BillableEntry[]
): BillableHoursResult {
  let totalHours = 0;
  let totalValue = 0;

  const clientMap: Record<string, { totalHours: number; totalValue: number }> = {};

  entries.forEach((e) => {
    if (!e.client || !e.startTime || !e.endTime) return;
    const startSec = parseTimeToSeconds(e.startTime);
    const endSec = parseTimeToSeconds(e.endTime);
    if (startSec === null || endSec === null) return;

    let diff = endSec - startSec;
    if (diff < 0) diff += 86400; // overnight

    const hours = diff / 3600;
    const rate = e.hourlyRate || 0;
    const val = hours * rate;

    totalHours += hours;
    totalValue += val;

    if (!clientMap[e.client]) {
      clientMap[e.client] = { totalHours: 0, totalValue: 0 };
    }
    clientMap[e.client].totalHours += hours;
    clientMap[e.client].totalValue += val;
  });

  const byClient = Object.entries(clientMap).map(([client, data]) => ({
    client,
    totalHours: parseFloat(data.totalHours.toFixed(4)),
    totalValue: parseFloat(data.totalValue.toFixed(2)),
  }));

  const averageRatePerHour = totalHours > 0 ? totalValue / totalHours : 0;

  return {
    byClient,
    totalHours: parseFloat(totalHours.toFixed(4)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    averageRatePerHour: parseFloat(averageRatePerHour.toFixed(2)),
  };
}

export type CommissionPerHourResult = {
  commissionPerHour: number;
  baseHourlyRate: number;
  combinedHourlyRate: number;
  commissionAsPercent: number;
  breakEvenHours: number;
};

export function calculateCommissionPerHour(
  totalCommission: number,
  hoursWorked: number,
  baseSalary: number,
  baseHours: number
): CommissionPerHourResult {
  const commissionPerHour = hoursWorked > 0 ? totalCommission / hoursWorked : 0;
  const baseHourlyRate = baseHours > 0 ? baseSalary / baseHours : 0;
  const combinedHourlyRate = hoursWorked > 0 ? (totalCommission + baseSalary) / hoursWorked : 0;
  const totalEarnings = totalCommission + baseSalary;
  const commissionAsPercent = totalEarnings > 0 ? (totalCommission / totalEarnings) * 100 : 0;
  const breakEvenHours = commissionPerHour > 0 ? baseSalary / commissionPerHour : 0;

  return {
    commissionPerHour: parseFloat(commissionPerHour.toFixed(2)),
    baseHourlyRate: parseFloat(baseHourlyRate.toFixed(2)),
    combinedHourlyRate: parseFloat(combinedHourlyRate.toFixed(2)),
    commissionAsPercent: parseFloat(commissionAsPercent.toFixed(2)),
    breakEvenHours: parseFloat(breakEvenHours.toFixed(2)),
  };
}

export type DeductBreaksResult = {
  totalBreakMinutes: number;
  unpaidBreakMinutes: number;
  netHours: number;
  netDecimalHours: number;
};

export function deductBreaks(
  totalHours: number,
  numberOfBreaks: number,
  breakDurationMinutes: number,
  paidBreakMinutes: number
): DeductBreaksResult {
  const totalBreakMinutes = numberOfBreaks * breakDurationMinutes;
  const unpaidBreakMinutes = Math.max(0, totalBreakMinutes - paidBreakMinutes);
  const netHours = Math.max(0, totalHours - (unpaidBreakMinutes / 60));

  return {
    totalBreakMinutes,
    unpaidBreakMinutes,
    netHours: parseFloat(netHours.toFixed(4)),
    netDecimalHours: parseFloat(netHours.toFixed(4)),
  };
}

export type AnnualWorkHoursResult = {
  grossAnnualHours: number;
  ptoHours: number;
  holidayHours: number;
  netWorkingHours: number;
  netWorkingDays: number;
  percentageOfYear: number;
};

export function calculateAnnualWorkHours(
  hoursPerDay: number,
  daysPerWeek: number,
  weeksPerYear: number,
  ptoWeeks: number,
  publicHolidays: number
): AnnualWorkHoursResult {
  const grossAnnualHours = hoursPerDay * daysPerWeek * weeksPerYear;
  const ptoHours = ptoWeeks * daysPerWeek * hoursPerDay;
  const holidayHours = publicHolidays * hoursPerDay;
  const netWorkingHours = grossAnnualHours - ptoHours - holidayHours;
  const netWorkingDays = netWorkingHours / hoursPerDay;
  const percentageOfYear = (netWorkingHours / 8760) * 100;

  return {
    grossAnnualHours: parseFloat(grossAnnualHours.toFixed(2)),
    ptoHours: parseFloat(ptoHours.toFixed(2)),
    holidayHours: parseFloat(holidayHours.toFixed(2)),
    netWorkingHours: parseFloat(netWorkingHours.toFixed(2)),
    netWorkingDays: parseFloat(netWorkingDays.toFixed(2)),
    percentageOfYear: parseFloat(percentageOfYear.toFixed(2)),
  };
}

export type JobEntry = {
  name: string;
  hourlyRate: number;
  hoursPerWeek: number;
};

export type MultiJobIncomeResult = {
  perJob: {
    name: string;
    weeklyIncome: number;
    monthlyIncome: number;
    annualIncome: number;
  }[];
  totalWeekly: number;
  totalMonthly: number;
  totalAnnual: number;
  totalHoursPerWeek: number;
};

export function calculateMultiJobIncome(
  jobs: JobEntry[]
): MultiJobIncomeResult {
  let totalWeekly = 0;
  let totalHoursPerWeek = 0;

  const perJob = jobs.map((j) => {
    const weeklyIncome = j.hourlyRate * j.hoursPerWeek;
    const annualIncome = weeklyIncome * 52;
    const monthlyIncome = annualIncome / 12;

    totalWeekly += weeklyIncome;
    totalHoursPerWeek += j.hoursPerWeek;

    return {
      name: j.name || "Job",
      weeklyIncome: parseFloat(weeklyIncome.toFixed(2)),
      monthlyIncome: parseFloat(monthlyIncome.toFixed(2)),
      annualIncome: parseFloat(annualIncome.toFixed(2)),
    };
  });

  const totalAnnual = totalWeekly * 52;
  const totalMonthly = totalAnnual / 12;

  return {
    perJob,
    totalWeekly: parseFloat(totalWeekly.toFixed(2)),
    totalMonthly: parseFloat(totalMonthly.toFixed(2)),
    totalAnnual: parseFloat(totalAnnual.toFixed(2)),
    totalHoursPerWeek,
  };
}

export type RetainerBurndownResult = {
  remainingHours: number;
  remainingValue: number;
  usedValue: number;
  burnRate: number;
  projectedEndDate: Date | null;
  percentageUsed: number;
  daysRemaining: number;
  hoursPerDayNeeded: number;
};

export function calculateRetainerBurndown(
  totalRetainerHours: number,
  hourlyRate: number,
  usedHours: number,
  periodStartDateStr: string,
  periodEndDateStr: string
): RetainerBurndownResult {
  const remainingHours = totalRetainerHours - usedHours;
  const percentageUsed = totalRetainerHours > 0 ? (usedHours / totalRetainerHours) * 100 : 0;
  const remainingValue = remainingHours * hourlyRate;
  const usedValue = usedHours * hourlyRate;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startParts = periodStartDateStr.split("-");
  const endParts = periodEndDateStr.split("-");

  let daysElapsed = 1;
  let daysRemaining = 1;

  if (startParts.length === 3 && endParts.length === 3) {
    const startDate = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, parseInt(startParts[2], 10));
    const endDate = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, parseInt(endParts[2], 10));

    const elapsedMs = today.getTime() - startDate.getTime();
    daysElapsed = Math.max(1, Math.round(elapsedMs / 86400000) + 1);

    const remainingMs = endDate.getTime() - today.getTime();
    daysRemaining = Math.max(1, Math.round(remainingMs / 86400000));
  }

  const burnRate = usedHours / daysElapsed;
  const hoursPerDayNeeded = remainingHours / daysRemaining;

  let projectedEndDate: Date | null = null;
  if (burnRate > 0 && remainingHours > 0) {
    const daysToDepletion = remainingHours / burnRate;
    projectedEndDate = new Date(today);
    projectedEndDate.setDate(today.getDate() + Math.round(daysToDepletion));
  }

  return {
    remainingHours: parseFloat(remainingHours.toFixed(4)),
    remainingValue: parseFloat(remainingValue.toFixed(2)),
    usedValue: parseFloat(usedValue.toFixed(2)),
    burnRate: parseFloat(burnRate.toFixed(4)),
    projectedEndDate,
    percentageUsed: parseFloat(percentageUsed.toFixed(2)),
    daysRemaining,
    hoursPerDayNeeded: parseFloat(hoursPerDayNeeded.toFixed(4)),
  };
}

export type LaborEmployee = {
  name: string;
  hourlyRate: number;
  hoursWorked: number;
  overheadMultiplier: number;
};

export type LaborCostResult = {
  perEmployee: {
    name: string;
    laborCost: number;
    totalCostWithOverhead: number;
    effectiveRate: number;
  }[];
  totalLaborCost: number;
  totalWithOverhead: number;
  averageCostPerHour: number;
};

export function calculateLaborCost(
  employees: LaborEmployee[]
): LaborCostResult {
  let totalLaborCost = 0;
  let totalWithOverhead = 0;
  let totalHours = 0;

  const perEmployee = employees.map((e) => {
    const laborCost = e.hourlyRate * e.hoursWorked;
    const totalCostWithOverhead = laborCost * e.overheadMultiplier;
    const effectiveRate = e.hoursWorked > 0 ? totalCostWithOverhead / e.hoursWorked : 0;

    totalLaborCost += laborCost;
    totalWithOverhead += totalCostWithOverhead;
    totalHours += e.hoursWorked;

    return {
      name: e.name || "Employee",
      laborCost: parseFloat(laborCost.toFixed(2)),
      totalCostWithOverhead: parseFloat(totalCostWithOverhead.toFixed(2)),
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    };
  });

  const averageCostPerHour = totalHours > 0 ? totalWithOverhead / totalHours : 0;

  return {
    perEmployee,
    totalLaborCost: parseFloat(totalLaborCost.toFixed(2)),
    totalWithOverhead: parseFloat(totalWithOverhead.toFixed(2)),
    averageCostPerHour: parseFloat(averageCostPerHour.toFixed(2)),
  };
}

export type FractionalClient = {
  name: string;
  hoursPerWeek: number;
  hourlyRate: number;
};

export type FractionalExecutiveResult = {
  perClient: {
    name: string;
    weeklyHours: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    percentageOfCapacity: number;
  }[];
  totalWeeklyHours: number;
  totalWeeklyRevenue: number;
  totalMonthlyRevenue: number;
  capacityUtilization: number;
  remainingCapacityHours: number;
  maxCapacityHours: number;
};

export function calculateFractionalExecutive(
  clients: FractionalClient[],
  maxCapacityHours: number = 40
): FractionalExecutiveResult {
  let totalWeeklyHours = 0;
  let totalWeeklyRevenue = 0;

  const perClient = clients.map((c) => {
    const weeklyRevenue = c.hoursPerWeek * c.hourlyRate;
    const monthlyRevenue = weeklyRevenue * 4.33;
    const percentageOfCapacity = maxCapacityHours > 0 ? (c.hoursPerWeek / maxCapacityHours) * 100 : 0;

    totalWeeklyHours += c.hoursPerWeek;
    totalWeeklyRevenue += weeklyRevenue;

    return {
      name: c.name || "Client",
      weeklyHours: c.hoursPerWeek,
      weeklyRevenue: parseFloat(weeklyRevenue.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      percentageOfCapacity: parseFloat(percentageOfCapacity.toFixed(2)),
    };
  });

  const totalMonthlyRevenue = totalWeeklyRevenue * 4.33;
  const capacityUtilization = maxCapacityHours > 0 ? (totalWeeklyHours / maxCapacityHours) * 100 : 0;
  const remainingCapacityHours = Math.max(0, maxCapacityHours - totalWeeklyHours);

  return {
    perClient,
    totalWeeklyHours,
    totalWeeklyRevenue: parseFloat(totalWeeklyRevenue.toFixed(2)),
    totalMonthlyRevenue: parseFloat(totalMonthlyRevenue.toFixed(2)),
    capacityUtilization: parseFloat(capacityUtilization.toFixed(2)),
    remainingCapacityHours,
    maxCapacityHours,
  };
}

export type SemiMonthlyPayResult = {
  grossPayPerPeriod: number;
  annualSalary: number;
  periods: PayrollPeriod[];
};

export function calculateSemiMonthlyPay(
  salaryType: 'hourly' | 'salary',
  amount: number,
  hoursPerWeek: number,
  firstPayDateStr: string,
  numberOfPeriods: number = 24
): SemiMonthlyPayResult {
  const annualSalary = salaryType === 'hourly' ? amount * hoursPerWeek * 52 : amount;
  const grossPayPerPeriod = annualSalary / 24;
  const periods = generatePayrollPeriods('semi-monthly', firstPayDateStr, numberOfPeriods);

  return {
    grossPayPerPeriod: parseFloat(grossPayPerPeriod.toFixed(2)),
    annualSalary: parseFloat(annualSalary.toFixed(2)),
    periods,
  };
}

// ----------------------------------------------------
// NEW GROUP 3 CALCULATION FUNCTIONS (TOOLS 41-60)
// ----------------------------------------------------

export type Milestone = {
  name: string;
  durationDays: number;
  bufferDays: number;
};

export type BackPlanResult = {
  milestones: {
    name: string;
    startDate: Date;
    endDate: Date;
    startDateFormatted: string;
    endDateFormatted: string;
    totalDays: number;
    businessDays: number;
    isCritical: boolean;
  }[];
  projectStartDate: Date;
  projectStartFormatted: string;
  totalProjectDays: number;
  totalBufferDays: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateBackPlan(
  deadlineDate: string,
  milestones: Milestone[],
  excludeWeekends: boolean
): BackPlanResult {
  if (!deadlineDate || !milestones || milestones.length === 0) {
    return {
      milestones: [],
      projectStartDate: new Date(),
      projectStartFormatted: "",
      totalProjectDays: 0,
      totalBufferDays: 0,
      isValid: false,
      errorMessage: "Missing deadline or milestones",
    };
  }

  const parts = deadlineDate.split("-");
  if (parts.length !== 3) {
    return {
      milestones: [],
      projectStartDate: new Date(),
      projectStartFormatted: "",
      totalProjectDays: 0,
      totalBufferDays: 0,
      isValid: false,
      errorMessage: "Invalid deadline date format",
    };
  }

  let currentEnd = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(currentEnd.getTime())) {
    return {
      milestones: [],
      projectStartDate: new Date(),
      projectStartFormatted: "",
      totalProjectDays: 0,
      totalBufferDays: 0,
      isValid: false,
      errorMessage: "Invalid deadline date",
    };
  }

  const resultMilestones: any[] = [];
  let totalBufferDays = 0;

  for (let i = milestones.length - 1; i >= 0; i--) {
    const m = milestones[i];
    const duration = m.durationDays || 0;
    const buffer = m.bufferDays || 0;
    const totalDays = duration + buffer;
    totalBufferDays += buffer;

    let endDate = new Date(currentEnd);
    if (excludeWeekends) {
      while (endDate.getDay() === 0 || endDate.getDay() === 6) {
        endDate.setDate(endDate.getDate() - 1);
      }
    }

    let startDate = new Date(endDate);
    let remaining = totalDays;
    while (remaining > 0) {
      startDate.setDate(startDate.getDate() - 1);
      if (excludeWeekends) {
        const dow = startDate.getDay();
        if (dow !== 0 && dow !== 6) {
          remaining--;
        }
      } else {
        remaining--;
      }
    }

    if (excludeWeekends) {
      while (startDate.getDay() === 0 || startDate.getDay() === 6) {
        startDate.setDate(startDate.getDate() - 1);
      }
    }

    const isCritical = buffer === 0;

    const formatDate = (d: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
    };

    let businessDays = 0;
    let curr = new Date(startDate);
    let endLimit = new Date(endDate);
    while (curr <= endLimit) {
      const dow = curr.getDay();
      if (dow !== 0 && dow !== 6) {
        businessDays++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    resultMilestones.unshift({
      name: m.name || `Milestone ${i + 1}`,
      startDate,
      endDate,
      startDateFormatted: formatDate(startDate),
      endDateFormatted: formatDate(endDate),
      totalDays: Math.round((endDate.getTime() - startDate.getTime()) / 86400000),
      businessDays,
      isCritical,
    });

    currentEnd = startDate;
  }

  const projectStartDate = resultMilestones[0].startDate;
  const deadline = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const totalProjectDays = Math.round((deadline.getTime() - projectStartDate.getTime()) / 86400000);

  const formatProjectStart = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(projectStartDate);

  return {
    milestones: resultMilestones,
    projectStartDate,
    projectStartFormatted: formatProjectStart,
    totalProjectDays,
    totalBufferDays,
    isValid: true,
  };
}

export type GanttTask = {
  id: string;
  name: string;
  durationDays: number;
  dependsOnId: string | null;
  lagDays: number;
};

export type GanttResult = {
  tasks: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    startDateFormatted: string;
    endDateFormatted: string;
    durationDays: number;
    dependsOn: string | null;
    lagDays: number;
    level: number;
  }[];
  projectEndDate: Date;
  projectEndFormatted: string;
  totalDuration: number;
  criticalPathLength: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateGanttDates(
  projectStartDate: string,
  tasks: GanttTask[],
  excludeWeekends: boolean
): GanttResult {
  if (!projectStartDate || !tasks || tasks.length === 0) {
    return {
      tasks: [],
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalDuration: 0,
      criticalPathLength: 0,
      isValid: false,
      errorMessage: "Missing start date or tasks",
    };
  }

  const parts = projectStartDate.split("-");
  if (parts.length !== 3) {
    return {
      tasks: [],
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalDuration: 0,
      criticalPathLength: 0,
      isValid: false,
      errorMessage: "Invalid start date format",
    };
  }

  const pStart = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(pStart.getTime())) {
    return {
      tasks: [],
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalDuration: 0,
      criticalPathLength: 0,
      isValid: false,
      errorMessage: "Invalid start date",
    };
  }

  const taskMap = new Map<string, GanttTask>();
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  tasks.forEach((t) => {
    taskMap.set(t.id, t);
    inDegree.set(t.id, 0);
    adj.set(t.id, []);
  });

  tasks.forEach((t) => {
    if (t.dependsOnId && taskMap.has(t.dependsOnId)) {
      adj.get(t.dependsOnId)!.push(t.id);
      inDegree.set(t.id, inDegree.get(t.id)! + 1);
    }
  });

  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    adj.get(u)!.forEach((v) => {
      inDegree.set(v, inDegree.get(v)! - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    });
  }

  if (order.length < tasks.length) {
    return {
      tasks: [],
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalDuration: 0,
      criticalPathLength: 0,
      isValid: false,
      errorMessage: "Circular dependency detected! Please resolve task loops.",
    };
  }

  const computedTasks = new Map<string, any>();
  const pathLengths = new Map<string, number>();

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const addDaysHelper = (base: Date, days: number, isWeekendExclusion: boolean): Date => {
    let current = new Date(base);
    if (isWeekendExclusion) {
      while (current.getDay() === 0 || current.getDay() === 6) {
        current.setDate(current.getDate() + 1);
      }
    }
    let rem = days;
    while (rem > 0) {
      current.setDate(current.getDate() + 1);
      if (isWeekendExclusion) {
        const dow = current.getDay();
        if (dow !== 0 && dow !== 6) {
          rem--;
        }
      } else {
        rem--;
      }
    }
    return current;
  };

  order.forEach((id) => {
    const t = taskMap.get(id)!;
    let startDate = new Date(pStart);
    let pathLength = t.durationDays;

    if (t.dependsOnId && computedTasks.has(t.dependsOnId)) {
      const parent = computedTasks.get(t.dependsOnId)!;
      startDate = addDaysHelper(parent.endDate, t.lagDays, excludeWeekends);
      pathLength = (pathLengths.get(t.dependsOnId) || 0) + t.lagDays + t.durationDays;
    }

    if (excludeWeekends) {
      while (startDate.getDay() === 0 || startDate.getDay() === 6) {
        startDate.setDate(startDate.getDate() + 1);
      }
    }

    const endDate = addDaysHelper(startDate, t.durationDays, excludeWeekends);
    pathLengths.set(id, pathLength);

    computedTasks.set(id, {
      id,
      name: t.name || `Task ${id}`,
      startDate,
      endDate,
      startDateFormatted: formatDate(startDate),
      endDateFormatted: formatDate(endDate),
      durationDays: t.durationDays,
      dependsOn: t.dependsOnId,
      lagDays: t.lagDays,
      level: t.dependsOnId ? (computedTasks.get(t.dependsOnId)?.level || 0) + 1 : 0,
    });
  });

  const finalTasks = order.map((id) => computedTasks.get(id)!);

  let projectEndDate = pStart;
  finalTasks.forEach((t) => {
    if (t.endDate > projectEndDate) {
      projectEndDate = t.endDate;
    }
  });

  const criticalPathLength = Math.max(0, ...Array.from(pathLengths.values()));
  const totalDuration = Math.round((projectEndDate.getTime() - pStart.getTime()) / 86400000);

  return {
    tasks: finalTasks,
    projectEndDate,
    projectEndFormatted: formatDate(projectEndDate),
    totalDuration,
    criticalPathLength,
    isValid: true,
  };
}

export type SprintResult = {
  sprints: {
    number: number;
    startDate: Date;
    endDate: Date;
    startFormatted: string;
    endFormatted: string;
    workingDays: number;
    sprintGoal?: string;
  }[];
  totalSprints: number;
  projectEndDate: Date;
  projectEndFormatted: string;
  totalWorkingDays: number;
  isValid: boolean;
  errorMessage?: string;
};

export function calculateSprintCalendar(
  projectStartDate: string,
  sprintLengthWeeks: number,
  numberOfSprints: number,
  sprintGoals: string[],
  excludeHolidays: string[]
): SprintResult {
  if (!projectStartDate) {
    return {
      sprints: [],
      totalSprints: 0,
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalWorkingDays: 0,
      isValid: false,
      errorMessage: "Please select a start date",
    };
  }

  const parts = projectStartDate.split("-");
  if (parts.length !== 3) {
    return {
      sprints: [],
      totalSprints: 0,
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalWorkingDays: 0,
      isValid: false,
      errorMessage: "Invalid start date format",
    };
  }

  let nextStart = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(nextStart.getTime())) {
    return {
      sprints: [],
      totalSprints: 0,
      projectEndDate: new Date(),
      projectEndFormatted: "",
      totalWorkingDays: 0,
      isValid: false,
      errorMessage: "Invalid start date",
    };
  }

  const sprints: any[] = [];
  let totalWorkingDays = 0;
  const holidays = new Set(excludeHolidays);

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  for (let i = 1; i <= numberOfSprints; i++) {
    let startDate = new Date(nextStart);
    if (startDate.getDay() === 6) {
      startDate.setDate(startDate.getDate() + 2);
    } else if (startDate.getDay() === 0) {
      startDate.setDate(startDate.getDate() + 1);
    }

    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (sprintLengthWeeks * 7) - 1);

    if (endDate.getDay() === 6) {
      endDate.setDate(endDate.getDate() - 1);
    } else if (endDate.getDay() === 0) {
      endDate.setDate(endDate.getDate() - 2);
    }

    let workingDays = 0;
    let curr = new Date(startDate);
    while (curr <= endDate) {
      const dow = curr.getDay();
      const dateStr = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, "0")}-${String(curr.getDate()).padStart(2, "0")}`;
      if (dow !== 0 && dow !== 6 && !holidays.has(dateStr)) {
        workingDays++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    totalWorkingDays += workingDays;

    sprints.push({
      number: i,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startFormatted: formatDate(startDate),
      endFormatted: formatDate(endDate),
      workingDays,
      sprintGoal: sprintGoals[i - 1] || "",
    });

    nextStart = new Date(endDate);
    nextStart.setDate(endDate.getDate() + 1);
  }

  const projectEndDate = sprints[sprints.length - 1]?.endDate || nextStart;

  return {
    sprints,
    totalSprints: numberOfSprints,
    projectEndDate,
    projectEndFormatted: formatDate(projectEndDate),
    totalWorkingDays,
    isValid: true,
  };
}

export type SLAResult = {
  deadlineDateTime: Date;
  deadlineDateFormatted: string;
  deadlineTimeFormatted: string;
  hoursRemaining: number;
  minutesRemaining: number;
  percentageElapsed: number;
  isBreached: boolean;
  breachHoursAgo: number;
  urgencyLevel: 'safe' | 'warning' | 'critical' | 'breached';
};

export function calculateSLACountdown(
  ticketCreatedAt: string,
  ticketCreatedTime: string,
  slaDurationHours: number,
  businessHoursOnly: boolean,
  businessHoursStart: number,
  businessHoursEnd: number,
  excludeWeekends: boolean
): SLAResult {
  if (!ticketCreatedAt || !ticketCreatedTime) {
    return {
      deadlineDateTime: new Date(),
      deadlineDateFormatted: "",
      deadlineTimeFormatted: "",
      hoursRemaining: 0,
      minutesRemaining: 0,
      percentageElapsed: 0,
      isBreached: false,
      breachHoursAgo: 0,
      urgencyLevel: 'safe',
    };
  }

  const parts = ticketCreatedAt.split("-");
  const timeParts = ticketCreatedTime.split(":");
  if (parts.length !== 3 || timeParts.length < 2) {
    return {
      deadlineDateTime: new Date(),
      deadlineDateFormatted: "",
      deadlineTimeFormatted: "",
      hoursRemaining: 0,
      minutesRemaining: 0,
      percentageElapsed: 0,
      isBreached: false,
      breachHoursAgo: 0,
      urgencyLevel: 'safe',
    };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const hrs = parseInt(timeParts[0], 10);
  const mins = parseInt(timeParts[1], 10);

  let deadline = new Date(year, month, day, hrs, mins, 0);

  if (businessHoursOnly) {
    const bhStart = Math.min(23, Math.max(0, businessHoursStart));
    const bhEnd = Math.min(24, Math.max(bhStart, businessHoursEnd));

    let remainingMinutes = slaDurationHours * 60;

    const adjustToBusinessWindow = (d: Date) => {
      let temp = new Date(d);
      while (true) {
        const dayOfWeek = temp.getDay();
        const currentHr = temp.getHours();

        if (excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
          temp.setDate(temp.getDate() + 1);
          temp.setHours(bhStart, 0, 0, 0);
          continue;
        }

        if (currentHr >= bhEnd) {
          temp.setDate(temp.getDate() + 1);
          temp.setHours(bhStart, 0, 0, 0);
          continue;
        }

        if (currentHr < bhStart) {
          temp.setHours(bhStart, 0, 0, 0);
          continue;
        }

        break;
      }
      return temp;
    };

    deadline = adjustToBusinessWindow(deadline);

    while (remainingMinutes > 0) {
      const currentHr = deadline.getHours();
      const currentMin = deadline.getMinutes();

      const minutesLeftToday = (bhEnd - currentHr) * 60 - currentMin;

      if (remainingMinutes <= minutesLeftToday) {
        deadline.setMinutes(deadline.getMinutes() + remainingMinutes);
        remainingMinutes = 0;
      } else {
        deadline.setDate(deadline.getDate() + 1);
        deadline.setHours(bhStart, 0, 0, 0);
        deadline = adjustToBusinessWindow(deadline);
        remainingMinutes -= minutesLeftToday;
      }
    }
  } else {
    deadline.setMinutes(deadline.getMinutes() + Math.round(slaDurationHours * 60));
  }

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const isBreached = diffMs <= 0;
  const absDiff = Math.abs(diffMs);
  const totalMinutesRemaining = Math.floor(absDiff / 60000);
  const hoursRemaining = Math.floor(totalMinutesRemaining / 60);
  const minutesRemaining = totalMinutesRemaining % 60;

  const breachHoursAgo = isBreached ? parseFloat((absDiff / 3600000).toFixed(2)) : 0;

  const totalSlaMs = slaDurationHours * 3600000;
  const elapsedMs = Math.max(0, totalSlaMs - diffMs);
  let percentageElapsed = totalSlaMs > 0 ? (elapsedMs / totalSlaMs) * 100 : 0;
  percentageElapsed = parseFloat(Math.min(100, Math.max(0, percentageElapsed)).toFixed(2));

  let urgencyLevel: 'safe' | 'warning' | 'critical' | 'breached' = 'safe';
  if (isBreached) {
    urgencyLevel = 'breached';
    percentageElapsed = 100;
  } else {
    const percentRemaining = 100 - percentageElapsed;
    if (percentRemaining < 25) {
      urgencyLevel = 'critical';
    } else if (percentRemaining <= 50) {
      urgencyLevel = 'warning';
    } else {
      urgencyLevel = 'safe';
    }
  }

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };
  const formatTime = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${pad(d.getMinutes())} ${ampm}`;
  };

  return {
    deadlineDateTime: deadline,
    deadlineDateFormatted: formatDate(deadline),
    deadlineTimeFormatted: formatTime(deadline),
    hoursRemaining,
    minutesRemaining,
    percentageElapsed,
    isBreached,
    breachHoursAgo,
    urgencyLevel,
  };
}

export type LeadTimeResult = {
  processingComplete: Date;
  shippingComplete: Date;
  customsComplete: Date;
  expectedDelivery: Date;
  totalLeadTimeDays: number;
  allDatesFormatted: {
    stage: string;
    date: string;
    days: number;
  }[];
};

export function calculateLeadTime(
  orderDate: string,
  processingDays: number,
  shippingDays: number,
  customsClearanceDays: number,
  bufferDays: number,
  excludeWeekends: boolean
): LeadTimeResult {
  const parts = orderDate.split("-");
  const base = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();

  const addDaysHelper = (startDate: Date, days: number): Date => {
    let current = new Date(startDate);
    let rem = days;
    while (rem > 0) {
      current.setDate(current.getDate() + 1);
      if (excludeWeekends) {
        const dow = current.getDay();
        if (dow !== 0 && dow !== 6) {
          rem--;
        }
      } else {
        rem--;
      }
    }
    if (excludeWeekends) {
      while (current.getDay() === 0 || current.getDay() === 6) {
        current.setDate(current.getDate() + 1);
      }
    }
    return current;
  };

  const processingComplete = addDaysHelper(base, processingDays);
  const shippingComplete = addDaysHelper(processingComplete, shippingDays);
  const customsComplete = addDaysHelper(shippingComplete, customsClearanceDays);
  const expectedDelivery = addDaysHelper(customsComplete, bufferDays);

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const allDatesFormatted = [
    { stage: "Order Placed", date: formatDate(base), days: 0 },
    { stage: "Processing Complete", date: formatDate(processingComplete), days: processingDays },
    { stage: "Shipped", date: formatDate(shippingComplete), days: shippingDays },
    { stage: "Customs Cleared", date: formatDate(customsComplete), days: customsClearanceDays },
    { stage: "Delivered (Expected)", date: formatDate(expectedDelivery), days: bufferDays },
  ];

  const totalLeadTimeDays = Math.round((expectedDelivery.getTime() - base.getTime()) / 86400000);

  return {
    processingComplete,
    shippingComplete,
    customsComplete,
    expectedDelivery,
    totalLeadTimeDays,
    allDatesFormatted,
  };
}

export type NoticePeriodResult = {
  noticeEndDate: Date;
  noticeEndFormatted: string;
  calendarDays: number;
  businessDays: number;
  lastWorkingDay: Date;
  lastWorkingDayFormatted: string;
};

export function calculateNoticePeriod(
  noticeStartDate: string,
  noticePeriodDays: number,
  noticePeriodType: 'calendar' | 'business',
  includeStartDay: boolean
): NoticePeriodResult {
  const parts = noticeStartDate.split("-");
  const base = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();

  let start = new Date(base);
  if (!includeStartDay) {
    start.setDate(start.getDate() + 1);
  }

  let noticeEndDate = new Date(start);
  let rem = noticePeriodDays - 1;
  if (rem < 0) rem = 0;

  const isBusiness = noticePeriodType === 'business';

  if (isBusiness) {
    while (noticeEndDate.getDay() === 0 || noticeEndDate.getDay() === 6) {
      noticeEndDate.setDate(noticeEndDate.getDate() + 1);
    }
  }

  while (rem > 0) {
    noticeEndDate.setDate(noticeEndDate.getDate() + 1);
    if (isBusiness) {
      const dow = noticeEndDate.getDay();
      if (dow !== 0 && dow !== 6) {
        rem--;
      }
    } else {
      rem--;
    }
  }

  const calendarDays = Math.round((noticeEndDate.getTime() - base.getTime()) / 86400000) + 1;

  let businessDays = 0;
  let curr = new Date(base);
  while (curr <= noticeEndDate) {
    const dow = curr.getDay();
    if (dow !== 0 && dow !== 6) {
      businessDays++;
    }
    curr.setDate(curr.getDate() + 1);
  }

  let lastWorkingDay = new Date(noticeEndDate);
  while (lastWorkingDay.getDay() === 0 || lastWorkingDay.getDay() === 6) {
    lastWorkingDay.setDate(lastWorkingDay.getDate() - 1);
  }

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  return {
    noticeEndDate,
    noticeEndFormatted: formatDate(noticeEndDate),
    calendarDays,
    businessDays,
    lastWorkingDay,
    lastWorkingDayFormatted: formatDate(lastWorkingDay),
  };
}

export type SubscriptionEntry = {
  name: string;
  startDate: string;
  billingCycle: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  amount: number;
  currency: string;
  autoRenews: boolean;
};

export type SubscriptionRenewalResult = {
  subscriptions: {
    name: string;
    nextRenewalDate: Date;
    nextRenewalFormatted: string;
    daysUntilRenewal: number;
    annualCost: number;
    isRenewingSoon: boolean;
    urgencyLevel: 'upcoming' | 'soon' | 'imminent';
    amount: number;
  }[];
  totalMonthlyEstimate: number;
  totalAnnualEstimate: number;
  nextRenewal: { name: string; date: Date | null; amount: number } | null;
};

export function calculateSubscriptionRenewal(
  subscriptions: SubscriptionEntry[]
): SubscriptionRenewalResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalMonthlyEstimate = 0;
  let totalAnnualEstimate = 0;

  const resultSubs = subscriptions.map((s) => {
    const parts = s.startDate.split("-");
    const start = parts.length === 3
      ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      : new Date();
    start.setHours(0, 0, 0, 0);

    let renewal = new Date(start);
    const monthsStep = s.billingCycle === 'monthly' ? 1
      : s.billingCycle === 'quarterly' ? 3
        : s.billingCycle === 'biannual' ? 6
          : 12;

    while (renewal < today) {
      renewal.setMonth(renewal.getMonth() + monthsStep);
    }

    const diffMs = renewal.getTime() - today.getTime();
    const daysUntilRenewal = Math.round(diffMs / 86400000);

    let annualCost = s.amount;
    if (s.billingCycle === 'monthly') {
      annualCost = s.amount * 12;
      totalMonthlyEstimate += s.amount;
    } else if (s.billingCycle === 'quarterly') {
      annualCost = s.amount * 4;
      totalMonthlyEstimate += s.amount / 3;
    } else if (s.billingCycle === 'biannual') {
      annualCost = s.amount * 2;
      totalMonthlyEstimate += s.amount / 6;
    } else if (s.billingCycle === 'annual') {
      totalMonthlyEstimate += s.amount / 12;
    }
    totalAnnualEstimate += annualCost;

    const isRenewingSoon = daysUntilRenewal <= 30;
    let urgencyLevel: 'upcoming' | 'soon' | 'imminent' = 'upcoming';
    if (daysUntilRenewal <= 7) {
      urgencyLevel = 'imminent';
    } else if (daysUntilRenewal <= 30) {
      urgencyLevel = 'soon';
    }

    const formatDate = (d: Date) => {
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
    };

    return {
      name: s.name || "Subscription",
      nextRenewalDate: renewal,
      nextRenewalFormatted: formatDate(renewal),
      daysUntilRenewal,
      annualCost,
      isRenewingSoon,
      urgencyLevel,
      amount: s.amount,
    };
  });

  resultSubs.sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

  const next = resultSubs[0]
    ? { name: resultSubs[0].name, date: resultSubs[0].nextRenewalDate, amount: resultSubs[0].amount }
    : null;

  return {
    subscriptions: resultSubs,
    totalMonthlyEstimate: parseFloat(totalMonthlyEstimate.toFixed(2)),
    totalAnnualEstimate: parseFloat(totalAnnualEstimate.toFixed(2)),
    nextRenewal: next,
  };
}

export type EventStage = {
  name: string;
  durationMinutes: number;
  bufferMinutes: number;
};

export type EventBackTimerResult = {
  stages: {
    name: string;
    startTime: Date;
    endTime: Date;
    startFormatted: string;
    endFormatted: string;
    durationMinutes: number;
    bufferMinutes: number;
  }[];
  setupStartTime: Date;
  setupStartFormatted: string;
  totalSetupMinutes: number;
};

export function calculateEventBackTimer(
  eventDateTime: string,
  stages: EventStage[]
): EventBackTimerResult {
  let currentStart = new Date(eventDateTime);
  if (isNaN(currentStart.getTime())) {
    currentStart = new Date();
  }

  const resultStages: any[] = [];
  let totalSetupMinutes = 0;

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  };

  for (let i = stages.length - 1; i >= 0; i--) {
    const s = stages[i];
    const duration = s.durationMinutes || 0;
    const buffer = s.bufferMinutes || 0;
    totalSetupMinutes += duration + buffer;

    let endTime = new Date(currentStart);
    let startTime = new Date(endTime);
    startTime.setMinutes(endTime.getMinutes() - (duration + buffer));

    resultStages.unshift({
      name: s.name || `Stage ${i + 1}`,
      startTime,
      endTime,
      startFormatted: formatDate(startTime),
      endFormatted: formatDate(endTime),
      durationMinutes: duration,
      bufferMinutes: buffer,
    });

    currentStart = startTime;
  }

  const setupStartTime = resultStages[0]?.startTime || currentStart;

  return {
    stages: resultStages,
    setupStartTime,
    setupStartFormatted: formatDate(setupStartTime),
    totalSetupMinutes,
  };
}

export type FiscalQuarterResult = {
  fiscalQuarter: number;
  fiscalYear: number;
  quarterStartDate: Date;
  quarterEndDate: Date;
  quarterStartFormatted: string;
  quarterEndFormatted: string;
  daysIntoQuarter: number;
  daysRemainingInQuarter: number;
  percentageComplete: number;
  calendarYear: number;
  calendarQuarter: number;
};

export function calculateFiscalQuarter(
  dateStr: string,
  fiscalYearStartMonth: number
): FiscalQuarterResult {
  const parts = dateStr.split("-");
  const date = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();

  const cYear = date.getFullYear();
  const cMonth = date.getMonth();
  const cQuarter = Math.floor(cMonth / 3) + 1;

  const startMonthIndex = fiscalYearStartMonth - 1;

  let relativeMonth = cMonth - startMonthIndex;
  if (relativeMonth < 0) {
    relativeMonth += 12;
  }

  const fiscalQuarter = Math.floor(relativeMonth / 3) + 1;

  let qStartMonth = startMonthIndex + (fiscalQuarter - 1) * 3;
  let qStartYear = cYear;
  if (qStartMonth >= 12) {
    qStartMonth -= 12;
    qStartYear += 1;
  }
  if (cMonth < startMonthIndex) {
    qStartYear = cYear - 1;
  } else {
    qStartYear = cYear;
  }

  let qStart = new Date(qStartYear, qStartMonth, 1);
  if (qStart > date) {
    qStartYear--;
    qStart = new Date(qStartYear, qStartMonth, 1);
  }

  let qEnd = new Date(qStart.getFullYear(), qStart.getMonth() + 3, 0);
  const fiscalYear = qStart.getFullYear();

  const daysIntoQuarter = Math.round((date.getTime() - qStart.getTime()) / 86400000) + 1;
  const totalDaysInQuarter = Math.round((qEnd.getTime() - qStart.getTime()) / 86400000) + 1;
  const daysRemainingInQuarter = Math.max(0, totalDaysInQuarter - daysIntoQuarter);
  const percentageComplete = parseFloat(((daysIntoQuarter / totalDaysInQuarter) * 100).toFixed(2));

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  return {
    fiscalQuarter,
    fiscalYear,
    quarterStartDate: qStart,
    quarterEndDate: qEnd,
    quarterStartFormatted: formatDate(qStart),
    quarterEndFormatted: formatDate(qEnd),
    daysIntoQuarter,
    daysRemainingInQuarter,
    percentageComplete,
    calendarYear: cYear,
    calendarQuarter: cQuarter,
  };
}

export type MilestoneBufferResult = {
  baseDuration: number;
  bufferDays: number;
  totalDuration: number;
  bufferPercentage: number;
  riskAdjustedBuffer: number;
  recommendation: string;
};

export function calculateMilestoneBuffer(
  baseDurationDays: number,
  bufferPercentage: number,
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  customBufferDays: number
): MilestoneBufferResult {
  let riskMultiplier = 1.0;
  if (riskLevel === 'low') riskMultiplier = 0.75;
  else if (riskLevel === 'high') riskMultiplier = 1.5;
  else if (riskLevel === 'critical') riskMultiplier = 2.0;

  const rawBuffer = baseDurationDays * (bufferPercentage / 100);
  const riskAdjustedBuffer = rawBuffer * riskMultiplier;
  const bufferDays = Math.round(riskAdjustedBuffer + customBufferDays);
  const totalDuration = baseDurationDays + bufferDays;

  let recommendation = "";
  if (riskLevel === 'critical') {
    recommendation = "Critical risk profile: add significant buffer and consider splitting deliverables into smaller sprint blocks.";
  } else if (riskLevel === 'high') {
    recommendation = "High risk profile: 1.5x buffer adjustment applied. Closely monitor milestones.";
  } else {
    recommendation = "Standard risk profile. Scheduled buffers are sufficient.";
  }

  return {
    baseDuration: baseDurationDays,
    bufferDays,
    totalDuration,
    bufferPercentage,
    riskAdjustedBuffer: parseFloat(riskAdjustedBuffer.toFixed(2)),
    recommendation,
  };
}

export type RetentionExpiryResult = {
  expiryDate: Date;
  expiryFormatted: string;
  daysUntilExpiry: number;
  isExpired: boolean;
  expiredDaysAgo: number;
  totalRetentionDays: number;
};

export function calculateRetentionExpiry(
  recordDate: string,
  retentionYears: number,
  retentionMonths: number,
  retentionDays: number,
  jurisdictionExtension: number
): RetentionExpiryResult {
  const parts = recordDate.split("-");
  let expiry = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();

  expiry.setFullYear(expiry.getFullYear() + retentionYears);
  expiry.setMonth(expiry.getMonth() + retentionMonths);
  expiry.setDate(expiry.getDate() + retentionDays + jurisdictionExtension);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const daysUntilExpiry = Math.round(diffMs / 86400000);
  const isExpired = daysUntilExpiry < 0;
  const expiredDaysAgo = isExpired ? Math.abs(daysUntilExpiry) : 0;

  const originalStart = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();
  const totalRetentionDays = Math.round((expiry.getTime() - originalStart.getTime()) / 86400000);

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  return {
    expiryDate: expiry,
    expiryFormatted: formatDate(expiry),
    daysUntilExpiry: Math.max(0, daysUntilExpiry),
    isExpired,
    expiredDaysAgo,
    totalRetentionDays,
  };
}

export type IncidentEntry = {
  startDateTime: string;
  endDateTime: string;
  category: string;
};

export type DowntimeResult = {
  totalDowntimeMinutes: number;
  totalDowntimeFormatted: string;
  uptimePercentage: number;
  downtimePercentage: number;
  longestIncident: { duration: number; category: string };
  byCategory: {
    category: string;
    totalMinutes: number;
    percentage: number;
    incidents: number;
  }[];
  averageIncidentDuration: number;
  totalIncidents: number;
  measuredPeriodDays: number;
};

export function calculateDowntime(
  incidents: IncidentEntry[]
): DowntimeResult {
  if (!incidents || incidents.length === 0) {
    return {
      totalDowntimeMinutes: 0,
      totalDowntimeFormatted: "0m",
      uptimePercentage: 100,
      downtimePercentage: 0,
      longestIncident: { duration: 0, category: "N/A" },
      byCategory: [],
      averageIncidentDuration: 0,
      totalIncidents: 0,
      measuredPeriodDays: 1,
    };
  }

  let totalDowntimeMinutes = 0;
  let minStartMs = Infinity;
  let maxEndMs = -Infinity;
  let longestIncident = { duration: 0, category: "Unknown" };

  const catMap: Record<string, { totalMinutes: number; count: number }> = {};

  incidents.forEach((inc) => {
    if (!inc.startDateTime || !inc.endDateTime) return;
    const start = new Date(inc.startDateTime);
    const end = new Date(inc.endDateTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    const diffMins = Math.round((end.getTime() - start.getTime()) / 60000);
    if (diffMins < 0) return;

    totalDowntimeMinutes += diffMins;
    minStartMs = Math.min(minStartMs, start.getTime());
    maxEndMs = Math.max(maxEndMs, end.getTime());

    if (diffMins > longestIncident.duration) {
      longestIncident = { duration: diffMins, category: inc.category };
    }

    const cat = inc.category || "Unknown";
    if (!catMap[cat]) catMap[cat] = { totalMinutes: 0, count: 0 };
    catMap[cat].totalMinutes += diffMins;
    catMap[cat].count += 1;
  });

  const totalIncidents = incidents.length;
  const averageIncidentDuration = totalIncidents > 0 ? totalDowntimeMinutes / totalIncidents : 0;

  let totalPeriodMinutes = 1440;
  let measuredPeriodDays = 1;
  if (minStartMs !== Infinity && maxEndMs !== -Infinity) {
    const totalPeriodMs = Math.max(1440 * 60000, maxEndMs - minStartMs);
    totalPeriodMinutes = Math.round(totalPeriodMs / 60000);
    measuredPeriodDays = parseFloat((totalPeriodMinutes / 1440).toFixed(2));
  }

  const uptimePercentage = ((totalPeriodMinutes - totalDowntimeMinutes) / totalPeriodMinutes) * 100;
  const downtimePercentage = 100 - uptimePercentage;

  const byCategory = Object.entries(catMap).map(([category, data]) => ({
    category,
    totalMinutes: data.totalMinutes,
    percentage: parseFloat(((data.totalMinutes / totalDowntimeMinutes) * 100).toFixed(2)),
    incidents: data.count,
  }));

  const formatDowntime = (mins: number): string => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return hrs > 0 ? `${hrs}h ${m}m` : `${m}m`;
  };

  return {
    totalDowntimeMinutes,
    totalDowntimeFormatted: formatDowntime(totalDowntimeMinutes),
    uptimePercentage: parseFloat(uptimePercentage.toFixed(3)),
    downtimePercentage: parseFloat(downtimePercentage.toFixed(3)),
    longestIncident,
    byCategory,
    averageIncidentDuration: parseFloat(averageIncidentDuration.toFixed(1)),
    totalIncidents,
    measuredPeriodDays,
  };
}

export function generateRRULE(
  startDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly',
  interval: number,
  daysOfWeek: number[],
  endType: 'never' | 'count' | 'until',
  count: number,
  untilDate: string
): {
  rrule: string;
  humanReadable: string;
  nextOccurrences: Date[];
  nextOccurrencesFormatted: string[];
} {
  const freqStr = frequency.toUpperCase();
  let rrule = `FREQ=${freqStr};INTERVAL=${interval}`;

  const daysMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  let humanDays = "";
  if (frequency === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
    const byday = daysOfWeek.map((d) => daysMap[d]).join(",");
    rrule += `;BYDAY=${byday}`;
    humanDays = " on " + daysOfWeek.map((d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]).join(", ");
  }

  if (endType === 'count' && count > 0) {
    rrule += `;COUNT=${count}`;
  } else if (endType === 'until' && untilDate) {
    const formattedUntil = untilDate.replace(/-/g, "");
    rrule += `;UNTIL=${formattedUntil}T235959Z`;
  }

  const humanFreq = interval === 1 ? frequency : `every ${interval} ${frequency === 'daily' ? 'days' : frequency === 'weekly' ? 'weeks' : frequency === 'monthly' ? 'months' : 'years'}`;
  const humanReadable = `Occurs ${humanFreq}${humanDays}`;

  const nextOccurrences: Date[] = [];
  const nextOccurrencesFormatted: string[] = [];

  const parts = startDate.split("-");
  let current = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();
  current.setHours(0, 0, 0, 0);

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  let limit = 0;
  while (nextOccurrences.length < 5 && limit < 365) {
    const dow = current.getDay();
    let matches = true;

    if (frequency === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
      matches = daysOfWeek.includes(dow);
    }

    if (matches) {
      nextOccurrences.push(new Date(current));
      nextOccurrencesFormatted.push(formatDate(current));
    }

    if (frequency === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
      current.setDate(current.getDate() + 1);
    } else {
      if (frequency === 'daily') {
        current.setDate(current.getDate() + interval);
      } else if (frequency === 'weekly') {
        current.setDate(current.getDate() + interval * 7);
      } else if (frequency === 'monthly') {
        current.setMonth(current.getMonth() + interval);
      } else if (frequency === 'yearly') {
        current.setFullYear(current.getFullYear() + interval);
      }
    }
    limit++;
  }

  return {
    rrule: `RRULE:${rrule}`,
    humanReadable,
    nextOccurrences,
    nextOccurrencesFormatted,
  };
}

export type InvoiceDueDateResult = {
  dueDate: Date;
  dueDateFormatted: string;
  daysUntilDue: number;
  isOverdue: boolean;
  overdueDays: number;
  paymentTermsLabel: string;
  latePaymentDate: Date;
  latePaymentFormatted: string;
};

export function calculateInvoiceDueDate(
  invoiceDate: string,
  paymentTerms: 'net7' | 'net14' | 'net30' | 'net45' | 'net60' | 'net90' | 'eom' | 'custom',
  customDays: number,
  businessDaysOnly: boolean
): InvoiceDueDateResult {
  const parts = invoiceDate.split("-");
  const base = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();

  let daysToAdd = 30;
  let label = "Net 30";
  if (paymentTerms === 'net7') { daysToAdd = 7; label = "Net 7"; }
  else if (paymentTerms === 'net14') { daysToAdd = 14; label = "Net 14"; }
  else if (paymentTerms === 'net45') { daysToAdd = 45; label = "Net 45"; }
  else if (paymentTerms === 'net60') { daysToAdd = 60; label = "Net 60"; }
  else if (paymentTerms === 'net90') { daysToAdd = 90; label = "Net 90"; }
  else if (paymentTerms === 'custom') { daysToAdd = customDays; label = `Custom (${customDays} days)`; }

  let dueDate = new Date(base);

  if (paymentTerms === 'eom') {
    dueDate = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    label = "End of Month (EOM)";
  } else {
    let rem = daysToAdd;
    while (rem > 0) {
      dueDate.setDate(dueDate.getDate() + 1);
      if (businessDaysOnly) {
        const dow = dueDate.getDay();
        if (dow !== 0 && dow !== 6) {
          rem--;
        }
      } else {
        rem--;
      }
    }
  }

  if (dueDate.getDay() === 6) {
    dueDate.setDate(dueDate.getDate() + 2);
  } else if (dueDate.getDay() === 0) {
    dueDate.setDate(dueDate.getDate() + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = dueDate.getTime() - today.getTime();
  const daysUntilDue = Math.round(diffMs / 86400000);
  const isOverdue = daysUntilDue < 0;
  const overdueDays = isOverdue ? Math.abs(daysUntilDue) : 0;

  const latePaymentDate = new Date(dueDate);
  latePaymentDate.setDate(dueDate.getDate() + 30);

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  return {
    dueDate,
    dueDateFormatted: formatDate(dueDate),
    daysUntilDue: Math.max(0, daysUntilDue),
    isOverdue,
    overdueDays,
    paymentTermsLabel: label,
    latePaymentDate,
    latePaymentFormatted: formatDate(latePaymentDate),
  };
}

export type CourtDeadlineResult = {
  deadlineDate: Date;
  deadlineDateFormatted: string;
  deadlineDayOfWeek: string;
  adjustedDeadline: Date;
  adjustedDeadlineFormatted: string;
  isAdjusted: boolean;
  adjustmentReason: string;
  daysUntilDeadline: number;
};

export function calculateCourtDeadline(
  triggerDate: string,
  deadlineDays: number,
  deadlineType: 'calendar' | 'business',
  jurisdiction: string,
  excludeCourtHolidays: boolean
): CourtDeadlineResult {
  const parts = triggerDate.split("-");
  const base = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();

  const getFederalHolidays = (year: number): Set<string> => {
    const holidays = new Set<string>();
    holidays.add(`${year}-01-01`);

    let mlk = new Date(year, 0, 15);
    while (mlk.getDay() !== 1) mlk.setDate(mlk.getDate() - 1);
    holidays.add(`${year}-01-${String(mlk.getDate()).padStart(2, "0")}`);

    let pres = new Date(year, 1, 15);
    while (pres.getDay() !== 1) pres.setDate(pres.getDate() - 1);
    holidays.add(`${year}-02-${String(pres.getDate()).padStart(2, "0")}`);

    let mem = new Date(year, 4, 31);
    while (mem.getDay() !== 1) mem.setDate(mem.getDate() - 1);
    holidays.add(`${year}-05-${String(mem.getDate()).padStart(2, "0")}`);

    holidays.add(`${year}-06-19`);
    holidays.add(`${year}-07-04`);

    let lab = new Date(year, 8, 1);
    while (lab.getDay() !== 1) lab.setDate(lab.getDate() + 1);
    holidays.add(`${year}-09-${String(lab.getDate()).padStart(2, "0")}`);

    let col = new Date(year, 9, 8);
    while (col.getDay() !== 1) col.setDate(col.getDate() + 1);
    holidays.add(`${year}-10-${String(col.getDate()).padStart(2, "0")}`);

    holidays.add(`${year}-11-11`);

    let tbg = new Date(year, 10, 22);
    while (tbg.getDay() !== 4) tbg.setDate(tbg.getDate() + 1);
    holidays.add(`${year}-11-${String(tbg.getDate()).padStart(2, "0")}`);

    holidays.add(`${year}-12-25`);

    return holidays;
  };

  let deadline = new Date(base);
  let rem = deadlineDays;

  const isBusiness = deadlineType === 'business';

  while (rem > 0) {
    deadline.setDate(deadline.getDate() + 1);
    const yr = deadline.getFullYear();
    const dateStr = `${yr}-${String(deadline.getMonth() + 1).padStart(2, "0")}-${String(deadline.getDate()).padStart(2, "0")}`;
    const isFedHoliday = getFederalHolidays(yr).has(dateStr);

    if (isBusiness) {
      const dow = deadline.getDay();
      if (dow !== 0 && dow !== 6 && (!excludeCourtHolidays || !isFedHoliday)) {
        rem--;
      }
    } else {
      rem--;
    }
  }

  let adjustedDeadline = new Date(deadline);
  let isAdjusted = false;
  let adjustmentReason = "";

  while (true) {
    const dow = adjustedDeadline.getDay();
    const yr = adjustedDeadline.getFullYear();
    const dateStr = `${yr}-${String(adjustedDeadline.getMonth() + 1).padStart(2, "0")}-${String(adjustedDeadline.getDate()).padStart(2, "0")}`;
    const isFedHoliday = getFederalHolidays(yr).has(dateStr);

    if (dow === 0 || dow === 6) {
      adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
      isAdjusted = true;
      adjustmentReason = "Deadline fell on a weekend, adjusted to next business day.";
      continue;
    }

    if (excludeCourtHolidays && isFedHoliday) {
      adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
      isAdjusted = true;
      adjustmentReason = "Deadline fell on a court holiday, adjusted to next business day.";
      continue;
    }

    break;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDeadline = Math.max(0, Math.round((adjustedDeadline.getTime() - today.getTime()) / 86400000));

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return {
    deadlineDate: deadline,
    deadlineDateFormatted: formatDate(deadline),
    deadlineDayOfWeek: days[adjustedDeadline.getDay()],
    adjustedDeadline,
    adjustedDeadlineFormatted: formatDate(adjustedDeadline),
    isAdjusted,
    adjustmentReason,
    daysUntilDeadline,
  };
}

export type DeliverySlipRiskResult = {
  daysRemaining: number;
  daysElapsed: number;
  totalProjectDays: number;
  expectedCompletionAtCurrentRate: Date;
  expectedCompletionFormatted: string;
  slipDays: number;
  riskScore: number;
  riskLevel: 'on-track' | 'at-risk' | 'high-risk' | 'critical';
  velocityRatio: number;
};

export function calculateDeliverySlipRisk(
  plannedDeliveryDate: string,
  currentDateStr: string,
  completionPercentage: number,
  originalStartDate: string
): DeliverySlipRiskResult {
  const parseDate = (str: string) => {
    const parts = str.split("-");
    return parts.length === 3
      ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      : new Date();
  };

  const start = parseDate(originalStartDate);
  const planned = parseDate(plannedDeliveryDate);
  const current = currentDateStr ? parseDate(currentDateStr) : new Date();
  current.setHours(0, 0, 0, 0);

  const totalProjectDays = Math.max(1, Math.round((planned.getTime() - start.getTime()) / 86400000));
  const daysElapsed = Math.max(1, Math.round((current.getTime() - start.getTime()) / 86400000));
  const daysRemaining = Math.max(0, Math.round((planned.getTime() - current.getTime()) / 86400000));

  const timeElapsedPercent = (daysElapsed / totalProjectDays) * 100;
  const velocityRatio = timeElapsedPercent > 0
    ? parseFloat((completionPercentage / timeElapsedPercent).toFixed(3))
    : 1.0;

  const completionPerDay = completionPercentage / daysElapsed;
  let expectedCompletionAtCurrentRate = new Date(planned);
  let slipDays = 0;

  if (completionPerDay > 0) {
    const totalDaysNeeded = 100 / completionPerDay;
    expectedCompletionAtCurrentRate = new Date(start);
    expectedCompletionAtCurrentRate.setDate(start.getDate() + Math.round(totalDaysNeeded));
    slipDays = Math.max(0, Math.round((expectedCompletionAtCurrentRate.getTime() - planned.getTime()) / 86400000));
  }

  let riskScore = 0;
  if (velocityRatio < 1) {
    riskScore = Math.min(100, Math.round((1 - velocityRatio) * 100));
  }

  let riskLevel: 'on-track' | 'at-risk' | 'high-risk' | 'critical' = 'on-track';
  if (velocityRatio < 0.5) riskLevel = 'critical';
  else if (velocityRatio < 0.7) riskLevel = 'high-risk';
  else if (velocityRatio < 0.9) riskLevel = 'at-risk';

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  return {
    daysRemaining,
    daysElapsed,
    totalProjectDays,
    expectedCompletionAtCurrentRate,
    expectedCompletionFormatted: formatDate(expectedCompletionAtCurrentRate),
    slipDays,
    riskScore,
    riskLevel,
    velocityRatio,
  };
}

export type PomodoroSegment = {
  type: 'focus' | 'short-break' | 'long-break';
  startTime: string;
  endTime: string;
  sessionNumber: number;
};

export type PomodoroScheduleResult = {
  segments: PomodoroSegment[];
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  completionTime: string;
  totalSessions: number;
};

export function calculatePomodoroSchedule(
  workStartTime: string,
  totalWorkMinutes: number,
  focusMinutes: number,
  shortBreakMinutes: number,
  longBreakMinutes: number,
  sessionsBeforeLongBreak: number
): PomodoroScheduleResult {
  const parts = workStartTime.split(":");
  let hrs = 9;
  let mins = 0;
  if (parts.length === 2) {
    hrs = parseInt(parts[0], 10);
    mins = parseInt(parts[1], 10);
  }

  let current = new Date();
  current.setHours(hrs, mins, 0, 0);

  const segments: PomodoroSegment[] = [];
  let remainingWork = totalWorkMinutes;
  let focusSessionCount = 0;
  let totalFocusMinutes = 0;
  let totalBreakMinutes = 0;

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  while (remainingWork > 0) {
    const blockFocus = Math.min(remainingWork, focusMinutes);
    focusSessionCount++;
    totalFocusMinutes += blockFocus;

    const startFocus = new Date(current);
    current.setMinutes(current.getMinutes() + blockFocus);
    const endFocus = new Date(current);

    segments.push({
      type: 'focus',
      startTime: formatTime(startFocus),
      endTime: formatTime(endFocus),
      sessionNumber: focusSessionCount,
    });

    remainingWork -= blockFocus;
    if (remainingWork <= 0) break;

    const isLongBreak = focusSessionCount % sessionsBeforeLongBreak === 0;
    const breakDur = isLongBreak ? longBreakMinutes : shortBreakMinutes;
    const blockBreak = Math.min(remainingWork, breakDur);
    totalBreakMinutes += blockBreak;

    const startBreak = new Date(current);
    current.setMinutes(current.getMinutes() + blockBreak);
    const endBreak = new Date(current);

    segments.push({
      type: isLongBreak ? 'long-break' : 'short-break',
      startTime: formatTime(startBreak),
      endTime: formatTime(endBreak),
      sessionNumber: focusSessionCount,
    });

    remainingWork -= blockBreak;
  }

  return {
    segments,
    totalFocusMinutes,
    totalBreakMinutes,
    completionTime: formatTime(current),
    totalSessions: focusSessionCount,
  };
}

export type TeamMember = {
  name: string;
  timezone: string;
  workStart: number;
  workEnd: number;
  workDays: number[];
};

export type TeamAvailabilityResult = {
  memberAvailability: {
    name: string;
    timezone: string;
    localWorkStart: string;
    localWorkEnd: string;
    isWorkday: boolean;
  }[];
  overlapWindows: {
    startUTC: string;
    endUTC: string;
    durationMinutes: number;
    localTimes: { name: string; time: string }[];
  }[];
  bestMeetingTime: string;
  hasOverlap: boolean;
};

export function calculateTeamAvailability(
  teamMembers: TeamMember[],
  meetingDate: string
): TeamAvailabilityResult {
  const parts = meetingDate.split("-");
  const baseDate = parts.length === 3
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date();
  baseDate.setHours(0, 0, 0, 0);

  const memberAvailability = teamMembers.map((m) => {
    let isWorkday = true;
    try {
      const dateStr = baseDate.toLocaleString("en-US", { timeZone: m.timezone });
      const localDate = new Date(dateStr);
      const dow = localDate.getDay();
      isWorkday = m.workDays.includes(dow);
    } catch (e) {
      isWorkday = m.workDays.includes(baseDate.getDay());
    }

    const pad = (n: number) => String(n).padStart(2, "0");

    return {
      name: m.name || "Member",
      timezone: m.timezone,
      localWorkStart: `${pad(m.workStart)}:00`,
      localWorkEnd: `${pad(m.workEnd)}:00`,
      isWorkday,
    };
  });

  const hourlyOverlap: boolean[] = Array.from({ length: 48 }).map(() => true);

  teamMembers.forEach((m) => {
    const memberAvailabilityItem = memberAvailability.find((ma) => ma.name === m.name);
    if (memberAvailabilityItem && !memberAvailabilityItem.isWorkday) {
      for (let i = 0; i < 48; i++) hourlyOverlap[i] = false;
      return;
    }

    for (let slot = 0; slot < 48; slot++) {
      const slotHr = Math.floor(slot / 2);
      const slotMin = (slot % 2) * 30;
      const slotDateUTC = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), slotHr, slotMin, 0));

      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: m.timezone,
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        const parts = formatter.formatToParts(slotDateUTC);
        const localHour = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
        const localMin = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
        const localTimeVal = localHour + localMin / 60;

        if (localTimeVal < m.workStart || localTimeVal >= m.workEnd) {
          hourlyOverlap[slot] = false;
        }
      } catch (e) {
        const localTimeVal = slotHr + slotMin / 60;
        if (localTimeVal < m.workStart || localTimeVal >= m.workEnd) {
          hourlyOverlap[slot] = false;
        }
      }
    }
  });

  const overlapWindows: any[] = [];
  let inWindow = false;
  let winStart = 0;

  const pad = (n: number) => String(n).padStart(2, "0");

  for (let slot = 0; slot < 48; slot++) {
    if (hourlyOverlap[slot]) {
      if (!inWindow) {
        inWindow = true;
        winStart = slot;
      }
    } else {
      if (inWindow) {
        inWindow = false;
        overlapWindows.push({ start: winStart, end: slot });
      }
    }
  }
  if (inWindow) {
    overlapWindows.push({ start: winStart, end: 48 });
  }

  const finalWindows = overlapWindows.map((w) => {
    const startHr = Math.floor(w.start / 2);
    const startMin = (w.start % 2) * 30;
    const endHr = Math.floor(w.end / 2);
    const endMin = (w.end % 2) * 30;

    const startUTC = `${pad(startHr)}:${pad(startMin)} UTC`;
    const endUTC = `${pad(endHr)}:${pad(endMin)} UTC`;
    const durationMinutes = (w.end - w.start) * 30;

    const midSlot = Math.floor((w.start + w.end) / 2);
    const midHr = Math.floor(midSlot / 2);
    const midMin = (midSlot % 2) * 30;
    const midUTC = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), midHr, midMin, 0));

    const localTimes = teamMembers.map((m) => {
      let localTimeStr = "";
      try {
        localTimeStr = midUTC.toLocaleTimeString("en-US", {
          timeZone: m.timezone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } catch (e) {
        localTimeStr = midUTC.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      }
      return { name: m.name, time: localTimeStr };
    });

    return {
      startUTC,
      endUTC,
      durationMinutes,
      localTimes,
    };
  });

  let bestMeetingTime = "No overlapping availability";
  let hasOverlap = finalWindows.length > 0;

  if (hasOverlap) {
    finalWindows.sort((a, b) => b.durationMinutes - a.durationMinutes);
    const best = finalWindows[0];
    bestMeetingTime = `${best.startUTC} to ${best.endUTC} (${best.durationMinutes} mins)`;
  }

  return {
    memberAvailability,
    overlapWindows: finalWindows,
    bestMeetingTime,
    hasOverlap,
  };
}

export type FloatTask = {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
};

export type CriticalPathFloatResult = {
  tasks: {
    id: string;
    name: string;
    earliestStart: number;
    earliestFinish: number;
    latestStart: number;
    latestFinish: number;
    totalFloat: number;
    freeFloat: number;
    isCritical: boolean;
  }[];
  criticalPath: string[];
  projectDuration: number;
};

export function calculateCriticalPathFloat(
  tasks: FloatTask[]
): CriticalPathFloatResult {
  if (!tasks || tasks.length === 0) {
    return { tasks: [], criticalPath: [], projectDuration: 0 };
  }

  const taskMap = new Map<string, FloatTask>();
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  tasks.forEach((t) => {
    taskMap.set(t.id, t);
    inDegree.set(t.id, 0);
    adj.set(t.id, []);
  });

  tasks.forEach((t) => {
    t.dependencies.forEach((depId) => {
      if (taskMap.has(depId)) {
        adj.get(depId)!.push(t.id);
        inDegree.set(t.id, inDegree.get(t.id)! + 1);
      }
    });
  });

  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    adj.get(u)!.forEach((v) => {
      inDegree.set(v, inDegree.get(v)! - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    });
  }

  const es = new Map<string, number>();
  const ef = new Map<string, number>();

  order.forEach((id) => {
    const t = taskMap.get(id)!;
    let maxPrevEf = 0;
    t.dependencies.forEach((depId) => {
      if (ef.has(depId)) {
        maxPrevEf = Math.max(maxPrevEf, ef.get(depId)!);
      }
    });

    es.set(id, maxPrevEf);
    ef.set(id, maxPrevEf + t.duration);
  });

  const projectDuration = Math.max(0, ...Array.from(ef.values()));

  const ls = new Map<string, number>();
  const lf = new Map<string, number>();

  order.forEach((id) => {
    lf.set(id, projectDuration);
  });

  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i];
    const t = taskMap.get(id)!;
    const currentLf = lf.get(id)!;
    const currentLs = currentLf - t.duration;
    ls.set(id, currentLs);

    t.dependencies.forEach((depId) => {
      if (lf.has(depId)) {
        lf.set(depId, Math.min(lf.get(depId)!, currentLs));
      }
    });
  }

  const resultTasks = tasks.map((t) => {
    const id = t.id;
    const earliestStart = es.get(id) || 0;
    const earliestFinish = ef.get(id) || 0;
    const latestStart = ls.get(id) || 0;
    const latestFinish = lf.get(id) || 0;
    const totalFloat = latestStart - earliestStart;

    let minSuccessorEs = projectDuration;
    let hasSuccessors = false;
    adj.get(id)?.forEach((succId) => {
      if (es.has(succId)) {
        minSuccessorEs = Math.min(minSuccessorEs, es.get(succId)!);
        hasSuccessors = true;
      }
    });

    const freeFloat = hasSuccessors ? Math.max(0, minSuccessorEs - earliestFinish) : Math.max(0, projectDuration - earliestFinish);
    const isCritical = totalFloat === 0;

    return {
      id,
      name: t.name || `Task ${id}`,
      earliestStart,
      earliestFinish,
      latestStart,
      latestFinish,
      totalFloat,
      freeFloat,
      isCritical,
    };
  });

  const criticalPath = resultTasks.filter((t) => t.isCritical).map((t) => t.id);

  return {
    tasks: resultTasks,
    criticalPath,
    projectDuration,
  };
}

export type CampaignPhase = {
  name: string;
  durationDays: number;
  bufferDays: number;
  channel: string;
  owner: string;
};

export type CampaignDeploymentResult = {
  phases: {
    name: string;
    startDate: Date;
    endDate: Date;
    startFormatted: string;
    endFormatted: string;
    channel: string;
    owner: string;
    isCritical: boolean;
  }[];
  campaignStartDate: Date;
  campaignStartFormatted: string;
  totalPhaseDays: number;
};

export function calculateCampaignDeployment(
  campaignLaunchDate: string,
  phases: CampaignPhase[]
): CampaignDeploymentResult {
  const backPlan = calculateBackPlan(
    campaignLaunchDate,
    phases.map((p) => ({ name: p.name, durationDays: p.durationDays, bufferDays: p.bufferDays })),
    false
  );

  const resultPhases = backPlan.milestones.map((m, idx) => {
    const origPhase = phases[idx];
    return {
      name: m.name,
      startDate: m.startDate,
      endDate: m.endDate,
      startFormatted: m.startDateFormatted,
      endFormatted: m.endDateFormatted,
      channel: origPhase.channel || "Other",
      owner: origPhase.owner || "",
      isCritical: m.isCritical,
    };
  });

  return {
    phases: resultPhases,
    campaignStartDate: backPlan.projectStartDate,
    campaignStartFormatted: backPlan.projectStartFormatted,
    totalPhaseDays: backPlan.totalProjectDays,
  };

}




