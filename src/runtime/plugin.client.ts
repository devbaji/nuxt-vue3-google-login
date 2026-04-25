import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import vue3GoogleLogin from 'vue3-google-login'
import type { ModuleOptions } from '../module'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.googleLogin as ModuleOptions

  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: config.clientId,
    prompt: config.prompt,
    autoLogin: config.autoLogin,
    popupType: config.popupType,
    idConfiguration: config.idConfiguration,
    buttonConfig: config.buttonConfig,
  })
})
