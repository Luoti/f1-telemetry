<template>
    <section class="positions">
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
            <td class="team" :style="getTeamStyles(car.teamId)"></td>
            <td v-if="settings.show.positionsGap" class="has-text-right">{{ formatMilliseconds(car.deltaToFront) }}</td>
            <td v-if="settings.show.positionsPenalty" class="has-text-right"><span v-if="car.penalty > 0">{{ car.penalty }}</span></td>
            <td v-if="settings.show.positionsTyrecompound" class="has-text-centered">
              <div class="tyre" :style="getTyreStyles(car.visualTyreCompound)">
                <div class="tyre-content">
                  {{ getTyreLetter(car.visualTyreCompound) }}
                </div>
              </div>
            </td>
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

function getTyreStyles(tyre) {

  let color = '';

  switch (tyre) {
    case 7:
      color = 'green'; break
    case 8:
      color = 'blue'; break
    case 16:
      color = 'red'; break
    case 17:
      color = 'yellow'; break
    case 18:
      color = 'gray'; break
  }

  return {
    color: color,
    borderColor: color,
  }
}

function getTyreLetter(tyre) {
  switch (tyre) {
    case 7:
      return 'I';
    case 8:
      return 'W';
    case 16:
      return 'S';
    case 17:
      return 'M';
    case 18:
      return 'H';
  }
}

function getTeamStyles(teamId) {
  let output = {}

  if (teamId) {
    output.backgroundImage = "url('/teams/icons/"+teamId+".png')"
  }

  return output
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

.table {
  font-size: 1.6rem;
  line-height: 1.6rem;
}

.tyre {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: solid 5px black;
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-family: serif;
  font-weight: bold;
}

.tyre-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-size: 1.1rem;
  text-align: center;
}

td.team {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

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
