<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useDataStore } from '@/stores/data'
import type { Comments } from '@/types/comments'
import type { Users } from '@/types/users'
import CurrentUserCard from './CurrentUserCard.vue'

const dataStore = useDataStore()

const avatar = ref<string | null>(null)

const props = defineProps<{
  details: Comments
  user: Users | undefined
}>()

const replyToUser = ref<string | null>(null)

watchEffect(async () => {
  avatar.value = await dataStore.fetchWithRetry(props.user)
  getRepliedUser()
})

function getRepliedUser() {
  const userId = dataStore.comments.find((i) => i.id === props.details.parent_comment)?.user_id

  const id = dataStore.users.find((i) => i.id === userId)?.username

  if (!id) return null

  replyToUser.value = id
}

function getMonth(time: number) {
  return Math.floor(time / (1000 * 60 * 60 * 24 * 30))
}

function getWeek(time: number) {
  return Math.floor(time / (1000 * 60 * 60 * 24 * 7))
}

function getDays(time: number) {
  return Math.floor(time / (1000 * 60 * 60 * 24))
}

function getHours(time: number) {
  return Math.floor(time / (1000 * 60 * 60))
}

function getMinutes(time: number) {
  return Math.floor(time / (1000 * 60 * 60))
}

function getCreateDate() {
  const currentDate = Date.now()

  const createdDate = Number(new Date(props.details.createdAt))

  const monthsElapsed = getMonth(currentDate) - getMonth(createdDate)

  if (monthsElapsed > 0) {
    return monthsElapsed + ` month${monthsElapsed === 1 ? '' : 's'} ago`
  }

  const weeksElapsed = getWeek(currentDate) - getWeek(createdDate)

  if (weeksElapsed > 0) {
    return weeksElapsed + ` week${weeksElapsed === 1 ? '' : 's'} ago`
  }

  const daysElapsed = getDays(currentDate) - getDays(createdDate)

  if (daysElapsed > 0) {
    return daysElapsed + ` day${daysElapsed === 1 ? '' : 's'} ago`
  }

  const hoursElapsed = getHours(currentDate) - getHours(createdDate)

  if (hoursElapsed > 0) {
    return hoursElapsed + ` day${hoursElapsed === 1 ? '' : 's'} ago`
  }

  return getMinutes(currentDate) - getMinutes(createdDate)
}

function updatePost() {
  dataStore.actionFocus = null
}

function replyPost() {
  dataStore.actionFocus = null
}
</script>
<template>
  <div class="card card__engagement">
    <section class="container__score">
      <button
        :class="{ disable: dataStore.currentUser?.id !== props.details.user_id }"
        type="button"
      >
        <span class="sr-only">Give the {{ props.details.type }} an upvote</span>
        <img src="@/assets/icons/icon-plus.svg" alt="" />
      </button>
      <p class="font-2-m color-purple">
        {{ props.details.score }}
      </p>
      <button
        :class="{ disable: dataStore.currentUser?.id !== props.details.user_id }"
        type="button"
      >
        <span class="sr-only">Give the {{ props.details.type }} an downvote</span>
        <img src="@/assets/icons/icon-minus.svg" alt="" />
      </button>
    </section>

    <section class="container__details">
      <img :src="avatar" alt="user avatar" v-if="avatar" />

      <p class="font-2-m">
        {{ props.user?.username }}
      </p>

      <p class="indicator__current-user font-3" v-if="props.user?.id === dataStore.currentUser?.id">
        you
      </p>

      <p class="font-2-r color-grey-500">{{ getCreateDate() }}</p>
    </section>

    <section class="container__content">
      <p
        class="font-2-r color-grey-500"
        v-if="
          dataStore.actionFocus !== props.details.id ||
          props.details.user_id !== dataStore.currentUser?.id
        "
      >
        <span class="font-2-m color-purple" v-if="replyToUser">@{{ replyToUser + ' ' }}</span>
        {{ props.details.content }}
      </p>
      <div
        class="container__update"
        v-if="
          dataStore.actionFocus === props.details.id &&
          props.details.user_id === dataStore.currentUser?.id
        "
      >
        <textarea class="font-2-r color-grey-500">{{
          `${replyToUser ? '@' + replyToUser + ' ' : ''}${props.details.content}`
        }}</textarea>
        <button class="font-2-m button--purple" type="button" @click="updatePost">
          <span class="sr-only">Click to update reply you are editing</span>
          <span>UPDATE</span>
        </button>
      </div>
    </section>

    <div
      class="container__buttons container__user-actions"
      v-if="dataStore.currentUser?.id === props.details.user_id"
    >
      <button class="button--icon" type="button" @click="dataStore.isDialogOpen = true">
        <span class="sr-only">Click to delete your {{ props.details.type }}</span>
        <img src="@/assets/icons/icon-delete.svg" alt="" />
        <span class="color-pink font-2-m">DELETE</span>
      </button>
      <button
        class="button--icon"
        type="button"
        @click="
          dataStore.actionFocus !== props.details.id
            ? (dataStore.actionFocus = props.details.id)
            : (dataStore.actionFocus = null)
        "
      >
        <span class="sr-only">click to edit your {{ props.details.type }}</span>
        <img src="@/assets/icons/icon-edit.svg" alt="" />
        <span class="color-purple font-2-m">EDIT</span>
      </button>
    </div>

    <div class="container__buttons container__reply">
      <button
        class="button--icon"
        v-if="dataStore.currentUser?.id !== props.details.user_id"
        type="button"
        @click="
          dataStore.actionFocus !== props.details.id
            ? (dataStore.actionFocus = props.details.id)
            : (dataStore.actionFocus = null)
        "
      >
        <span class="sr-only">Click to open input to reply to this {{ props.details.type }}</span>
        <img src="@/assets/icons/icon-reply.svg" alt="" />
        <span class="color-purple font-2-m">REPLY</span>
      </button>
    </div>
  </div>

  <div
    v-if="
      dataStore.actionFocus === props.details.id &&
      props.details.user_id !== dataStore.currentUser?.id
    "
    class="card__reply"
  >
    <CurrentUserCard type="reply" @confirm-reply="replyPost" />
  </div>

  <ul
    class="container__engagements"
    v-if="dataStore.comments.filter((i) => i.parent_comment === props.details.id).length > 0"
  >
    <li
      v-for="reply in dataStore.comments
        .filter((i) => i.parent_comment === props.details.id)
        .sort((a, b) => {
          return a.index - b.index
        })"
    >
      <EngagementCard
        :details="reply"
        :user="dataStore.users.find((i) => i.id === reply.user_id)"
      />
    </li>
  </ul>
</template>
<style lang="scss" scoped>
@use '@/assets/styles/main.scss' as v;
@use '@/assets/styles/functions.scss' as f;

.card__engagement {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: v.$spacing-0200;
}

.container__details {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: v.$spacing-0200;
  word-wrap: break-word;

  justify-self: start;
  grid-column: 1/-1;
  grid-row: 1;
}

.indicator__current-user {
  background-color: v.$purple-600;
  color: v.$white;

  padding-inline: v.$spacing-0100;

  border-radius: 4px;
}

.container__details img {
  min-width: 24px;
  min-height: 24px;
}

.container__content {
  grid-column: 1/-1;
  grid-row: 2;
}

.container__score {
  background-color: v.$grey-050;
  width: fit-content;

  padding: v.$spacing-0100;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: v.$spacing-0200;

  grid-column: 1;
  grid-row: 3;
}

.container__score button {
  border: none;
  background-color: transparent;

  flex-shrink: 0;
}

.container__score button:hover {
  filter: invert(1) hue-rotate(180deg) brightness(2);
}

.container__buttons {
  grid-column: 2;
  grid-row: 3;
  justify-self: end;
  align-self: center;
}

.button--icon:has(.color-purple):hover {
  filter: brightness(2) grayscale(0.5);
}

.button--icon:has(.color-pink):hover {
  filter: brightness(2) grayscale(0.5);
}

.button--icon {
  background-color: transparent;
  border: none;

  display: flex;
  align-items: center;
  gap: v.$spacing-0100;
}

.container__user-actions {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: v.$spacing-0200;
  flex-wrap: wrap;
}

.container__engagements {
  padding-left: 16px;

  border-left: 4px solid v.$grey-100;

  margin-left: 16px;
}

.container__update {
  display: grid;
  gap: v.$spacing-0200;
}

@media (max-width: f.em(350)) {
  .container__score {
    flex-direction: column;
  }
}

@media (min-width: f.em(700)) {
  .card__engagement {
    grid-template-columns: max-content 1fr;
  }

  .container__score {
    grid-column: 1;
    grid-row: 1/3;

    flex-direction: column;
  }

  .container__details {
    grid-column: 2;
  }

  .container__content {
    grid-column: 2/-1;
    grid-row: 2;
  }

  .container__buttons {
    grid-column: 2;
    grid-row: 1;
  }
}
</style>
