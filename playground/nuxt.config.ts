export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',

  googleLogin: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    // prompt: true,      // uncomment to show One Tap on load
    // autoLogin: false,
    // popupType: 'CODE',
  },
})
