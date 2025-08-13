// PUBLIC_INTERFACE
/**
 * Utility functions for browser detection and SSR compatibility
 */

// PUBLIC_INTERFACE
/**
 * Checks if the code is running in a browser environment
 * @returns boolean True if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// PUBLIC_INTERFACE
/**
 * Shows a confirmation dialog, compatible with SSR
 * @param message The confirmation message
 * @returns boolean True if user confirmed, false otherwise
 */
export function showConfirm(message: string): boolean {
  if (isBrowser() && typeof window !== 'undefined' && window.confirm) {
    return window.confirm(message);
  }
  // In SSR environment, default to false (cancel)
  return false;
}

// PUBLIC_INTERFACE
/**
 * Safely executes a function only in browser environment
 * @param fn Function to execute
 * @param fallback Optional fallback value for SSR
 * @returns The result of the function or fallback value
 */
export function browserOnly<T>(fn: () => T, fallback?: T): T | undefined {
  if (isBrowser()) {
    return fn();
  }
  return fallback;
}
