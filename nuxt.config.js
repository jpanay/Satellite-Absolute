import pkg from './package.json'

export default {
  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Satellite-Absolute',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/fontawesome.ts' },
    { src: '~/plugins/clipboard.ts' },
    { src: '~/plugins/notifications.ts' },
    { src: '~/plugins/persist.ts', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/ngrok',
    '@nuxtjs/style-resources',
    '@nuxtjs/device',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-i18n',
    '@nuxtjs/toast',
    '@nuxtjs/pwa',
    [
      'nuxt-mq',
      {
        // Default breakpoint for SSR
        defaultBreakpoint: 'sm',
        breakpoints: {
          sm: 450,
          md: 1250,
          lg: Infinity,
        },
      },
    ],
  ],

  toast: {
    position: 'top-center',
    duration: 1000,
    containerClass: 'toasty-container',
  },

  styleResources: {
    less: './assets/styles/vars/*.less',
  },

  pwa: {
    manifest: {
      name: 'Satellite.im',
      short_name: 'Satellite.im',
      description: 'A decentralized chat & filesharing application',
      lang: 'en',
      useWebmanifestExtension: false,
      display: 'standalone',
      background_color: '#16161e',
      theme_color: '#16161e',
      orientation: 'portrait',
      prefer_related_applications: false,
    },
  },

  i18n: {
    defaultLocale: 'en',
    langDir: '~/locales',
    locales: [
      {
        code: 'en',
        file: 'en-US.js',
      },
    ],
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  publicRuntimeConfig: {
    clientName: pkg.name,
    clientVersion: pkg.version,
  },
}