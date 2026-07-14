import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tools/semi-monthly-pay",
        destination: "/tools/semi-monthly-pay-calculator",
        permanent: true,
      },
      {
        source: "/tools/commission-by-hour",
        destination: "/tools/commission-per-hour-calculator",
        permanent: true,
      },
      {
        source: "/tools/biweekly-timesheet",
        destination: "/tools/free-biweekly-timesheet-calculator",
        permanent: true,
      },
      {
        source: "/tools/retainer-burndown",
        destination: "/tools/retainer-hours-tracker-online",
        permanent: true,
      },
      {
        source: "/tools/fractional-executive",
        destination: "/tools/fractional-work-hours-allocator",
        permanent: true,
      },
      {
        source: "/tools/shift-differential-pay",
        destination: "/tools/shift-differential-calculator",
        permanent: true,
      },
      {
        source: "/tools/zulu-time-coordinator",
        destination: "/tools/zulu-time-converter",
        permanent: true,
      },
      {
        source: "/tools/internet-time-converter",
        destination: "/tools/swatch-time-converter",
        permanent: true,
      },
      {
        source: "/tools/gps-time-correction",
        destination: "/tools/gps-time-converter",
        permanent: true,
      },
      {
        source: "/tools/cross-border-deadline",
        destination: "/tools/cross-border-deadline-calculator",
        permanent: true,
      },
      {
        source: "/tools/leap-year-checker",
        destination: "/tools/leap-year-calculator",
        permanent: true,
      },
      {
        source: "/tools/ntp-latency-tester",
        destination: "/tools/ntp-time-tester-online",
        permanent: true,
      },
      {
        source: "/tools/sprint-date-calculator",
        destination: "/tools/agile-sprint-date-calculator",
        permanent: true,
      },
      {
        source: "/tools/sla-countdown-timer",
        destination: "/tools/sla-timer",
        permanent: true,
      },
      {
        source: "/tools/document-retention-expiry",
        destination: "/tools/document-expiration-date-calculator",
        permanent: true,
      },
      {
        source: "/tools/recurring-event-rrule",
        destination: "/tools/rrule-generator-online",
        permanent: true,
      },
      {
        source: "/tools/court-deadline-calculator",
        destination: "/tools/free-legal-deadline-calculator",
        permanent: true,
      },
      {
        source: "/tools/milestone-buffer-calculator",
        destination: "/tools/project-buffer-calculator",
        permanent: true,
      },
      {
        source: "/tools/cpm-critical-path-float",
        destination: "/tools/critical-path-calculator",
        permanent: true,
      },
      {
        source: "/tools/meeting-planner",
        destination: "/tools/world-clock-meeting-planner",
        permanent: true,
      },
      {
        source: "/clocks/content-delivery-window",
        destination: "/clocks/best-time-to-post-on-social-media",
        permanent: true,
      },
      {
        source: "/clocks/meeting-cost-timer",
        destination: "/clocks/meeting-cost-clock-online",
        permanent: true,
      },
      {
        source: "/clocks/absolute-lunar-anchor",
        destination: "/clocks/moon-phase-clock-online",
        permanent: true,
      },
      {
        source: "/clocks/night-clock",
        destination: "/clocks/night-clock-online",
        permanent: true,
      },
      {
        source: "/clocks/circadian-clock",
        destination: "/clocks/circadian-rhythm-clock",
        permanent: true,
      },
      {
        source: "/clocks/time-blindness",
        destination: "/clocks/time-blindness-test-online-free",
        permanent: true,
      },
      {
        source: "/clocks/random-timer",
        destination: "/clocks/timer-game-online",
        permanent: true,
      },
      {
        source: "/clocks/speed-reading-metronome",
        destination: "/clocks/speed-reading-test-online",
        permanent: true,
      },
      {
        source: "/realms/parent-child-time",
        destination: "/realms/parent-child-time-calculator",
        permanent: true,
      },
      {
        source: "/realms/sacred-timeline-audit",
        destination: "/realms/the-sacred-timeline",
        permanent: true,
      },
      {
        source: "/clocks/interval-sounds",
        destination: "/clocks/meditation-timer-online",
        permanent: true,
      },
      {
        source: "/clocks/pomodoro",
        destination: "/clocks/pomodoro-timer-online",
        permanent: true,
      },
      {
        source: "/clocks/presentation-timer",
        destination: "/clocks/presentation-timer-online",
        permanent: true,
      },
      {
        source: "/clocks/chess-clock",
        destination: "/clocks/chess-clock-online",
        permanent: true,
      },
      {
        source: "/clocks/reaction-time",
        destination: "/clocks/reaction-time-test",
        permanent: true,
      },
      {
        source: "/clocks/time-blindness-test",
        destination: "/clocks/time-blindness-test-online-free",
        permanent: true,
      },
      {
        source: "/realms/paint-dry-simulator",
        destination: "/realms/watch-paint-dry",
        permanent: true,
      },
      {
        source: "/clocks/working-memory-test",
        destination: "/clocks/working-memory-test-online",
        permanent: true,
      },
      {
        source: "/clocks/cps-test",
        destination: "/clocks/click-per-second-test",
        permanent: true,
      },
      {
        source: "/clocks/speed-typing-test-online",
        destination: "/clocks/speed-typing-test-online-free",
        permanent: true,
      },
      {
        source: "/clocks/rhythm-test",
        destination: "/clocks/tap-to-the-beat-test",
        permanent: true,
      },
      {
        source: "/clocks/math-speed-test",
        destination: "/clocks/math-speed-test-online",
        permanent: true,
      },
      {
        source: "/clocks/micro-break-strobe",
        destination: "/clocks/20-20-20-timer",
        permanent: true,
      },
      {
        source: "/clocks/sunrise-sunset",
        destination: "/clocks/sunrise-sunset-calculator",
        permanent: true,
      },
      {
        source: "/clocks/interval-timer",
        destination: "/clocks/workout-timer-online-free",
        permanent: true,
      },
      {
        source: "/clocks/countdown",
        destination: "/clocks/countdown-timer-online",
        permanent: true,
      },
      {
        source: "/clocks/stopwatch",
        destination: "/clocks/stopwatch-online",
        permanent: true,
      },
      {
        source: "/tools/pregnancy-due-date",
        destination: "/tools/pregnancy-due-date-calculator",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
