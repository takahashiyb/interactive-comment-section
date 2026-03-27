import { describe, it, expect } from 'vitest'
import App from '@/App.vue'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { useDataStore } from '@/stores/data'

const pinia = createPinia()
const app = mount(App, {
  global: {
    plugins: [pinia],
  },
})

describe('Adding data to supabase', () => {
  const dataStore = useDataStore()
  it('adding a comment', async () => {
    const textArea = app.find('[data-function="textarea-user"]')
    const buttonSend = app.find('[data-function = "send"]')
    await textArea.setValue('Test1')
    await buttonSend.trigger('click')

    console.log('what' + dataStore.comments)

    expect(app.text()).toContain('Test1')
  })
  it('adding a reply', () => {})
})

describe('Remove data from supabase', () => {
  it('remove a comment', () => {})
  it('remove a reply', () => {})
})

describe('Edit data in supabase', () => {
  it('edit a comment', () => {})
  it('edit a reply', () => {})
})
