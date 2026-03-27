<script lang="ts" setup>
import { supabase } from '@/lib/supabaseClient.ts'
import { useDataStore } from '@/stores/data'
import { ref, watchEffect } from 'vue'

const dataStore = useDataStore()

const avatar = ref<string | null>(null)

const props = defineProps<{
  type: 'reply' | 'comment'
}>()

const emits = defineEmits(['confirmReply'])

const textarea = ref<string | null>(null)

watchEffect(async () => {
  avatar.value = await dataStore.fetchWithRetry(dataStore.currentUser)
})

async function insertData(type: 'reply' | 'send') {
  if (!textarea.value) return

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        content: textarea.value,
        type: props.type,
        parent_comment: props.type === 'reply' ? dataStore.actionFocus : null,
        user_id: dataStore.currentUser?.id,
      },
    ])
    .select()

  if (type === 'reply') {
    emits('confirmReply')
  }

  await dataStore.getComments()

  textarea.value = ''
  console.log(dataStore.comments)
}
</script>
<template>
  <div class="card card__current-user">
    <img :src="avatar" alt="" v-if="avatar !== null" />

    <textarea
      class="textarea font-2-r color-grey-500"
      data-function="textarea-user"
      :name="`new-${props.type}`"
      :placeholder="`Add a ${props.type}...`"
      v-model="textarea"
      >{{
        `${props.type === 'comment' ? '' : '@' + dataStore.users.find((i) => i.id === dataStore.comments.find((i) => i.id === dataStore.actionFocus)?.user_id)?.username + ' '}`
      }}</textarea
    >

    <button
      class="button--purple"
      data-function="send"
      type="button"
      @click="insertData('send')"
      v-if="props.type === 'comment'"
    >
      <span class="sr-only">Click this button to submit your comment</span>
      <span class="font-2-m">SEND</span>
    </button>

    <button
      class="button--purple"
      data-function="confirm-reply"
      type="button"
      v-if="props.type === 'reply'"
      @click="insertData('reply')"
    >
      <span class="sr-only">Click this button to submit your reply</span>
      <span class="font-2-m">REPLY</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/main.scss' as v;
@use '@/assets/styles/functions.scss' as f;

.card__current-user {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: v.$spacing-0200;
}

.textarea {
  grid-column: 1/-1;
  grid-row: 1;
}

@media (min-width: f.em(700)) {
  .card__current-user {
    display: flex;
    align-items: start;
    gap: v.$spacing-0200;
  }
}
</style>
