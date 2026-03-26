<script setup lang="ts">
import { watchEffect } from 'vue'
import EngagementCard from './components/EngagementCard.vue'
import { useDataStore } from './stores/data'
import CurrentUserCard from './components/CurrentUserCard.vue'

const dataStore = useDataStore()

watchEffect(() => {
  dataStore.getUsers()
  dataStore.getComments()
})
</script>

<template>
  <p v-if="!dataStore.isDataReady">is loading</p>
  <ul v-else class="container__comment">
    <li v-for="comment in dataStore.comments.filter((i) => i.type === 'comment')">
      <EngagementCard
        :details="comment"
        :user="dataStore.users.find((i) => i.id === comment.user_id)"
      />
    </li>
  </ul>

  <div class="container__user">
    <CurrentUserCard type="comment" />
  </div>
</template>

<style lang="scss" scoped>
@use '/src/assets/styles/main.scss' as v;

.container__comment {
  padding-top: v.$spacing-0500;
  padding-inline: v.$spacing-0200;
}

.container__user {
  padding-inline: v.$spacing-0200;
}
</style>
