import { describe, it, expect, vi } from 'vitest'
import App from '@/App.vue'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { useDataStore } from '@/stores/data'
import { nextTick } from 'vue'

const pinia = createPinia()
const app = mount(App, {
  global: {
    plugins: [pinia],
  },
})

const dataStore = useDataStore()

// --- Mock supabase

// supabaseMock.ts
const fakeDB: Record<string, any[]> = {
  comments: [],
}

export const supabase = {
  from: (table: string) => ({
    insert: async (rows: any[]) => {
      fakeDB[table]!.push(...rows)
      return { data: rows, error: null }
    },
    update: async (values: any) => {
      // naive update: replace first row
      if (fakeDB[table]!.length > 0) {
        fakeDB[table]![0] = { ...fakeDB[table]![0], ...values }
        return { data: [fakeDB[table]![0]], error: null }
      }
      return { data: [], error: null }
    },
    delete: async () => {
      const deleted = [...fakeDB[table]!]
      fakeDB[table!] = []
      return { data: deleted, error: null }
    },
    select: async () => {
      return { data: fakeDB[table], error: null }
    },
  }),
}

// helper to reset between tests
export const resetFakeDB = () => {
  for (const key in fakeDB) fakeDB[key] = []
}

describe('Adding data to supabase', () => {
  it('adding a comment', async () => {
    const textArea = app.find('[data-function="textarea-user"]')
    const buttonSend = app.find('[data-function = "send"]')
    await textArea.setValue('Test1')
    await nextTick()
    await buttonSend.trigger('click')

    expect((textArea.element as HTMLTextAreaElement).value).toBe('Test1')
  })
  it('adding a reply', async () => {})
})

describe('Open delete dialog', () => {
  it('click delete button', async () => {
    const buttonDelete = app.find('[data-function="delete"]')
    await buttonDelete.trigger('click')
    const dialog = app.find('dialog')

    expect(dialog.exists()).toBe(true)
  })
})
