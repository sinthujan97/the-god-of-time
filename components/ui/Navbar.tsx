"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import ThemeToggle from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const UTILITY_CATEGORIES = [
  { id: "standard-time", name: "Standard Time & Date", accent: "#52C4A0" },
  { id: "hr-payroll", name: "HR, Payroll & Freelance", accent: "#60A5D4" },
  { id: "project-management", name: "Project Management", accent: "#9B8EF5" },
  { id: "global-time", name: "Global Time & Zones", accent: "#F5A857" },
  { id: "health-lifecycle", name: "Health & Lifecycle", accent: "#E87C7C" }
];

const REALM_CATEGORIES = [
  { id: "cosmos", name: "Space & Cosmos", accent: "#4B8EF1" },
  { id: "biology", name: "Biology & History", accent: "#C9A84C" },
  { id: "scifi", name: "Sci-Fi & Paradox", accent: "#7B61FF" },
  { id: "whimsical", name: "Whimsical & Absurd", accent: "#3ABFBF" },
  { id: "destiny", name: "Personal Destiny", accent: "#E09A3A" },
  { id: "physics", name: "Physics Playground", accent: "#4B8EF1" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredToolsCategory, setHoveredToolsCategory] = useState(UTILITY_CATEGORIES[0].id);
  const [hoveredRealmsCategory, setHoveredRealmsCategory] = useState(REALM_CATEGORIES[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll handler to make navbar background frosted on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeCategoryTools = toolsRegistry.find((g) => g.id === hoveredToolsCategory)?.tools || [];
  const activeToolsAccent = UTILITY_CATEGORIES.find((c) => c.id === hoveredToolsCategory)?.accent || "#52C4A0";

  const activeCategoryRealms = realmsRegistry.filter((r) => r.category === hoveredRealmsCategory) || [];
  const activeRealmsAccent = REALM_CATEGORIES.find((c) => c.id === hoveredRealmsCategory)?.accent || "#4B8EF1";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "h-14 md:h-16 bg-bg-surface/80 backdrop-blur-[12px] border-b border-border shadow-md"
          : "h-14 md:h-16 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center cursor-pointer select-none">
            <span className="font-display font-light text-lg md:text-[18px] tracking-[0.25em] text-text-primary transition-opacity hover:opacity-80">
              ✦ GOD OF TIME
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links via shadcn NavigationMenu */}
        <nav className="hidden md:flex items-center gap-6 relative">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              
              {/* Utility Tools Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 h-9 bg-transparent hover:bg-bg-card-hover focus:bg-bg-card-hover data-[state=open]:bg-bg-card-hover text-text-muted hover:text-text-primary data-[state=open]:text-text-primary font-sans font-medium rounded-md cursor-pointer transition-colors border-none outline-none">
                  Utility Tools
                  <ChevronDown className="chevron-icon w-4 h-4 text-text-muted transition-transform duration-200" />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 mt-1.5 bg-bg-card border border-border rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-2 w-[524px] flex flex-row gap-2 z-50">
                  
                  {/* Level 1: Category list */}
                  <div className="w-[220px] flex flex-col gap-1 flex-shrink-0">
                    {UTILITY_CATEGORIES.map((cat) => {
                      const isHovered = hoveredToolsCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setHoveredToolsCategory(cat.id)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-100 font-sans w-full text-left"
                          style={{
                            backgroundColor: isHovered ? "var(--bg-card-hover)" : "transparent",
                            borderLeft: isHovered ? `2px solid ${cat.accent}` : "2px solid transparent",
                            paddingLeft: isHovered ? "10px" : "12px",
                          }}
                        >
                          <div className="flex items-center flex-1 min-w-0" style={{ gap: isHovered ? "0px" : "12px" }}>
                            {!isHovered && (
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-in fade-in duration-200"
                                style={{ backgroundColor: cat.accent }}
                              />
                            )}
                            <span className="text-xs font-medium text-text-primary truncate select-none">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-text-muted text-xs select-none">›</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider line between columns */}
                  <div className="w-[1px] bg-border flex-shrink-0 self-stretch my-1" />

                  {/* Level 2: Tools list wrapped in ScrollArea */}
                  <div className="w-[280px] flex flex-col gap-1">
                    <ScrollArea
                      className="h-[320px] pr-1"
                      style={{ "--accent-utility-a": activeToolsAccent } as React.CSSProperties}
                    >
                      <div className="flex flex-col gap-0.5">
                        {activeCategoryTools.length > 0 ? (
                          activeCategoryTools.map((tool) => (
                            <Link
                              key={tool.id}
                              href={`/tools/${tool.slug}`}
                              className="group flex flex-col p-2.5 rounded-md hover:bg-bg-card-hover transition-colors duration-100 no-underline select-none text-left"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="text-sm font-sans font-medium text-text-primary group-hover:text-[var(--hover-accent)] transition-colors duration-100 truncate"
                                    style={{ "--hover-accent": activeToolsAccent } as React.CSSProperties}
                                  >
                                    {tool.name}
                                  </span>
                                  {tool.combined && (
                                    <span className="text-[10px] font-sans font-semibold text-accent-bio tracking-wide flex-shrink-0">
                                      ✦ COMBINED
                                    </span>
                                  )}
                                </div>
                                <span
                                  className="text-sm text-[var(--hover-accent)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 flex-shrink-0"
                                  style={{ "--hover-accent": activeToolsAccent } as React.CSSProperties}
                                >
                                  →
                                </span>
                              </div>
                              <span className="text-[11px] font-sans text-text-muted mt-0.5 line-clamp-2 leading-normal">
                                {tool.description}
                              </span>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center text-text-faint text-xs font-sans">
                            No tools found.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Fun Realms Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 h-9 bg-transparent hover:bg-bg-card-hover focus:bg-bg-card-hover data-[state=open]:bg-bg-card-hover text-text-muted hover:text-text-primary data-[state=open]:text-text-primary font-sans font-medium rounded-md cursor-pointer transition-colors border-none outline-none">
                  Fun Realms
                  <ChevronDown className="chevron-icon w-4 h-4 text-text-muted transition-transform duration-200" />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 mt-1.5 bg-bg-card border border-border rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-2 w-[524px] flex flex-row gap-2 z-50">
                  
                  {/* Level 1: Category list */}
                  <div className="w-[220px] flex flex-col gap-1 flex-shrink-0">
                    {REALM_CATEGORIES.map((cat) => {
                      const isHovered = hoveredRealmsCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setHoveredRealmsCategory(cat.id)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-100 font-sans w-full text-left"
                          style={{
                            backgroundColor: isHovered ? "var(--bg-card-hover)" : "transparent",
                            borderLeft: isHovered ? `2px solid ${cat.accent}` : "2px solid transparent",
                            paddingLeft: isHovered ? "10px" : "12px",
                          }}
                        >
                          <div className="flex items-center flex-1 min-w-0" style={{ gap: isHovered ? "0px" : "12px" }}>
                            {!isHovered && (
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-in fade-in duration-200"
                                style={{ backgroundColor: cat.accent }}
                              />
                            )}
                            <span className="text-xs font-medium text-text-primary truncate select-none">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-text-muted text-xs select-none">›</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider line between columns */}
                  <div className="w-[1px] bg-border flex-shrink-0 self-stretch my-1" />

                  {/* Level 2: Realms list wrapped in ScrollArea */}
                  <div className="w-[280px] flex flex-col gap-1">
                    <ScrollArea
                      className="h-[320px] pr-1"
                      style={{ "--accent-utility-a": activeRealmsAccent } as React.CSSProperties}
                    >
                      <div className="flex flex-col gap-0.5">
                        {activeCategoryRealms.length > 0 ? (
                          activeCategoryRealms.map((realm) => (
                            <Link
                              key={realm.id}
                              href={`/realms/${realm.slug}`}
                              className="group flex flex-col p-2.5 rounded-md hover:bg-bg-card-hover transition-colors duration-100 no-underline select-none text-left"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="text-sm font-sans font-medium text-text-primary group-hover:text-[var(--hover-accent)] transition-colors duration-100 truncate"
                                    style={{ "--hover-accent": activeRealmsAccent } as React.CSSProperties}
                                  >
                                    {realm.name}
                                  </span>
                                </div>
                                <span
                                  className="text-sm text-[var(--hover-accent)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 flex-shrink-0"
                                  style={{ "--hover-accent": activeRealmsAccent } as React.CSSProperties}
                                >
                                  →
                                </span>
                              </div>
                              <span className="text-[11px] font-sans text-text-muted mt-0.5 line-clamp-2 leading-normal">
                                {realm.description}
                              </span>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center text-text-faint text-xs font-sans">
                            No realms found.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right: Theme Toggle & Mobile Menu Hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md border border-border text-text-primary bg-bg-surface/50 hover:bg-bg-card transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-surface border-b border-border shadow-xl p-4 max-h-[calc(100vh-60px)] overflow-y-auto z-40 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          
          {/* Utility Tools Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Utility Tools
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {UTILITY_CATEGORIES.map((cat) => (
                <div key={cat.id} className="border-l border-border pl-3 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accent }} />
                    <span className="text-xs font-sans font-medium text-text-primary">
                      {cat.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {toolsRegistry
                      .find((g) => g.id === cat.id)
                      ?.tools.slice(0, 5) // Show top 5 on mobile to keep compact
                      .map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    <Link
                      href="/tools"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[10px] font-sans text-accent-cosmos hover:underline py-0.5"
                    >
                      View all tools ›
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Realms Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Fun Realms
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {REALM_CATEGORIES.map((cat) => (
                <div key={cat.id} className="border-l border-border pl-3 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accent }} />
                    <span className="text-xs font-sans font-medium text-text-primary">
                      {cat.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {realmsRegistry
                      .filter((r) => r.category === cat.id)
                      .slice(0, 4) // Show top 4 on mobile
                      .map((realm) => (
                        <Link
                          key={realm.id}
                          href={`/realms/${realm.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          {realm.name}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
