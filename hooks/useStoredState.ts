import { useEffect, useState } from 'react';

// useState that survives a page refresh. Storage can be unavailable
// (private windows, blocked site data), so every access is guarded and the
// app simply falls back to in-memory state.
export function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore: state still works for this session.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
