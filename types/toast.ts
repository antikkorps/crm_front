// Extend NuxtApp interface
declare module "#app" {
  interface NuxtApp {
    $toast: ToastPlugin
  }
}

// Define the type for the toast plugin
export interface ToastPlugin {
  error: (message: string) => void
  success: (message: string) => void
  info: (message: string) => void
}
