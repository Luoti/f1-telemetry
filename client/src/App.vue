<template>
  <main>

    <h1>{{ track.name }}</h1>

    <section class="mainSection">
      <div class="map" :style="getMapStyles()">
        <div v-for="(car, index) in cars" v-bind:key="index" class="car" :style="getCarStyles(car)">
          <div class="nameTag" v-if="car.ai == 0"> {{ car.name }} </div>
        </div>
      </div>

      <div class="positions">
        <h1>Positions</h1>
        <table>
          <TransitionGroup name="list" tag="tbody">
            <tr v-for="(car, index) in posSortedCars" v-bind:key="index">
              <td class="right">{{ index+1 }}</td>
              <td>{{ car.driver }}</td>
              <td>{{ car.name }}</td>
              <td>{{ car.team }}</td>
              <td class="right">{{ formatMilliseconds(car.deltaToFront) }}</td>
              <td class="right">{{ car.penalty }}</td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </section>

    <button @click="getMockData('participants')">Participants</button>
    <button @click="getMockData('motion')">Motion</button>
    <button @click="getMockData('session')">Session</button>
    <button @click="getMockData('lapdata1')">lapdata1</button>
    <button @click="getMockData('lapdata2')">lapdata2</button>

  </main>
</template>

<script setup>

import { reactive, computed } from 'vue'

const socket = new WebSocket('ws://localhost:3000')

socket.onopen = (event) => {
  console.log("WebSocket connection opened:", event);
}

// socket.onmessage = (event) => {
//   console.log("WebSocket message received:", event.value);
// }
const track = reactive({
  id: null,
  name: 'Not loaded'
});
const cars = reactive([]);

const posSortedCars = computed(() => {
  return cars.toSorted((a,b) => a.pos > b.pos)
})

// for (let i = 0; i<20; i++) {
//   cars.push({
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     color: 'red',
//   });
// }

function getMapStyles() {
  let output = {}
  
  if (track.id) {
    output.backgroundImage = "url('public/maps/"+track.id+".png')"
  }

  return output
}

function getCarStyles(car) {
  return {
    'background-color': car.color,
    'index': car.ai == 0 ? 1 : 0,
    'left' : car.x + 'px',
    'top': car.y + 'px'
  }
}

function updateCars(data) {
  for (const participant in data.data) {
    if (typeof cars[participant] === 'undefined') {
      cars[participant] = {}
    }
    for (const prop in data.data[participant]) {
      cars[participant][prop] = data.data[participant][prop];
    }
  }
}

function formatMilliseconds(milliseconds) {
  if (milliseconds == 0) {
    return ''
  }

  let formattedTime = ''
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);

  if (minutes) {
    formattedTime += minutes+':'
  }

  const seconds = totalSeconds % 60;
  const remainingMilliseconds = milliseconds % 1000;

  // Format the result as a string
  formattedTime += `${seconds.toString().padStart(2, 0)}.${remainingMilliseconds.toString().padEnd(3, 0)}`;

  return formattedTime;
}

function updateSession(data) {
  track.id = data.data.id
  track.name = data.data.name
}

socket.onerror = (error) => {
  console.log("WebSocket error:", error);
}

socket.onclose = (event) => {
  console.log("WebSocket connection closed:", event.code);
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.packetID == 'participants') {
    updateCars(message)
  } else if (message.packetID == 'motion') {
    updateCars(message)
  } else if (message.packetID == 'lapData') {
    updateCars(message)
  } else if (message.packetID == 'session') {
    updateSession(message)
  }
}

// MOCKS

function getMockData(name) {
  socket.send(name);
}

</script>

<style scoped>
.mainSection {
  display: flex;
}

.map {
  position: relative;
  width: 500px;
  height: 500px;
  border: solid 1px white;
}

.car {
  display: block;
  position: absolute;
  background: white;
  border-radius: 100%;
  width: 15px;
  height: 15px;
  border: solid 1px black
}
.car .nameTag {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-110%);
  z-index: 10;
  padding: 0 0.5em;
  background: rgba(255,255,255,0.3);
  border-radius: 10%;
  color: black;
}

.positions table td {
  padding: 0.1em;
}

.positions table .right {
  text-align: right;
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
