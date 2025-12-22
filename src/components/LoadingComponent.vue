<script setup lang="ts">
type Props = {
  loading: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <transition name="fade">
    <div v-if="props.loading" class="overlay">
      <div class="spinner">Loading<span class="dots"></span></div>
    </div>
  </transition>
</template>

<style scoped>
/* Overlay */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 10;

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  background: rgba(255, 255, 255, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading text */
.spinner {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
}

/* Animated dots */
.dots::after {
  content: '';
  animation: dots 1.5s steps(3, end) infinite;
}

@keyframes dots {
  0% {
    content: '';
  }
  33% {
    content: '.';
  }
  66% {
    content: '..';
  }
  100% {
    content: '...';
  }
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
