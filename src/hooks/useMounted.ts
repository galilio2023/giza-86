import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Modern hydration-safe hook for React 19.
 * Returns `false` on the server and `true` on the client after hydration
 * without causing cascading render cycles (avoids react-hooks/set-state-in-effect).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
