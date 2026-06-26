"use client";

import React, { createContext, useContext, useState } from "react";

export type RealmContextType = {
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  realmParams: Record<string, number | string | boolean>;
  setRealmParam: (key: string, value: number | string | boolean) => void;
  isPanelMinimized: Record<string, boolean>;
  togglePanelMinimized: (panelId: string) => void;
};

const RealmContext = createContext<RealmContextType>({} as RealmContextType);

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [realmParams, setRealmParamsState] = useState<
    Record<string, number | string | boolean>
  >({});
  const [isPanelMinimized, setIsPanelMinimized] = useState<
    Record<string, boolean>
  >({});

  function setRealmParam(key: string, value: number | string | boolean) {
    setRealmParamsState((prev) => ({ ...prev, [key]: value }));
  }

  function togglePanelMinimized(panelId: string) {
    setIsPanelMinimized((prev) => ({ ...prev, [panelId]: !prev[panelId] }));
  }

  return (
    <RealmContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        realmParams,
        setRealmParam,
        isPanelMinimized,
        togglePanelMinimized,
      }}
    >
      {children}
    </RealmContext.Provider>
  );
}

export function useRealm() {
  return useContext(RealmContext);
}
