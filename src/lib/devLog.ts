// src/lib/devLog.ts

/**
 * Display logs only in development mode (npm run dev).
 * Logs show up in yellow with a timestamp and [DEV] tag to help debugging.
 * Nothing is printed in production.
 */
export function devLog(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    // Generate timestamp in the format YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const ts = now.toLocaleString('sv-SE').replace('T', ' ').slice(0, 19); // sv-SE returns YYYY-MM-DD HH:mm:ss
    // Formatted message
    const prefix = `%c[DEV][${ts}]`;
    // Bright yellow style
    const style = 'color: #eab308; font-weight: bold;';
    // Print the log (colorful in browser, plain text in Node)
    if (typeof window !== 'undefined') {
      console.log(prefix, style, ...args);
    } else {
      // Node has no color but keep the same format
      console.log(`[DEV][${ts}]`, ...args);
    }
  }
}
