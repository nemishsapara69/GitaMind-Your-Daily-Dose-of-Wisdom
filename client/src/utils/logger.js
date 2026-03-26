// Utility function for logging errors only in development
export const logError = (...args) => {
  if (import.meta.env.DEV) {
    console.error(...args);
  }
};

// Utility function for logging warnings only in development
export const logWarn = (...args) => {
  if (import.meta.env.DEV) {
    console.warn(...args);
  }
};

// Utility function for logging info only in development
export const logInfo = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};
