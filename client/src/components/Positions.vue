<template>
    <section class="positions">
        <h2 class="title is-2">Positions</h2>
        <table class="table">
        <thead>
            <tr>
            <th class="has-text-right">Pos</th>
            <th></th>
            <th>Team</th>
            <th v-if="settings.show.positionsGap" class="has-text-right">Gap</th>
            <th v-if="settings.show.positionsPenalty" class="has-text-right">Penalty</th>
            <th v-if="settings.show.positionsTyrecompound" class="has-text-right">Tyre</th>
            </tr>
        </thead>
        <TransitionGroup name="list" tag="tbody">
            <tr v-for="(car) in posSortedCars" v-bind:key="car.origIndex" :class="{'is-selected': car.ai == 0}" :style="getDriverStyles(car)">
            <td class="has-text-right">{{ car.pos }}</td>
            <td>{{ getDriverName(car) }}</td>
            <td><span v-if="car.team !== 'INVALID'">{{ car.team }}</span></td>
            <td v-if="settings.show.positionsGap" class="has-text-right">{{ formatMilliseconds(car.deltaToFront) }}</td>
            <td v-if="settings.show.positionsPenalty" class="has-text-right"><span v-if="car.penalty > 0">{{ car.penalty }}</span></td>
            <td v-if="settings.show.positionsTyrecompound" class="has-text-right">{{ car.visualTyreCompound }}</td>
            </tr>
        </TransitionGroup>
        </table>
    </section>
</template>

<script setup>

const props = defineProps({
    settings: {
        required: true
    },
    session: {
        required: true
    },
    posSortedCars: {
        required: true
    }
})

function formatMilliseconds(milliseconds) {
  if (isNaN(milliseconds) || milliseconds == 0) {
    return ''
  }

  let formattedTime = ''
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);

  if (minutes > 0) {
    formattedTime += minutes + ':'
  }

  const seconds = totalSeconds % 60;
  const remainingMilliseconds = milliseconds % 1000;

  // Format the result as a string
  formattedTime += `${seconds.toString().padStart(2, 0)}.${remainingMilliseconds.toString().padEnd(3, 0)}`;

  return formattedTime;
}

function getDriverStyles(car) {
  if (car.ai == 1) {
    return;
  }

  if (
    car.origIndex == props.session.player1CarIndex &&
    props.settings.player1Color != ''
  ) {
    return { backgroundColor: props.settings.player1Color }
  }

  if (
    car.origIndex == props.session.player2CarIndex &&
    props.settings.player2Color != ''
  ) {
    return { backgroundColor: props.settings.player2Color }
  }
}

function getDriverName(car) {
  if (car.driver !== 'DRV') {
    return car.driver
  }

  if (
    car.origIndex == props.session.player1CarIndex &&
    props.settings.player1Abbreviation != ''
  ) {
    return props.settings.player1Abbreviation
  }

  if (
    car.origIndex == props.session.player2CarIndex &&
    props.settings.player2Abbreviation != ''
  ) {
    return props.settings.player2Abbreviation
  }

  return car.name
}

</script>

<style scoped>

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
