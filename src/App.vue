<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient.ts'
import EngagementCard from './components/EngagementCard.vue'

import type { Comments } from '@/types/comments'
import type { Users } from '@/types/users'

const users = ref<Users[]>([])

async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  users.value = data as Users[]

  if (error) {
    console.log(error)
  }
}

const comments = ref<Comments[]>([])

async function getComments() {
  const { data, error } = await supabase.from('comments').select('*').eq('type', 'comment')
  comments.value = data as Comments[]

  if (error) {
    console.log(error)
  }
}

const replies = ref<Comments[]>([])

async function getReplies() {
  const { data, error } = await supabase.from('comments').select('*')
  replies.value = data as Comments[]

  if (error) {
    console.log(error)
  }
}

onMounted(() => {
  getUsers()
  getComments()
  getReplies()
})
</script>

<template>
  <ul>
    <li v-for="comment in comments">
      <EngagementCard :details="comment" :user="users.find((i) => i.id === comment.user_id)" />
    </li>
  </ul>
</template>

<style scoped></style>
