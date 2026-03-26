<script lang="ts" setup>
import { useDataStore } from '@/stores/data'
import { ref, watchEffect } from 'vue'

const dataStore = useDataStore()

const avatar = ref<string | null>(null)

const props = defineProps<{
  type: 'reply' | 'comment'
}>()

const emits = defineEmits(['confirmReply'])

watchEffect(async () => {
  avatar.value = await dataStore.fetchWithRetry(dataStore.currentUser)
})
</script>
<template>
  <div class="card card__current-user">
    <img :src="avatar" alt="" v-if="avatar !== null" />

    <textarea
      class="textarea font-2-r color-grey-500"
      name="new-comment"
      :placeholder="`Add a ${props.type}...`"
      >{{
        `${props.type === 'comment' ? '' : '@' + dataStore.users.find((i) => i.id === dataStore.comments.find((i) => i.id === dataStore.actionFocus)?.user_id)?.username + ' '}`
      }}</textarea
    >

    <button class="button--purple" type="button" v-if="props.type === 'comment'">
      <span class="sr-only">Click this button to submit your comment</span>
      <span class="font-2-m">SEND</span>
    </button>

    <button
      class="button--purple"
      type="button"
      v-if="props.type === 'reply'"
      @click="$emit('confirmReply')"
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
