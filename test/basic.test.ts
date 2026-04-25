import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-vue3-google-login', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page without errors', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('does not include GSI script during SSR (client-only plugin)', async () => {
    const html = await $fetch('/')
    // The GSI script must not be rendered server-side
    expect(html).not.toContain('accounts.google.com/gsi/client')
  })
})
