<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type User, UserService } from '@/services/UserService.ts'
import { v4 as uuidv4 } from 'uuid'
import { useToast } from 'vue-toast-notification'
import LoadingComponent from '@/components/LoadingComponent.vue'

const localStorageUserIdKey = 'userId'
const toast = useToast()

const showProfile = ref<boolean>(false)
const toggleAccordion = () => {
  showProfile.value = !showProfile.value
}

const userLoading = ref<boolean>(false)
const user = ref<User>({
  id: uuidv4(),
  name: 'Anonymer Schorle-Liebhaber',
  target_schorle: 0,
  team: '',
  geschlecht: '',
})

const userFieldsValid = computed(() => {
  return (
    user.value.name.length > 0 &&
    user.value.target_schorle !== undefined &&
    user.value.target_schorle >= 0
  )
})

const loadUserOrCreateIfNotExisting = async (userId: string) => {
  userLoading.value = true
  const loadedUser = await UserService.loadUser(userId)
  if (loadedUser) {
    user.value = loadedUser
  } else {
    showProfile.value = true
    await UserService.createUser(user.value)
  }
  userLoading.value = false
}

const onSave = async () => {
  if (userFieldsValid.value) {
    userLoading.value = true
    user.value.name = user.value.name.trim()
    user.value.team = user.value.team.trim()

    await UserService.updateUser(user.value)
    showProfile.value = false
    userLoading.value = false
    toast.success('Profil gespeichert', {
      duration: 3000,
      dismissible: true,
      position: 'bottom',
    })
  }
}

onMounted(() => {
  let userId = localStorage.getItem(localStorageUserIdKey)
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem(localStorageUserIdKey, userId)
  }
  user.value.id = userId
  loadUserOrCreateIfNotExisting(userId)
})
</script>

<template>
  <section id="main">
    <div class="inner">
      <section id="one" class="wrapper style1">
        <header class="accordion-header" @click="toggleAccordion">
          <button class="accordion-chevron" v-if="showProfile">▴</button>
          <button class="accordion-chevron" v-if="!showProfile">▾</button>
          <h2>Mein Profil</h2>
          <p>Name, Team, ...</p>
        </header>
        <div class="position-relative">
          <LoadingComponent :loading="userLoading" />
          <transition name="accordion">
            <div class="content profile" v-if="showProfile">
              <div class="input-field">
                <label for="form-name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="form-name"
                  class="form-control"
                  placeholder="Dein Name..."
                  v-model="user.name"
                />
              </div>
              <div class="input-field">
                <label for="form-name">Team</label>
                <input
                  type="text"
                  name="team"
                  id="form-team"
                  class="form-control"
                  placeholder="Dein Team..."
                  v-model="user.team"
                />
              </div>
              <div class="input-field">
                <label for="form-name">Geschlecht (optional)</label>
                <select
                  class="form-control"
                  name="geschlecht"
                  id="form-geschlecht"
                  v-model="user.geschlecht"
                >
                  <option value="">---</option>
                  <option value="m">Männlich</option>
                  <option value="w">Weiblich</option>
                </select>
              </div>
              <div class="input-field">
                <label for="form-targetSchorle"> Wie viele Schorle möchtest du trinken? </label>
                <input
                  type="number"
                  name="targetSchorle"
                  id="form-targetSchorle"
                  min="0"
                  max="99"
                  class="form-control"
                  placeholder="Anzahl der Ziel-Schorle..."
                  v-model="user.target_schorle"
                />
              </div>

              <button :disabled="!userFieldsValid" @click="onSave">Speichern</button>
            </div>
          </transition>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.accordion-header {
  position: relative;
  cursor: pointer;
}

.accordion-chevron {
  position: absolute;
  font-size: 2rem;
  right: 16px;
  margin-top: -4px;
  cursor: pointer;
  z-index: 1;
  background-color: transparent;
  color: #000 !important;
  width: auto;
}

.accordion-enter-active,
.accordion-leave-active {
  transition:
    max-height 0.25s ease,
    opacity 0.2s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 900px;
  opacity: 1;
}
</style>
