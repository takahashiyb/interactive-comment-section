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

function deletePost() {
  dataStore.isDialogOpen = false
}
</script>

<template>
  <dialog :open="dataStore.isDialogOpen">
    <div>
      <span class="text__header font-1 color-grey-800">Delete comment</span>
      <span class="text__content font-2-r color-grey-500"
        >Are you sure you want to delete this comment? This will remove the comment and can’t be
        undone.</span
      >
      <button class="font-2-m bg-grey-500" @click="dataStore.isDialogOpen = false">
        NO, CANCEL
      </button>
      <button class="font-2-m bg-pink" @click="deletePost">YES, DELETE</button>
    </div>
  </dialog>
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

dialog {
  height: 100dvh;
  width: 100dvw;
  background-color: rgba(v.$black, 50%);

  outline: none;
  border: none;

  position: fixed;

  place-items: center;
}

dialog[open] {
  display: grid;
}

dialog div {
  background-color: v.$white;
  max-width: 400px;
  opacity: 100%;

  padding: v.$spacing-0300;

  border-radius: 10px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: v.$spacing-0300;
  column-gap: v.$spacing-0200;
}

dialog .text__header {
  grid-column: 1/-1;
  grid-row: 1;
}

dialog .text__content {
  grid-column: 1/-1;
  grid-row: 2;
}

dialog button {
  color: v.$white;
  border: none;
  border-radius: 8px;

  padding: v.$spacing-0100;
}

.bg-pink {
  background-color: v.$pink-400;
}

.bg-grey-500 {
  background-color: v.$grey-500;
}

.bg-pink:hover {
  background-color: v.$pink-200;
}

.bg-grey-500:hover {
  background-color: v.$grey-800;
}
</style>
