import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // ["@babel/plugin-proposal-decorators", { legacy: true }],
    // ["@babel/plugin-proposal-class-properties", { loose: true }]
    '~/plugins/vue-jsonp'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // prefix: '/api'
    // baseURL:'http://localhost:8080',
    baseURL:'http://multauni.biz:8080',
    proxy:true
  },
  proxy: {
    '/schedule-api': {
      // target: 'http://localhost:8080',
      target: 'http://multauni.biz:8080',
      // pathRewrite: {
      //   '^/api': '/'
      // },
      changeOrigin: true,
      rejectUnauthorized: false
    }
  },
  "resolutions": {
    "vuetify": "2.2.24"
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        // dark: {
        //   primary: colors.blue.darken2,
        //   accent: colors.grey.darken3,
        //   secondary: colors.amber.darken3,
        //   info: colors.teal.lighten1,
        //   warning: colors.amber.base,
        //   error: colors.deepOrange.accent4,
        //   success: colors.green.accent3
        // },
        cyan: {
            primary: "#00bcd4",
            secondary: "#ff9800",
            accent: "#e91e63",
            error: "#f44336",
            warning: "#ffeb3b",
            info: "#3f51b5",
            success: "#8bc34a"
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  srcDir: 'src/'
}
