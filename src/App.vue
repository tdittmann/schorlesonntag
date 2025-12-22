<script setup lang="ts">
import ProfileComponent from '@/components/ProfileComponent.vue'
import RankingComponent from '@/components/RankingComponent.vue'
import AddNewSchorleComponent from '@/components/AddNewSchorleComponent.vue'
import { ref } from 'vue'
import CountdownComponent from '@/components/CountdownComponent.vue'

const selectedYear = ref<number>(2025)
const yearsToSelect = [2024, 2025]
const schorleTime = new Date(2026, 7, 19)
const isSchorleTime = new Date().toDateString() === schorleTime.toDateString()
</script>

<template>
  <!-- Header -->
  <header id="header">
    <select class="form-control history-selector" name="selectedYear" v-model="selectedYear">
      <option v-for="yearToSelect in yearsToSelect" :key="yearToSelect" :value="yearToSelect">
        {{ yearToSelect }}
      </option>
    </select>

    <div class="logo">
      <a href="/">
        Schorlesonntag
        <span>
          Nicht jedermann auf die Welt, der findet unser Dahenfeld, <br />
          doch Trinker mit geübter Nase zieht es magnetisch her zum Glase!
        </span>
      </a>
    </div>
  </header>

  <CountdownComponent v-if="!isSchorleTime" :date="schorleTime" />

  <ProfileComponent />
  <RankingComponent :selectedYear="selectedYear" />
  <div class="new-schorle-button">
    <AddNewSchorleComponent v-if="isSchorleTime" />
  </div>

  <!-- Footer -->
  <footer id="footer">
    <div class="copyright">Developed with Schorle 🍇</div>
  </footer>
</template>

<style scoped>
.history-selector {
  text-align: center;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  border: none;
  color: #fff;
  font-weight: bold;
}

.new-schorle-button {
  position: fixed;
  bottom: 64px;
  right: 64px;
}
</style>
