<script setup lang="ts">
import { ref } from 'vue'
import { DrinkService } from '@/services/DrinkService.ts'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

const isOpen = ref(false)
const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const schorleTyp = ref<'Normales Schorle' | 'Ochsenschorle' | undefined>(undefined)

const onSave = async () => {
  const userId = localStorage.getItem('userId')
  if (userId && schorleTyp.value) {
    await DrinkService.saveNewDrink(userId, schorleTyp.value)
    toast.success('Schorle gespeichert, lass es dir schmecken 🍇', {
      duration: 3000,
      dismissible: true,
      position: 'bottom',
    })
    schorleTyp.value = undefined
    close()
  }
}
</script>

<template>
  <!-- Floating Button -->
  <button class="floating-btn" @click="open">+</button>

  <!-- Overlay -->
  <div v-if="isOpen" class="overlay" @click="close"></div>

  <!-- Dialog Card -->
  <div v-if="isOpen" class="dialog">
    <div class="dialog-header position-relative">
      <h3>Neues Schorle eintragen</h3>
      <button class="close-btn" @click="close">×</button>
    </div>

    <div class="dialog-content">
      <fieldset>
        <div>
          <input
            type="radio"
            id="normal"
            name="schorletyp"
            value="Normales Schorle"
            v-model="schorleTyp"
          />
          <label for="normal">Normales Schorle</label>
        </div>
        <div style="margin-top: 1rem">
          <input type="radio" id="ochsen" name="drone" value="Ochsenschorle" v-model="schorleTyp" />
          <label for="ochsen">Ochsenschorle</label>
        </div>
      </fieldset>

      <button style="margin-top: 1rem" :disabled="schorleTyp === undefined" @click="onSave()">
        Speichern
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Floating Button */
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;

  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;

  background-color: #007bff;
  color: white;
  font-size: 32px;

  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  transition:
    transform 0.2s,
    background-color 0.3s;
}

.floating-btn:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* Dialog */
.dialog {
  position: fixed;
  bottom: 90px;
  right: 20px;

  width: 320px;
  background: white;
  border-radius: 12px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Header */
.dialog-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
}

/* Close Button */
.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  position: absolute;
  right: 8px;
  color: #000 !important;
  padding: 0;
  width: auto;
  top: 0;
}

/* Content */
.dialog-content {
  padding: 16px;
  font-size: 14px;
}
</style>
