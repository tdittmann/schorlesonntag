<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Props = {
  date: Date
}
const props = defineProps<Props>()

const time = ref({
  days: 0,
  minutes: 0,
  seconds: 0,
})

let interval: number

const updateCountdown = () => {
  const now = new Date().getTime()
  const target = props.date.getTime()
  const diff = Math.max(target - now, 0)

  const totalSeconds = Math.floor(diff / 1000)
  time.value.days = Math.floor(totalSeconds / 86400)
  time.value.minutes = Math.floor((totalSeconds % 86400) / 60)
  time.value.seconds = totalSeconds % 60
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <section id="main">
    <div class="inner">
      <section id="one" class="wrapper style2">
        <div class="countdown">
          <div class="unit">
            <span class="value">{{ time.days }}</span>
            <span class="label">Tage</span>
          </div>
          <div class="unit">
            <span class="value">{{ time.minutes }}</span>
            <span class="label">Minuten</span>
          </div>
          <div class="unit">
            <span class="value">{{ time.seconds }}</span>
            <span class="label">Sekunden</span>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.countdown {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  color: #fff;
}

.unit {
  text-align: center;
  min-width: 70px;
}

.value {
  display: block;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: bold;
}

.label {
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
