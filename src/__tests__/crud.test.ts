import { describe, it, expect, vi, beforeAll } from 'vitest'
import App from '@/App.vue'
import { flushPromises, mount } from '@vue/test-utils'
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

function formatSupabaseTimestamp(ms: number = Date.now()): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    d.getUTCFullYear() +
    '-' +
    pad(d.getUTCMonth() + 1) +
    '-' +
    pad(d.getUTCDate()) +
    ' ' +
    pad(d.getUTCHours()) +
    ':' +
    pad(d.getUTCMinutes()) +
    ':' +
    pad(d.getUTCSeconds()) +
    '+00'
  )
}

let { mockComments } = vi.hoisted(() => {
  return {
    mockComments: [
      {
        id: '50e49771-dc8e-4360-8413-296581b7d630',
        index: 1,
        content:
          "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: '2026-02-23 16:00:00+00',
        score: 12,
        type: 'comment',
        user_id: '357b8a8b-78d9-4bdd-8d8d-a7794a5528b4',
        parent_comment: null,
      },
      {
        id: 'd715df66-ba6d-490d-b5bc-764e1bcfa57b',
        index: 2,
        content:
          "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
        createdAt: '2026-03-22 16:00:00+00',
        score: 2,
        type: 'reply',
        user_id: '357b8a8b-78d9-4bdd-8d8d-a7794a5528b4',
        parent_comment: 'f21f42b7-2e15-4c16-a5cd-14ca556908f9',
      },
      {
        id: 'ea39245f-f448-4e39-b2ae-d4b54446ea15',
        index: 1,
        content:
          "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
        createdAt: '2026-03-16 16:00:00+00',
        score: 4,
        type: 'reply',
        user_id: 'b0764ac2-2866-4bbb-878e-05a360c16c7f',
        parent_comment: 'f21f42b7-2e15-4c16-a5cd-14ca556908f9',
      },
      {
        id: 'f21f42b7-2e15-4c16-a5cd-14ca556908f9',
        index: 2,
        content:
          "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: '2026-03-09 16:00:00+00',
        score: 5,
        type: 'comment',
        user_id: 'b92fa825-1458-4f11-9c79-9f693afc6ff2',
        parent_comment: null,
      },
    ],
  }
})

vi.mock('@/lib/supabaseClient.ts', () => ({
  supabase: {
    from: vi.fn(function (table: string) {
      if (table === 'users') {
        return {
          select: vi.fn().mockResolvedValue({
            data: [
              {
                id: '357b8a8b-78d9-4bdd-8d8d-a7794a5528b4',
                username: 'juliusomo',
                image:
                  '{"png": "./images/avatars/image-juliusomo.png", "webp": "./images/avatars/image-juliusomo.webp"}',
                type: 'user',
                comments: ['50e49771-dc8e-4360-8413-296581b7d630'],
              },
              {
                id: '85e2e5ac-b31d-4dd2-9dba-448d6b5636a0',
                username: 'amyrobson',
                image:
                  '{"png": "./images/avatars/image-amyrobson.png", "webp": "./images/avatars/image-amyrobson.webp"}',
                type: 'user',
                comments: null,
              },
              {
                id: 'b0764ac2-2866-4bbb-878e-05a360c16c7f',
                username: 'ramsesmiron',
                image:
                  '{"png": "./images/avatars/image-ramsesmiron.png", "webp": "./images/avatars/image-ramsesmiron.webp"}',
                type: 'user',
                comments: null,
              },
              {
                id: 'b92fa825-1458-4f11-9c79-9f693afc6ff2',
                username: 'maxblagun',
                image:
                  '{"png": "./images/avatars/image-maxblagun.png", "webp": "./images/avatars/image-maxblagun.webp"}',
                type: 'user',
                comments: null,
              },
            ],
            error: null,
          }),
        }
      }
      if (table === 'comments') {
        return {
          select: vi.fn(() => {
            return {
              order: vi.fn(function (param: string, { ascending }) {
                return {
                  order: vi.fn(function (param: string, { ascending }) {
                    return {
                      data: mockComments,
                      error: null,
                    }
                  }),
                }
              }),
            }
          }),
          insert: vi.fn((rows: any[]) => {
            const inserted = rows.map((row, i) => ({
              id: `mock-id-${Date.now()}-${i}`,
              index: 1,
              createdAt: formatSupabaseTimestamp(),
              ...row,
            }))
            mockComments.push(...inserted)
            return {
              select: vi.fn(() => {
                return {
                  data: mockComments,
                  error: null,
                }
              }),
            }
          }),
          delete: vi.fn(() => {
            return {
              eq: vi.fn(() => {
                return {
                  select: vi.fn(async () => {
                    mockComments = mockComments.filter((i) => {
                      i.id !== '50e49771-dc8e-4360-8413-296581b7d630'
                    })
                    dataStore.getComments()
                    return
                  }),
                }
              }),
            }
          }),
          update: vi.fn((change: object) => {
            type Comment = {
              id: string
              index: number
              content: string
              createdAt: string
              score: number
              type: string
              user_id: string
              parent_comment: string | null
            }
            const key = Object.keys(change)[0] as keyof Comment
            const value = Object.values(change)[0] as string
            return {
              eq: vi.fn((text: string, id: string) => {
                const focusId = id
                return {
                  select: vi.fn(() => {
                    const subject: any = mockComments.find((i) => i.id === focusId)!
                    subject[key] = value as any
                  }),
                }
              }),
            }
          }),
        }
      }
    }),
    channel: vi.fn(() => {
      return {
        on: vi.fn(() => {
          return {
            subscribe: vi.fn(() => {
              return
            }),
          }
        }),
      }
    }),
  },
}))

beforeAll(() => {
  vi.clearAllMocks()
})

describe('Start up display', () => {
  it('test the comment card', () => {
    const comment = app.find('[data-id="50e49771-dc8e-4360-8413-296581b7d630"]')
    const score = comment.find('.container__score').find('p')
    const details = comment.find('.container__details')
    const content = comment.find('.container__content')
    const actionButton = comment.find('.container__user-actions')

    expect(details.text()).contain('juliusomo')
    expect(details.text()).contain('1 month ago')
    expect(content.text()).contain('Impressive')
    expect(score.text()).contain(12)
    expect(actionButton.exists()).toBe(true)
    expect(actionButton.exists()).toBe(true)
  })

  it('test the reply card', () => {
    const comment = app.find('[data-id="ea39245f-f448-4e39-b2ae-d4b54446ea15"]')
    const score = comment.find('.container__score').find('p')
    const details = comment.find('.container__details')
    const content = comment.find('.container__content')
    const replyButton = comment.find('.container__reply')

    expect(details.text()).contain('ramsesmiron')
    expect(details.text()).contain('2 weeks ago')
    expect(content.text()).contain('@maxblagun')
    expect(content.text()).contain("If you're still new,")
    expect(score.text()).contain(4)
    expect(replyButton.text()).contain('REPLY')
  })

  it('test current user card', () => {
    const user = app.find('.card__current-user')
    const textarea = user.find('textarea')
    const button = user.find('button')

    expect(textarea.exists()).toBe(true)
    expect(button.text()).contain('SEND')
  })
})

describe('Adding data to server', async () => {
  it('adding a comment', async () => {
    const textArea = app.find('[data-function="textarea-user"]')
    const buttonSend = app.find('[data-function = "send"]')
    await textArea.setValue('Test1')
    await nextTick()
    await buttonSend.trigger('click')

    expect(JSON.stringify(dataStore.comments)).toContain('Test1')
  })
  it('adding a reply', async () => {
    const replyButton = app.find('[data-function="reply"]')
    replyButton.trigger('click')
    await nextTick()
    const textarea = app.find('[name="new-reply"]')
    const sendButton = app.find('[data-function="confirm-reply"]')

    expect(textarea.exists()).toBe(true)
    expect(sendButton.exists()).toBe(true)

    await textarea.setValue('Test2')
    await nextTick()
    await sendButton.trigger('click')
    await nextTick()

    expect(JSON.stringify(dataStore.comments)).toContain('Test2')
  })
})

describe('Deleting data in server', () => {
  it('click delete button to confirm delete', async () => {
    const buttonDelete = app.find('[data-function="delete"]')
    dataStore.actionFocus = '50e49771-dc8e-4360-8413-296581b7d630'
    await buttonDelete.trigger('click')
    await nextTick()
    const dialog = app.find('dialog')

    expect(dialog.exists()).toBe(true)

    const buttonConfirmDelete = dialog.find('[data-function="confirm-delete"]')
    buttonConfirmDelete.trigger('click')
    await nextTick()

    expect(
      dataStore.comments.find((i) => i.id === '50e49771-dc8e-4360-8413-296581b7d630'),
    ).toBeUndefined()
  })
})

describe('Update data in server', () => {
  it('click edit button to update content', async () => {
    const card = app.find('[data-id="50e49771-dc8e-4360-8413-296581b7d630"]')
    const engagementCard = card.findComponent({ name: 'EngagementCard' })
    const buttonEdit = engagementCard.find('[data-function="edit"]')

    await buttonEdit.trigger('click')
    await nextTick()

    const textArea = engagementCard.find('.container__content textarea')

    textArea.setValue('Test1')
    await nextTick()

    const buttonConfirmUpdate = engagementCard.find('.container__content button')

    buttonConfirmUpdate.trigger('click')
    await nextTick()
    await flushPromises()

    const newText = engagementCard.find('.container__content p')

    expect(JSON.stringify(dataStore.comments)).toContain('Test1')
    expect(newText.text()).toBe('Test1')
  })
  it('click increment score', async () => {
    const card = app.find('[data-id="50e49771-dc8e-4360-8413-296581b7d630"]')
    const engagementCard = card.findComponent({ name: 'EngagementCard' })
    const buttonPlus = engagementCard.find('[data-function="plusScore"]')

    await buttonPlus.trigger('click')
    await nextTick()

    expect(
      dataStore.comments.find((i) => i.id === '50e49771-dc8e-4360-8413-296581b7d630')!.score,
    ).toBe(13)
  })

  it('click increment score', async () => {
    const card = app.find('[data-id="50e49771-dc8e-4360-8413-296581b7d630"]')
    const engagementCard = card.findComponent({ name: 'EngagementCard' })
    const buttonMinus = engagementCard.find('[data-function="minusScore"]')

    await buttonMinus.trigger('click')
    await nextTick()

    expect(
      dataStore.comments.find((i) => i.id === '50e49771-dc8e-4360-8413-296581b7d630')!.score,
    ).toBe(12)
  })
})
