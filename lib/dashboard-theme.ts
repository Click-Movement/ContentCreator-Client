export const dashboardTheme = {
  colors: {
    primary: {
      DEFAULT: "#0091FF", // Vibrant blue
      hover: "#0077e6",
      light: "#e6f4ff",
      dark: "#0060b8",
    },
    secondary: {
      DEFAULT: "#6366f1", // Indigo
      hover: "#5253cd",
      light: "#eef2ff",
    },
    success: {
      DEFAULT: "#10b981", // Green
      light: "#ecfdf5",
    },
    warning: {
      DEFAULT: "#f59e0b", // Amber
      light: "#fffbeb",
    },
    danger: {
      DEFAULT: "#ef4444", // Red
      light: "#fef2f2",
    },
    info: {
      DEFAULT: "#3b82f6", // Blue
      light: "#eff6ff",
    },
    accent: {
      purple: "#8b5cf6",
      pink: "#ec4899",
      orange: "#f97316",
      teal: "#14b8a6",
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    }
  },
  animation: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    medium: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  }
};