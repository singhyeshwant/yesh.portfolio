import { useMediaQuery } from "./useMediaQuery";

// Returns true when the user has asked the OS to reduce motion.
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
