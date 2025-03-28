// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // Définir les modules une seule fois
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
  ],

  tailwindcss: {
    configPath: "~/tailwind.config.js",
    exposeConfig: true,
    viewer: true,
  },

  vuetify: {
    moduleOptions: {
      // Options spécifiques au module
      includeTransformAssetsUrls: {
        // Ajoute le support des assets dans les templates
        "v-img": ["src", "lazy-src"],
        "v-carousel-item": ["src", "lazy-src"],
      },
      ssrClientHints: {
        reloadOnFirstRequest: false,
        prefersColorScheme: true,
      },
      styles: { configFile: "assets/vuetify.scss" },
      /* autres options du module */
    },
    vuetifyOptions: {
      // Options de Vuetify (équivalent à ce que vous passeriez à createVuetify)
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            dark: false,
            colors: {
              primary: "#1867C0",
              secondary: "#5CBBF6",
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: "#2196F3",
              secondary: "#03A9F4",
            },
          },
        },
      },
      // Autres options (icons, components, etc.)
      icons: {
        defaultSet: "mdi", // Utilisera @mdi/font
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
    // Remplacer par la ligne commentée ci-dessous une fois le package correctement installé
    // "@mdi/font/css/materialdesignicons.min.css",
  ],

  app: {
    head: {
      title: "CRM",
      meta: [{ name: "description", content: "Portal pour accéder à vos données CRM" }],
      script: [
        {
          innerHTML: `
          (function() {
            const storedTheme = localStorage.getItem("theme");
            
            if (storedTheme === "dark" || 
                (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.classList.add("dark");
            }
          })();
        `,
          type: "text/javascript",
        },
      ],
    },
  },
})
