import {
  defineNuxtModule,
  addPlugin,
  addComponent,
  addImports,
  createResolver,
} from '@nuxt/kit'
import { defu } from 'defu'

export interface ButtonConfig {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: string
  locale?: string
  nonce?: string
}

/**
 * Serializable subset of IdConfiguration (function fields like `callback`
 * and `native_callback` are intentionally excluded — set those via the
 * `<GoogleLogin :callback="...">` component prop or via `googleSdkLoaded`).
 */
export interface IdConfiguration {
  auto_select?: boolean
  ux_mode?: 'popup' | 'redirect'
  login_uri?: string
  cancel_on_tap_outside?: boolean
  prompt_parent_id?: string
  nonce?: string
  context?: 'signin' | 'signup' | 'use'
  state_cookie_domain?: string
  allowed_parent_origin?: string | string[]
  use_fedcm_for_prompt?: boolean
  intermediate_iframe_close_callback?: never
  itp_support?: boolean
  hosted_domain?: string
}

export interface ModuleOptions {
  /**
   * Your Google OAuth 2.0 Client ID.
   * Required for the plugin to work.
   */
  clientId?: string

  /**
   * Automatically display the One Tap prompt on page load.
   * @default false
   */
  prompt?: boolean

  /**
   * Enable automatic login (maps to GSI `auto_select`).
   * @default false
   */
  autoLogin?: boolean

  /**
   * Type of OAuth popup — returns an auth code or an access token.
   * @default 'CODE'
   */
  popupType?: 'CODE' | 'TOKEN'

  /**
   * Fine-grained GSI IdConfiguration overrides.
   * Function fields (`callback`, `native_callback`) are not supported here;
   * pass them via `<GoogleLogin :callback="...">` instead.
   */
  idConfiguration?: IdConfiguration | null

  /**
   * Google Sign-In button appearance configuration.
   */
  buttonConfig?: ButtonConfig
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-vue3-google-login',
    configKey: 'googleLogin',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    clientId: '',
    prompt: false,
    autoLogin: false,
    popupType: 'CODE',
    idConfiguration: null,
    buttonConfig: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Expose serializable options to the client runtime plugin.
    // Users can also override individual values via nuxt.config runtimeConfig.
    nuxt.options.runtimeConfig.public.googleLogin = defu(
      nuxt.options.runtimeConfig.public.googleLogin as Partial<ModuleOptions>,
      options,
    ) as Required<ModuleOptions>

    // Client-only plugin — the GSI script is browser-only and will fail during SSR.
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })

    // Register GoogleLogin as a client-only component — the underlying library
    // throws an error when rendered on the server side.
    addComponent({
      name: 'GoogleLogin',
      filePath: 'vue3-google-login',
      export: 'GoogleLogin',
      mode: 'client',
    })

    // Pre-bundle vue3-google-login so Vite doesn't discover it late at runtime,
    // which would cause an unnecessary page reload in development.
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.include ||= []
    nuxt.options.vite.optimizeDeps.include.push('vue3-google-login')

    // Auto-import all utility functions and composables from vue3-google-login.
    addImports([
      { name: 'useGoogleSdk', from: 'vue3-google-login' },
      { name: 'decodeCredential', from: 'vue3-google-login' },
      { name: 'googleOneTap', from: 'vue3-google-login' },
      { name: 'googleLogout', from: 'vue3-google-login' },
      { name: 'googleTokenLogin', from: 'vue3-google-login' },
      { name: 'googleAuthCodeLogin', from: 'vue3-google-login' },
      { name: 'googleSdkLoaded', from: 'vue3-google-login' },
    ])
  },
})
