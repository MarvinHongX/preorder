// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: process.env.TOKEN_EXPIRATION,
    session: process.env.SESSION,
    saltRounds: process.env.SALT_ROUNDS,
    coolApiKey: process.env.COOL_API_KEY,
    coolApiSecret: process.env.COOL_API_SECRET,
    coolCallerNumber: process.env.COOL_CALLER_NUMBER,
    agencyNewVerification: process.env.AGENCY_NEW_VERIFICATION,
    dbUrl: process.env.DB_URL,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
  },
  app: {
    head: {
        title: 'ROAM | XR7(MAX7)',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'ROAM | XR7(MAX7) Preorder' },
          ],
    }
},
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxtjs/sitemap', '@nuxt/ui']
})