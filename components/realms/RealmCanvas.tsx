"use client";

import React from "react";

interface RealmCanvasProps {
  realmName: string;
  accent: string;
  children?: React.ReactNode;
}

export default function RealmCanvas({ realmName, accent, children }: RealmCanvasProps) {
  return (
    <div className="w-full relative aspect-video min-h-[400px] bg-black border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-6">
      {/* Background Starfield Effect placeholder */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Glow highlight */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: accent }}
      />

      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse" 
            style={{ backgroundColor: accent }}
          />
          <h3 className="font-display text-text-primary text-sm uppercase tracking-widest font-light">
            {realmName} Realm Canvas
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded border border-border-subtle bg-bg-card/80 backdrop-blur-sm">
          SIMULATOR READY
        </span>
      </div>

      <div className="z-10 flex-1 flex items-center justify-center">
        {children ? (
          children
        ) : (
          <div className="text-center space-y-2">
            <span className="text-4xl">🌌</span>
            <p className="font-display text-lg text-text-primary font-medium tracking-wide">
              Temporal Field Initialized
            </p>
            <p className="font-sans text-xs text-text-muted max-w-sm mx-auto">
              Interactive visualization models and shaders will bind directly to this viewport.
            </p>
          </div>
        )}
      </div>

      <div className="z-10 text-[10px] font-mono text-text-muted flex justify-between pt-4 border-t border-border-subtle/50">
        <span>COORDINATES: T=0.00s</span>
        <span>ACCENT_COLOR: {accent}</span>
      </div>
    </div>
  );
}
