"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type SyncContextType = {
  isSyncing: boolean;
  startSync: () => void;
  endSync: () => void;
  syncedFetch: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;
};

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const startSync = useCallback(() => {
    setIsSyncing(true);
  }, []);

  const endSync = useCallback(() => {
    setIsSyncing(false);
  }, []);

  const syncedFetch = useCallback(
    async (url: string, options?: RequestInit) => {
      startSync();
      try {
        const response = await fetch(url, options);
        return response;
      } finally {
        endSync();
      }
    },
    [startSync, endSync]
  );

  return (
    <SyncContext.Provider value={{ isSyncing, startSync, endSync, syncedFetch }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
}
