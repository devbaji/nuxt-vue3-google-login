import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  googleLogin: {
    clientId: 'test-client-id.apps.googleusercontent.com',
  },
})
