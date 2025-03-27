import Aura from "@primeuix/themes/aura"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
  ],

  tailwindcss: {
    // Explicitly set the config path
    configPath: "~/tailwind.config.js",
    // Set to false if you're using PostCSS 8
    exposeConfig: true,
    viewer: true,
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "html.dark",
          dark: true,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3030",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "CRM",
    },
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/dark-mode.css",
    "~/assets/css/theme-loader.css",
  ],
  app: {
    head: {
      title: "CRM",
      meta: [{ name: "description", content: "Portal pour accéder à vos données CRM" }],
      script: [
        {
          innerHTML: `
          (function() {
            // Add loading class immediately
            document.documentElement.classList.add("theme-loading");
            
            const storedTheme = localStorage.getItem("theme");
            
            if (storedTheme === "dark" || 
                (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.classList.add("dark");
            }
            
            // Wait for DOM to be ready then remove loading class
            window.addEventListener("DOMContentLoaded", () => {
              document.documentElement.classList.remove("theme-loading");
              document.documentElement.classList.add("theme-ready");
            });
          })();
        `,
          type: "text/javascript;charset=utf-8",
        },
      ],
    },
  },
})
