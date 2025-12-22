<script setup lang="ts">
import ProfileComponent from '@/components/ProfileComponent.vue'
import RankingComponent from '@/components/RankingComponent.vue'
import AddNewSchorleComponent from '@/components/AddNewSchorleComponent.vue'

/**
 * TODO:
 * - History of last years
 */
</script>

<template>
  <!-- Header -->
  <header id="header">
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

  <ProfileComponent />
  <RankingComponent />
  <div class="new-schorle-button">
    <AddNewSchorleComponent />
  </div>

  <!-- Footer -->
  <footer id="footer">
    <div class="copyright">Developed with Schorle 🍇</div>
  </footer>
</template>

<style scoped>
.new-schorle-button {
  position: fixed;
  bottom: 64px;
  right: 64px;
}
</style>
