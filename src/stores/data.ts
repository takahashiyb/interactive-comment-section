import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient.ts'

import { defineStore } from 'pinia'
import type { Users } from '@/types/users'
import type { Comments } from '@/types/comments'

export const useDataStore = defineStore('data', () => {
  const isUsersReady = ref<boolean>(false)

  const users = ref<Users[]>([])

  async function getUsers() {
    const { data, error } = await supabase.from('users').select('*')

    if (error) {
      console.log(error)
    } else {
      users.value = data as Users[]
      isUsersReady.value = true
    }
  }

  const isCommentsReady = ref<boolean>(false)

  const comments = ref<Comments[]>([])

  async function getComments() {
    const { data, error } = await supabase.from('comments').select('*')

    if (error) {
      console.log(error)
    } else {
      comments.value = data as Comments[]
      isCommentsReady.value = true
    }
  }

  const isDataReady = computed<boolean>(() => {
    if (isUsersReady && isCommentsReady) {
      return true
    } else {
      return false
    }
  })

  const actionFocus = ref<Users['id'] | null>(null)

  const currentUser = computed<Users | undefined>(() =>
    users.value.find((i) => i.id === '357b8a8b-78d9-4bdd-8d8d-a7794a5528b4'),
  )

  async function fetchWithRetry(user: Users | undefined) {
    try {
      const file = user?.image.png.replace('./images/avatars/', '')

      if (!file) throw new Error('Empty')

      const { data } = supabase.storage.from('avatars').getPublicUrl(file)

      return data.publicUrl
    } catch {
      console.error('no image returned, retry')
      return null
    }
  }

  return {
    users,
    getUsers,
    comments,
    getComments,
    currentUser,
    isDataReady,
    actionFocus,
    fetchWithRetry,
  }
})
