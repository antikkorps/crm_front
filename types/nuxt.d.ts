import "@nuxt/schema"

declare module "@nuxt/schema" {
  interface NuxtConfig {
    tailwindcss?: {
      configPath?: string
      exposeConfig?: boolean
      viewer?: boolean
      [key: string]: any
    }
    vuetify?: {
      moduleOptions?: {
        styles?: {
          configFile?: string
        }
        includeTransformAssetsUrls?: Record<string, string[]>
        ssrClientHints?: {
          reloadOnFirstRequest?: boolean
          prefersColorScheme?: boolean
        }
        [key: string]: any
      }
      vuetifyOptions?: {
        theme?: {
          defaultTheme?: string
          themes?: Record<
            string,
            {
              dark?: boolean
              colors?: Record<string, string>
              [key: string]: any
            }
          >
          [key: string]: any
        }
        icons?: {
          defaultSet?: string
          [key: string]: any
        }
        [key: string]: any
      }
      [key: string]: any
    }
  }
}
