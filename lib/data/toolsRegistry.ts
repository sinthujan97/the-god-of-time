export type Tool = {
  id: string;
  slug: string;
  name: string;
  description: string;
  group: string;
  combined?: boolean;
};

export type ToolGroup = {
  id: string;
  name: string;
  accent: string;
  tools: Tool[];
};

export const toolsRegistry: ToolGroup[] = [
  {
    id: "standard-time",
    name: "Standard Time & Date",
    accent: "#C5F135", // --tools-group-a
    tools: [
      {
        id: "days-between-dates",
        slug: "days-between-dates",
        name: "Days Between Dates Calculator",
        description: "Calculate the exact number of days, weeks, and months between any two dates.",
        group: "standard-time"
      },
      {
        id: "add-days-to-date",
        slug: "add-days-to-date",
        name: "Add Days to Date Tool",
        description: "Find the future date by adding a specified number of days, weeks, or months.",
        group: "standard-time"
      },
      {
        id: "subtract-days-from-date",
        slug: "subtract-days-from-date",
        name: "Subtract Days from Date Tool",
        description: "Find the past date by subtracting a specified number of days, weeks, or months.",
        group: "standard-time"
      },
      {
        id: "time-duration-calculator",
        slug: "time-duration-calculator",
        name: "Time Duration Calculator",
        description: "Calculate the duration between two times in hours, minutes, and seconds.",
        group: "standard-time"
      },
      {
        id: "add-subtract-time",
        slug: "add-subtract-time",
        name: "Add/Subtract Time Calculator",
        description: "Add or subtract specific hours, minutes, and seconds to a baseline time.",
        group: "standard-time"
      },
      {
        id: "business-days-calculator",
        slug: "business-days-calculator",
        name: "Business Days Calculator",
        description: "Determine the number of working days between dates, excluding weekends.",
        group: "standard-time"
      },
      {
        id: "business-days-with-holidays",
        slug: "business-days-with-holidays",
        name: "Business Days + Custom Holidays",
        description: "Calculate business days factoring in custom national or corporate holidays.",
        group: "standard-time",
        combined: true
      },
      {
        id: "days-until-counter",
        slug: "days-until-counter",
        name: "Days Until Counter",
        description: "Count down the precise days remaining until an upcoming event or deadline.",
        group: "standard-time"
      },
      {
        id: "days-since-counter",
        slug: "days-since-counter",
        name: "Days Since Counter",
        description: "Track the days elapsed since a past historical event or life milestone.",
        group: "standard-time"
      },
      {
        id: "decimal-time-converter",
        slug: "decimal-time-converter",
        name: "Decimal Time Converter",
        description: "Convert standard hours and minutes into decimal format and vice versa.",
        group: "standard-time"
      },
      {
        id: "leap-year-calculator",
        slug: "leap-year-calculator",
        name: "Leap Year Calculator",
        description: "Check if any year is a leap year, list all leap years in a range, and see the calculation logic explained.",
        group: "standard-time"
      },
      {
        id: "iso-week-number",
        slug: "iso-week-number",
        name: "ISO Week Number Calculator",
        description: "Find the ISO 8601 week number and year representation for any date.",
        group: "standard-time"
      },
      {
        id: "day-of-week-finder",
        slug: "day-of-week-finder",
        name: "Day of the Week Finder",
        description: "Determine which day of the week a specific historical or future date falls on.",
        group: "standard-time"
      },
      {
        id: "time-percentage-calculator",
        slug: "time-percentage-calculator",
        name: "Time Percentage Calculator",
        description: "Calculate how much of a day, week, month, or year has elapsed.",
        group: "standard-time"
      },
      {
        id: "date-midpoint-calculator",
        slug: "date-midpoint-calculator",
        name: "Date Midpoint Calculator",
        description: "Find the exact midpoint date and time between two custom endpoints.",
        group: "standard-time"
      },
      {
        id: "millisecond-timer",
        slug: "millisecond-timer",
        name: "Millisecond Timer & Delta Counter",
        description: "A precision timer showing elapsed milliseconds and delta gaps.",
        group: "standard-time"
      },
      {
        id: "day-of-year-converter",
        slug: "day-of-year-converter",
        name: "Day of the Year Ordinal Converter",
        description: "Convert any date to its ordinal day of the year (1-366) and vice versa.",
        group: "standard-time"
      },
      {
        id: "working-hours-tracker",
        slug: "working-hours-tracker",
        name: "Working Hours Tracker",
        description: "Log and calculate the sum of working hours across customized date ranges.",
        group: "standard-time"
      },
      {
        id: "overtime-hours-calculator",
        slug: "overtime-hours-calculator",
        name: "Overtime Hours Calculator",
        description: "Calculate regular and overtime working hours based on daily or weekly thresholds.",
        group: "standard-time"
      },
      {
        id: "payroll-period-planner",
        slug: "payroll-period-planner",
        name: "Payroll Period Planner",
        description: "Generate and review dates for standard weekly, bi-weekly, or monthly pay cycles.",
        group: "standard-time"
      }
    ]
  },
  {
    id: "hr-payroll",
    name: "HR, Payroll & Freelance",
    accent: "#A8CC1C", // --tools-group-b
    tools: [
      {
        id: "time-card-calculator",
        slug: "time-card-calculator",
        name: "Time Card Calculator",
        description: "Calculate daily and weekly hours worked from clock-in/clock-out timestamps.",
        group: "hr-payroll"
      },
      {
        id: "time-card-with-breaks",
        slug: "time-card-with-breaks",
        name: "Multi-Break Time Card Tool",
        description: "Generate work timecards factoring in multiple unpaid lunch and rest breaks.",
        group: "hr-payroll"
      },
      {
        id: "overtime-pay-calculator",
        slug: "overtime-pay-calculator",
        name: "Overtime Pay Calculator",
        description: "Compute gross pay including regular and time-and-a-half (1.5x) or double-time (2x) hours.",
        group: "hr-payroll"
      },
      {
        id: "hourly-to-salary",
        slug: "hourly-to-salary",
        name: "Hourly to Salary Converter",
        description: "Convert an hourly wage into equivalent weekly, monthly, and annual salaries.",
        group: "hr-payroll"
      },
      {
        id: "salary-to-hourly",
        slug: "salary-to-hourly",
        name: "Salary to Hourly Calculator",
        description: "Divide annual salary into equivalent hourly rates for different work structures.",
        group: "hr-payroll"
      },
      {
        id: "freelance-capacity-planner",
        slug: "freelance-capacity-planner",
        name: "Freelance Project Capacity Planner",
        description: "Estimate available billable hours based on client commitments and personal limits.",
        group: "hr-payroll"
      },
      {
        id: "pto-accrual-calculator",
        slug: "pto-accrual-calculator",
        name: "PTO Accrual Calculator",
        description: "Calculate accumulated Paid Time Off (PTO) based on pay periods and accrual rates.",
        group: "hr-payroll"
      },
      {
        id: "furlough-pay-calculator",
        slug: "furlough-pay-calculator",
        name: "Furlough Pay Calculator",
        description: "Calculate the monthly and total financial impact of unpaid leaves, furlough days, or temporary work suspensions.",
        group: "hr-payroll"
      },
      {
        id: "shift-differential-calculator",
        slug: "shift-differential-calculator",
        name: "Shift Differential Calculator",
        description: "Calculate night shift pay, differential rates, and overtime instantly. Supports flat-rate and percentage premiums for any industry.",
        group: "hr-payroll"
      },
      {
        id: "gross-to-net-pay",
        slug: "gross-to-net-pay",
        name: "Gross-to-Net Time Pay Sheet",
        description: "Estimate net take-home pay after standard hours, taxes, and voluntary deductions.",
        group: "hr-payroll"
      },
      {
        id: "billable-hours-tracker",
        slug: "billable-hours-tracker",
        name: "Billable Hours Tracker",
        description: "Log hours, associate them with clients/rates, and prepare invoice-ready summaries.",
        group: "hr-payroll"
      },
      {
        id: "commission-per-hour-calculator",
        slug: "commission-per-hour-calculator",
        name: "Commission Per Hour Calculator",
        description: "Convert sales commissions into hourly rate equivalents and evaluate combined compensation structures.",
        group: "hr-payroll"
      },
      {
        id: "break-deductor",
        slug: "break-deductor",
        name: "Daily Break Deductor Tool",
        description: "Automatically subtract mandatory breaks from logged total timesheet intervals.",
        group: "hr-payroll"
      },
      {
        id: "annual-work-hours",
        slug: "annual-work-hours",
        name: "Annual Work Hours Counter",
        description: "Determine the exact work hours in a full calendar year excluding selected holidays.",
        group: "hr-payroll"
      },
      {
        id: "multi-job-income-sync",
        slug: "multi-job-income-sync",
        name: "Multi-Job Income Sync Clocks",
        description: "Track overlapping timesheets and total concurrent income from multiple jobs.",
        group: "hr-payroll"
      },
      {
        id: "free-biweekly-timesheet-calculator",
        slug: "free-biweekly-timesheet-calculator",
        name: "Free Biweekly Timesheet Calculator",
        description: "Generate a detailed 14-day biweekly timesheet with daily hours, overtime tracking, and payroll subtotals.",
        group: "hr-payroll"
      },
      {
        id: "semi-monthly-pay-calculator",
        slug: "semi-monthly-pay-calculator",
        name: "Semi Monthly Pay Calculator",
        description: "Calculate gross pay per period for twice-a-month schedules. Convert annual salary to semi-monthly paychecks instantly.",
        group: "hr-payroll"
      },
      {
        id: "retainer-hours-tracker-online",
        slug: "retainer-hours-tracker-online",
        name: "Retainer Hours Tracker Online",
        description: "Track hours consumed vs. remaining balance for monthly retainer clients, projecting burn rates and depletion dates.",
        group: "hr-payroll"
      },
      {
        id: "labor-cost-tracker",
        slug: "labor-cost-tracker",
        name: "Time-Weighted Employee Utility Tracker",
        description: "Monitor relative labor cost compared to project milestones and logged hours.",
        group: "hr-payroll"
      },
      {
        id: "fractional-work-hours-allocator",
        slug: "fractional-work-hours-allocator",
        name: "Fractional Work Hours Allocator",
        description: "Allocate weekly hours and revenues across multiple fractional clients, track capacity utilization, and model income scenarios.",
        group: "hr-payroll"
      },
      {
        id: "employee-utilization-calculator",
        slug: "employee-utilization-calculator",
        name: "Employee Utilization Calculator",
        description: "Calculate employee utilization rates, billable vs. non-billable hours, and revenue efficiency across teams.",
        group: "hr-payroll"
      }
    ]
  },
  {
    id: "project-management",
    name: "Project Management & Business",
    accent: "#8BA812", // --tools-group-c
    tools: [
      {
        id: "project-back-planner",
        slug: "project-back-planner",
        name: "Project Deadline Back-Planner",
        description: "Work backward from a deadline to calculate start dates and milestones, incorporating buffer and weekend rules.",
        group: "project-management"
      },
      {
        id: "gantt-chart-date-calculator",
        slug: "gantt-chart-date-calculator",
        name: "Gantt Chart Date Calculator",
        description: "Map out project tasks with durations and dependencies to calculate start/end dates and visualize overlap.",
        group: "project-management"
      },
      {
        id: "agile-sprint-date-calculator",
        slug: "agile-sprint-date-calculator",
        name: "Agile Sprint Date Calculator",
        description: "Plan sprint start and end dates, ceremonies, and milestones for any sprint length.",
        group: "project-management"
      },
      {
        id: "sla-timer",
        slug: "sla-timer",
        name: "SLA Timer",
        description: "Track time remaining before a service level agreement deadline is breached, with visual countdown and breach alerts.",
        group: "project-management"
      },
      {
        id: "lead-time-calculator",
        slug: "lead-time-calculator",
        name: "Lead Time & Cycle Time Calculator",
        description: "Track and calculate manufacturing, software development, or service delivery lead times and process efficiency.",
        group: "project-management"
      },
      {
        id: "statutory-notice-period",
        slug: "statutory-notice-period",
        name: "Statutory Notice Period Calculator",
        description: "Determine required resignation or termination notice periods and project final employment dates.",
        group: "project-management"
      },
      {
        id: "subscription-renewal-schedule",
        slug: "subscription-renewal-schedule",
        name: "Subscription Renewal & Runway Calculator",
        description: "Track subscription payment intervals (monthly/annual) and project cash runway based on recurring costs.",
        group: "project-management"
      },
      {
        id: "event-countdown-back-timer",
        slug: "event-countdown-back-timer",
        name: "Event Back-Timer & Milestone Planner",
        description: "Plan hour-by-hour schedules backward from event start times, including setup, presentations, and breaks.",
        group: "project-management"
      },
      {
        id: "fiscal-quarter-calculator",
        slug: "fiscal-quarter-calculator",
        name: "Fiscal Quarter Calculator",
        description: "Find Q1-Q4 start and end dates for any fiscal year, including non-standard fiscal years that start in months other than January.",
        group: "project-management"
      },
      {
        id: "project-buffer-calculator",
        slug: "project-buffer-calculator",
        name: "Project Buffer Calculator",
        description: "Calculate the schedule buffer needed to protect your project deadline based on task risks and dependencies.",
        group: "project-management"
      },
      {
        id: "document-expiration-date-calculator",
        slug: "document-expiration-date-calculator",
        name: "Document Expiration Date Calculator",
        description: "Calculate document disposal and archiving dates based on creation dates and regulatory compliance periods.",
        group: "project-management"
      },
      {
        id: "downtime-uptime-calculator",
        slug: "downtime-uptime-calculator",
        name: "Downtime & Service Uptime Calculator",
        description: "Calculate overall service uptime percentage and review total downtime durations from incident logs.",
        group: "project-management"
      },
      {
        id: "rrule-generator-online",
        slug: "rrule-generator-online",
        name: "RRule Generator Online",
        description: "Generate standard RFC 5545 iCalendar Recurrence Rules (RRule) and preview upcoming occurrence dates.",
        group: "project-management"
      },
      {
        id: "invoice-due-date-calculator",
        slug: "invoice-due-date-calculator",
        name: "Invoice Due Date & Aging Calculator",
        description: "Calculate payment deadlines based on issue date and net terms, and track overdue aging buckets.",
        group: "project-management"
      },
      {
        id: "free-legal-deadline-calculator",
        slug: "free-legal-deadline-calculator",
        name: "Free Legal Deadline Calculator",
        description: "Calculate legal filing deadlines, accounting for business days, court holidays, and weekend rules — completely free.",
        group: "project-management"
      },
      {
        id: "delivery-slip-risk",
        slug: "delivery-slip-risk",
        name: "Delivery Slip Risk Calculator",
        description: "Evaluate project delivery risk and slip probability by tracking velocity against target completion dates.",
        group: "project-management"
      },
      {
        id: "pomodoro-time-segmenter",
        slug: "pomodoro-time-segmenter",
        name: "Pomodoro Session & Break Segmenter",
        description: "Structure workdays into custom Pomodoro blocks (focus/break segments) and project completion times.",
        group: "project-management"
      },
      {
        id: "remote-team-overlap",
        slug: "remote-team-overlap",
        name: "Remote Team Time Zone Overlap Finder",
        description: "Find overlapping work hours and optimal meeting times for distributed teams across multiple time zones.",
        group: "project-management"
      },
      {
        id: "critical-path-calculator",
        slug: "critical-path-calculator",
        name: "Critical Path Calculator",
        description: "Find the critical path, float, and project duration for any network of tasks. Works for AON and AOA methods.",
        group: "project-management"
      },
      {
        id: "campaign-deployment-timeline",
        slug: "campaign-deployment-timeline",
        name: "Campaign Deployment Timeline Planner",
        description: "Map marketing phases (content, design, ads) backward from launch date and assign operational channels.",
        group: "project-management"
      }
    ]
  },
  {
    id: "global-time",
    name: "Global Time & Time Zones",
    accent: "#D8F870", // --tools-group-d
    tools: [
      {
        id: "world-time-converter",
        slug: "world-time-converter",
        name: "World Time Zone Converter",
        description: "Convert a custom time in one city to multiple global destinations simultaneously.",
        group: "global-time"
      },
      {
        id: "world-clock-meeting-planner",
        slug: "world-clock-meeting-planner",
        name: "World Clock Meeting Planner",
        description: "Find the best meeting time for teams in different time zones with a visual working-hours overlap grid.",
        group: "global-time"
      },
      {
        id: "utc-gmt-offset",
        slug: "utc-gmt-offset",
        name: "UTC/GMT Offset Finder",
        description: "Identify current offsets and UTC/GMT representations for standard time zones.",
        group: "global-time"
      },
      {
        id: "military-time-converter",
        slug: "military-time-converter",
        name: "Military Time Converter",
        description: "Convert between 12-hour AM/PM formats and 24-hour military standards.",
        group: "global-time"
      },
      {
        id: "dst-tracker",
        slug: "dst-tracker",
        name: "Daylight Saving Time Transition Tracker",
        description: "See upcoming DST clock shift dates and impact changes across regions.",
        group: "global-time"
      },
      {
        id: "flight-duration-calculator",
        slug: "flight-duration-calculator",
        name: "Flight Duration & Time Zone Calculator",
        description: "Determine flight duration using departure/arrival local times and airports.",
        group: "global-time"
      },
      {
        id: "timezone-map-finder",
        slug: "timezone-map-finder",
        name: "Time Zone Finder by Map Click",
        description: "Interactive visual coordinate mapping showing global time zones.",
        group: "global-time"
      },
      {
        id: "unix-timestamp-converter",
        slug: "unix-timestamp-converter",
        name: "Unix Timestamp Converter",
        description: "Convert epoch timestamps in seconds or milliseconds to human-readable dates.",
        group: "global-time"
      },
      {
        id: "date-line-simulator",
        slug: "date-line-simulator",
        name: "International Date Line Crossing Simulator",
        description: "Simulate traveling across the Pacific IDL to see date changes in real time.",
        group: "global-time"
      },
      {
        id: "timezone-abbreviations",
        slug: "timezone-abbreviations",
        name: "Time Zone Abbreviation Directory",
        description: "Look up standard abbreviations like EST, CEST, JST, and AEDT with active offsets.",
        group: "global-time"
      },
      {
        id: "zulu-time-converter",
        slug: "zulu-time-converter",
        name: "Zulu Time Converter",
        description: "Convert local time to Zulu (UTC) time instantly. Built for pilots, military personnel, and aviation professionals.",
        group: "global-time"
      },
      {
        id: "swatch-time-converter",
        slug: "swatch-time-converter",
        name: "Swatch Time Converter",
        description: "Convert standard time to Swatch Internet Time .beats and back — the quirky 1990s universal time format.",
        group: "global-time"
      },
      {
        id: "gps-time-converter",
        slug: "gps-time-converter",
        name: "GPS Time Converter",
        description: "Convert GPS time to UTC, Unix time, or local time. Handles leap seconds and GPS week rollover.",
        group: "global-time"
      },
      {
        id: "multi-city-clock",
        slug: "multi-city-clock",
        name: "Multi-City Desktop Grid Clock",
        description: "Pin multiple active clocks to a customized grid to watch live timezones.",
        group: "global-time"
      },
      {
        id: "cross-border-deadline-calculator",
        slug: "cross-border-deadline-calculator",
        name: "Cross-Border Deadline Calculator",
        description: "Calculate legal filing deadlines across multiple jurisdictions with time zone and holiday support.",
        group: "global-time"
      },
      {
        id: "timezone-difference-grid",
        slug: "timezone-difference-grid",
        name: "Time Zone Relative Difference Grid",
        description: "View a visual matrix showing offsets relative to your own timezone.",
        group: "global-time"
      },
      {
        id: "solar-vs-standard-time",
        slug: "solar-vs-standard-time",
        name: "Solar Time vs Standard Time Tracker",
        description: "Compare solar tracking time to standard legal timezone representations.",
        group: "global-time"
      },
      {
        id: "ntp-time-tester-online",
        slug: "ntp-time-tester-online",
        name: "NTP Time Tester Online",
        description: "Check NTP server accuracy, measure time offset, and compare your system clock against network time.",
        group: "global-time"
      },
      {
        id: "leap-second-log",
        slug: "leap-second-log",
        name: "Leap Second History Log",
        description: "Browse historical logs of leap seconds introduced into standard UTC time.",
        group: "global-time"
      },
      {
        id: "solar-noon-tracker",
        slug: "solar-noon-tracker",
        name: "True Solar Noon Precision Tracker",
        description: "Calculate exact daily solar noon coordinates based on GPS coordinates.",
        group: "global-time"
      }
    ]
  },
  {
    id: "health-lifecycle",
    name: "Health & Lifecycle",
    accent: "#B2D828", // --tools-group-e
    tools: [
      {
        id: "pregnancy-due-date",
        slug: "pregnancy-due-date",
        name: "Pregnancy Due Date Calculator",
        description: "Calculate expected delivery date based on LMP, conception date, or IVF transfer.",
        group: "health-lifecycle"
      },
      {
        id: "trimester-calendar",
        slug: "trimester-calendar",
        name: "Trimester Milestone Calendar",
        description: "Generate a timeline detailing pregnancy weeks, development stages, and milestones.",
        group: "health-lifecycle"
      },
      {
        id: "age-calculator",
        slug: "age-calculator",
        name: "Age Calculator (Down to the Second)",
        description: "See your age in years, months, days, minutes, and running seconds.",
        group: "health-lifecycle"
      },
      {
        id: "sleep-calculator",
        slug: "sleep-calculator",
        name: "Circadian Rhythm Sleep Calculator",
        description: "Calculate optimal times to sleep or wake up based on natural 90-minute sleep cycles.",
        group: "health-lifecycle"
      },
      {
        id: "ovulation-calculator",
        slug: "ovulation-calculator",
        name: "Ovulation & Fertility Window Map",
        description: "Track your cycle to find estimated ovulation dates and fertile windows.",
        group: "health-lifecycle"
      },
      {
        id: "fasting-planner",
        slug: "fasting-planner",
        name: "Intermittent Fasting Schedule Planner",
        description: "Plan and track daily fasting intervals (e.g., 16:8, 18:6, or custom routines).",
        group: "health-lifecycle"
      },
      {
        id: "medication-scheduler",
        slug: "medication-scheduler",
        name: "Medication Interval Scheduler",
        description: "Generate structured intake reminders based on hourly intervals or daily dosages.",
        group: "health-lifecycle"
      },
      {
        id: "habit-streak-planner",
        slug: "habit-streak-planner",
        name: "Habit Streak Milestone Planner",
        description: "Chart timeline targets (e.g., 21 days, 66 days) to form solid routines.",
        group: "health-lifecycle"
      },
      {
        id: "pet-age-translator",
        slug: "pet-age-translator",
        name: "Pet Age Translator",
        description: "Convert dog, cat, or bird years to human years based on size and species guidelines.",
        group: "health-lifecycle"
      },
      {
        id: "caffeine-half-life",
        slug: "caffeine-half-life",
        name: "Caffeine Elimination Curve Tool",
        description: "Graph the decline of caffeine levels in your body based on typical half-life models.",
        group: "health-lifecycle"
      },
      {
        id: "alcohol-clearance",
        slug: "alcohol-clearance",
        name: "Alcohol Metabolism Clearance Clock",
        description: "Estimate approximate time required for your system to metabolize alcohol intake.",
        group: "health-lifecycle"
      },
      {
        id: "nicotine-detox",
        slug: "nicotine-detox",
        name: "Nicotine Detox Health Timeline",
        description: "Track physical recovery stages starting from the first hour of quitting smoking/vaping.",
        group: "health-lifecycle"
      },
      {
        id: "shift-sleep-adjuster",
        slug: "shift-sleep-adjuster",
        name: "Shift Work Sleep Adjuster",
        description: "Plan melatonin and sleep adjustments when transitioning to night shifts.",
        group: "health-lifecycle"
      },
      {
        id: "vaccination-tracker",
        slug: "vaccination-tracker",
        name: "Vaccination Tracker Timeline",
        description: "Chart pediatric or travel immunization schedules based on age milestones.",
        group: "health-lifecycle"
      },
      {
        id: "screen-break-timer",
        slug: "screen-break-timer",
        name: "Screen Time Break Timer",
        description: "Set alerts reminding you of the 20-20-20 rule to prevent digital eye strain.",
        group: "health-lifecycle"
      },
      {
        id: "loan-maturity-date",
        slug: "loan-maturity-date",
        name: "Loan Maturity Date Calculator",
        description: "Identify final payoff dates based on loan duration and initial start dates.",
        group: "health-lifecycle"
      },
      {
        id: "interest-day-count",
        slug: "interest-day-count",
        name: "Interest Day-Count Calculator",
        description: "Calculate accrued interest using Standard Actual/360, Actual/365, or 30/360 rules.",
        group: "health-lifecycle"
      },
      {
        id: "tenancy-notice",
        slug: "tenancy-notice",
        name: "Statutory Tenancy Notice Planner",
        description: "Find legal dates for giving notice to terminate standard residential lease periods.",
        group: "health-lifecycle"
      },
      {
        id: "golden-hour-tracker",
        slug: "golden-hour-tracker",
        name: "Golden Hour & Blue Hour Tracker",
        description: "Identify exact daily photography lighting windows based on geographical position.",
        group: "health-lifecycle"
      },
      {
        id: "perpetual-calendar",
        slug: "perpetual-calendar",
        name: "Perpetual Wall Calendar Blueprint",
        description: "Examine dates in any historical year from 1 AD to 9999 AD.",
        group: "health-lifecycle"
      }
    ]
  }
];
