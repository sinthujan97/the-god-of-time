// The canonical, served domain — Vercel redirects the apex (thegodoftime.com)
// here with a 308, so this must be the www host, not the apex, to avoid every
// canonical/OG/sitemap URL requiring an extra redirect hop.
export const SITE_URL = "https://www.thegodoftime.com";
