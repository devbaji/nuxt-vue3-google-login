# nuxt-vue3-google-login

[![npm version](https://img.shields.io/npm/v/nuxt-vue3-google-login.svg)](https://www.npmjs.com/package/nuxt-vue3-google-login)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-3%2B-00DC82.svg)](https://nuxt.com)

Nuxt 3 module for [vue3-google-login](https://github.com/devbaji/vue3-google-login) — zero-config Google OAuth integration with auto-imported components and utility functions.

## Features

- **Zero imports** — `<GoogleLogin>` component and all utility functions are auto-imported
- **SSR safe** — plugin runs only on the client (the Google GSI script is browser-only)
- **TypeScript** — full type support for module options and utility functions
- **One Tap** — easily trigger Google One Tap prompt
- **Flexible** — supports auth code, token, and credential (JWT) flows

## Quick Setup

```bash
npx nuxi@latest module add nuxt-vue3-google-login
```

That's it! The command installs the package and adds it to your `nuxt.config.ts`.

## Configuration

Add your Google Client ID to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-vue3-google-login'],

  googleLogin: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  },
})
```

You can also use an environment variable:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-vue3-google-login'],

  googleLogin: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
})
```

### All Options

| Option | Type | Default | Description |
|---|---|---|---|
| `clientId` | `string` | `''` | Your Google OAuth Client ID (required) |
| `prompt` | `boolean` | `false` | Show One Tap prompt automatically on page load |
| `autoLogin` | `boolean` | `false` | Enable automatic login (`auto_select` in GSI) |
| `popupType` | `'CODE' \| 'TOKEN'` | `'CODE'` | OAuth popup return type |
| `idConfiguration` | `object \| null` | `null` | Fine-grained [GSI IdConfiguration](https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration) overrides (serializable fields only) |
| `buttonConfig` | `object` | `{}` | [Google button appearance](https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration) options |

## Usage

### `<GoogleLogin>` Component

The component is globally available — no import needed:

```vue
<template>
  <GoogleLogin :callback="onSuccess" />
</template>

<script setup lang="ts">
import type { CallbackTypes } from 'vue3-google-login'

function onSuccess(response: CallbackTypes.CredentialPopupResponse) {
  // decodeCredential is auto-imported
  const user = decodeCredential(response.credential)
  console.log(user) // { name, email, picture, sub, ... }
}
</script>
```

### One Tap

```vue
<script setup lang="ts">
// googleOneTap is auto-imported
const response = await googleOneTap()
const user = decodeCredential(response.credential)
</script>
```

### Auth Code Flow

```vue
<script setup lang="ts">
// googleAuthCodeLogin is auto-imported
async function login() {
  const { code } = await googleAuthCodeLogin()
  // Send `code` to your server to exchange for tokens
}
</script>
```

### Token Flow

```vue
<script setup lang="ts">
// googleTokenLogin is auto-imported
async function login() {
  const { access_token } = await googleTokenLogin()
}
</script>
```

### Sign Out

```vue
<script setup lang="ts">
// googleLogout is auto-imported
function signOut() {
  googleLogout()
}
</script>
```

### Low-level SDK Access

```vue
<script setup lang="ts">
// googleSdkLoaded is auto-imported
googleSdkLoaded((google) => {
  google.accounts.id.prompt()
})
</script>
```

## Auto-imported Utilities

All functions from `vue3-google-login` are available without any import statement:

| Function | Description |
|---|---|
| `decodeCredential(token)` | Decode a Google JWT credential into a user object |
| `googleOneTap(options?)` | Show the One Tap prompt |
| `googleLogout()` | Disable auto-select / sign out |
| `googleTokenLogin(options?)` | Trigger OAuth popup returning an access token |
| `googleAuthCodeLogin(options?)` | Trigger OAuth popup returning an auth code |
| `googleSdkLoaded(callback)` | Run code once the Google GSI SDK is ready |

## Full Documentation

This module is a Nuxt wrapper for **vue3-google-login**. For the complete API reference — including all component props, callback types, GSI configuration options, and advanced usage — see the full documentation:

**[devbaji.github.io/vue3-google-login](https://devbaji.github.io/vue3-google-login/)**

## Notes

- **`callback` and `error` in module options** — these are function types that cannot be serialized into `runtimeConfig`. Pass `callback` as a prop on `<GoogleLogin :callback="...">`, or use `googleOneTap({ callback: ... })` for One Tap.
- **`idConfiguration` function fields** — `callback` and `native_callback` inside `idConfiguration` are also excluded for the same reason. Use `googleSdkLoaded` to set them programmatically if needed.

## Contributing

```bash
# Clone the repo
git clone https://github.com/devbaji/nuxt-vue3-google-login.git
cd nuxt-vue3-google-login

# Install dependencies
npm install

# Start playground dev server
GOOGLE_CLIENT_ID=your-client-id npm run dev

# Build the module
npm run prepack
```

## License

MIT — [Baji](https://github.com/devbaji)
