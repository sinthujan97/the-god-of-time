"use client"

import { createContext, useContext } from 'react'

type SectionType = 'tools' | 'realms' | 'games' | 'clocks' | 'default'

const SECTION_ACCENTS: Record<SectionType, {
  accent: string
  accentDark: string
  textOnAccent: string
}> = {
  tools: {
    accent: 'var(--section-tools-accent)',
    accentDark: 'var(--section-tools-accent-dark)',
    textOnAccent: 'var(--section-tools-text-on-accent)'
  },
  realms: {
    accent: 'var(--section-realms-accent)',
    accentDark: 'var(--section-realms-accent-dark)',
    textOnAccent: 'var(--section-realms-text-on-accent)'
  },
  games: {
    accent: 'var(--section-games-accent)',
    accentDark: 'var(--section-games-accent-dark)',
    textOnAccent: 'var(--section-games-text-on-accent)'
  },
  clocks: {
    accent: 'var(--section-clocks-accent)',
    accentDark: 'var(--section-clocks-accent-dark)',
    textOnAccent: 'var(--section-clocks-text-on-accent)'
  },
  default: {
    accent: 'var(--section-tools-accent)',
    accentDark: 'var(--section-tools-accent-dark)',
    textOnAccent: 'var(--section-tools-text-on-accent)'
  }
}

const SectionAccentContext = createContext(SECTION_ACCENTS.default)

export function SectionAccentProvider({
  section,
  children
}: {
  section: SectionType
  children: React.ReactNode
}) {
  const value = SECTION_ACCENTS[section]
  return (
    <SectionAccentContext.Provider value={value}>
      <div style={{
        '--accent-color': value.accent,
        '--accent-color-dark': value.accentDark,
        '--text-on-accent': value.textOnAccent,
      } as React.CSSProperties}>
        {children}
      </div>
    </SectionAccentContext.Provider>
  )
}

export function useSectionAccent() {
  return useContext(SectionAccentContext)
}
