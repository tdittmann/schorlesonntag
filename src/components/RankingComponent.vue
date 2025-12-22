<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { type Drink, type Participant, ParticipantService } from '@/services/ParticipantService.ts'
import { v4 as uuidv4 } from 'uuid'
import LoadingComponent from '@/components/LoadingComponent.vue'

type Props = {
  selectedYear: number
}
const props = defineProps<Props>()

type RankingType = 'Gesamt' | 'Team' | 'Männer' | 'Frauen'
const currentRankingType = ref<RankingType>('Gesamt')
const changeRankingType = (value: RankingType) => {
  currentRankingType.value = value
}

const participantsLoading = ref<boolean>(false)
const participants = ref<Participant[]>([])
const loadParticipants = () => {
  participantsLoading.value = true
  ParticipantService.loadParticipants(props.selectedYear).then((value) => {
    participants.value = value
    participantsLoading.value = false
  })
}

type Ranking = {
  id: string
  name: string
  subName?: string
  targetSchorle?: number
  drinks: number
  numberOfTeamMembers: number // only in case of rankingType "team"
}

const ranking = computed<Ranking[]>(() => {
  if (currentRankingType.value === 'Männer') {
    return [...participants.value]
      .filter((value) => value.geschlecht === 'm')
      .map(toRanking)
      .sort(sortByDrinksAndName)
  } else if (currentRankingType.value === 'Frauen') {
    return [...participants.value]
      .filter((value) => value.geschlecht === 'w')
      .map(toRanking)
      .sort(sortByDrinksAndName)
  } else if (currentRankingType.value === 'Team') {
    const teamMap = [...participants.value]
      .filter((p) => p.team && p.team.trim() !== '')
      .reduce<Record<string, Ranking>>((acc, participant) => {
        const teamName = participant.team

        if (!acc[teamName]) {
          acc[teamName] = {
            id: teamName,
            name: teamName,
            drinks: 0,
            numberOfTeamMembers: 0,
          }
        }

        acc[teamName].numberOfTeamMembers += 1
        acc[teamName].drinks += calculateNumberOfSchorle(participant.drinks)

        return acc
      }, {})
    return Object.values(teamMap)
      .map((value) => {
        value.subName = `${value.numberOfTeamMembers} Trinker`
        return value
      })
      .sort(sortByDrinksAndName)
  }

  return [...participants.value].map(toRanking).sort(sortByDrinksAndName)
})

const toRanking = (participant: Participant) => {
  return {
    id: uuidv4(),
    name: participant.name,
    subName: participant.team,
    targetSchorle: participant.target_schorle,
    drinks: calculateNumberOfSchorle(participant.drinks),
  } as Ranking
}

const calculateNumberOfSchorle = (drinks: Drink[]) => {
  return drinks
    .filter((value) => !value.deleted)
    .map((value) => {
      if (value.type === 'Ochsenschorle') {
        return 2
      }
      return 1
    })
    .reduce((previousValue, currentValue) => {
      return previousValue + currentValue
    }, 0)
}

const sortByDrinksAndName = (a: Ranking, b: Ranking) => {
  if (a.drinks !== b.drinks) {
    return b.drinks - a.drinks
  }
  return a.name.localeCompare(b.name)
}

watch(
  () => props.selectedYear,
  () => loadParticipants(),
)

onMounted(() => {
  loadParticipants()
})
</script>

<template>
  <section id="main">
    <div class="inner">
      <section id="one" class="wrapper style1">
        <header class="position-relative">
          <button class="reload" @click="loadParticipants">&#8635;</button>
          <h2>Rangliste</h2>
          <p>Wer isch vorne?</p>
        </header>

        <div class="position-relative">
          <LoadingComponent :loading="participantsLoading" />
          <div class="content ranking-types">
            <span
              class="badge"
              :class="{ 'badge-active': currentRankingType === 'Gesamt' }"
              @click="changeRankingType('Gesamt')"
            >
              Gesamt
            </span>
            <span
              class="badge"
              :class="{ 'badge-active': currentRankingType === 'Team' }"
              @click="changeRankingType('Team')"
            >
              Team
            </span>
            <span
              class="badge"
              :class="{ 'badge-active': currentRankingType === 'Männer' }"
              @click="changeRankingType('Männer')"
            >
              Männer
            </span>
            <span
              class="badge"
              :class="{ 'badge-active': currentRankingType === 'Frauen' }"
              @click="changeRankingType('Frauen')"
            >
              Frauen
            </span>
          </div>

          <div class="table-wrap">
            <table class="responsive-table">
              <thead>
                <tr>
                  <th class="text-center">Pl.</th>
                  <th>Name</th>
                  <th class="text-center">Schorle</th>
                  <th class="text-center" v-if="currentRankingType === 'Team'">⌀</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(participant, index) in ranking"
                  :key="participant.id"
                  :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }"
                >
                  <td class="text-center">
                    {{ index + 1 }}
                  </td>
                  <td class="participant-name">
                    {{ participant.name }}
                    <br v-if="participant.subName || participant.targetSchorle" />
                    <span v-if="participant.subName" class="participant-team">
                      {{ participant.subName }}
                    </span>
                    <span
                      v-if="participant.subName && participant.targetSchorle"
                      class="participant-team"
                    >
                      |
                    </span>
                    <span v-if="participant.targetSchorle" class="participant-team">
                      Ziel: {{ participant.targetSchorle }}
                    </span>
                  </td>
                  <td class="participant-schorle">{{ participant.drinks }}</td>
                  <td v-if="currentRankingType === 'Team'" class="participant-schorle">
                    {{
                      Math.round((participant.drinks / participant.numberOfTeamMembers) * 10) / 10
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.reload {
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

.ranking-types {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.badge {
  background: gray;
  color: #fff;
  border-radius: 12px;
  padding: 2px 12px;
  cursor: pointer;
}

.badge-active {
  background: darkviolet !important;
}

.participant-name {
  line-height: 1;
}

.participant-team {
  font-size: 0.75rem;
}

.participant-schorle {
  text-align: center;
}

tbody > tr {
  position: relative;
}

thead > tr:nth-child(-n + 3)::before {
  content: '';
}

tbody > tr::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
}

.gold::before {
  background: #ffd700;
}

.silver::before {
  background: #c0c0c0;
}

.bronze::before {
  background: #cd7f32;
}
</style>
