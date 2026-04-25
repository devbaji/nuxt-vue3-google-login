<template>
  <div class="container">
    <h1>nuxt-vue3-google-login playground</h1>

    <section v-if="!user">
      <p>Sign in with your Google account:</p>

      <!-- GoogleLogin is auto-imported by the module -->
      <GoogleLogin :callback="onSuccess" />

      <hr>

      <p>Or use One Tap:</p>
      <button @click="triggerOneTap">
        Show One Tap prompt
      </button>
    </section>

    <section v-else>
      <h2>Welcome, {{ user.name }}!</h2>
      <p>Email: {{ user.email }}</p>
      <img
        :src="user.picture"
        :alt="user.name"
        width="80"
      >
      <br><br>
      <!-- googleLogout is auto-imported by the module -->
      <button @click="signOut">
        Sign out
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CallbackTypes } from 'vue3-google-login'

const user = ref<Record<string, string> | null>(null)

function onSuccess(response: CallbackTypes.CredentialPopupResponse) {
  // decodeCredential is auto-imported by the module
  user.value = decodeCredential(response.credential) as Record<string, string>
}

async function triggerOneTap() {
  try {
    // googleOneTap is auto-imported by the module
    const response = await googleOneTap()
    user.value = decodeCredential(response.credential) as Record<string, string>
  }
  catch {
    console.error('One Tap failed or was dismissed')
  }
}

function signOut() {
  googleLogout()
  user.value = null
}
</script>

<style>
body {
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 480px;
  margin: 80px auto;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
}
h1 { font-size: 1.4rem; margin-bottom: 1.5rem; color: #111; }
h2 { color: #111; }
p { color: #555; }
button {
  background: #4285f4;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
button:hover { background: #3367d6; }
hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
img { border-radius: 50%; margin-top: 8px; }
</style>
