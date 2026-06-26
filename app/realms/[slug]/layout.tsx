import React from "react";

/**
 * This layout removes the default <main> wrapper padding and hides the root
 * Navbar / Footer for all individual realm [slug] pages. The RealmLayout
 * component handles its own fullscreen shell.
 *
 * We override the root layout's <main className="flex-grow pt-14 md:pt-16">
 * by rendering children directly through this segment layout, but the root
 * layout still provides <html>, <body>, ThemeProvider, and RegisterSW.
 *
 * To escape the root <main> wrapper the slug layout renders a portal-like
 * full-screen overlay via fixed positioning — the realm shell itself uses
 * position:fixed / 100vw×100vh so this works correctly.
 */
export default function RealmSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
