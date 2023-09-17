<template>
  <main>

    <h1>{{ track.name }}</h1>

    <section class="mainSection">
      <div class="map" :style="getMapStyles()">
        <div class="mapOffset" :style="getMapOffsetStyles()">
          <div v-for="(car, index) in cars" v-bind:key="index" class="car" :style="getCarStyles(car)">
            <div class="nameTag" v-if="car.ai == 0"> {{ car.name }} </div>
          </div>
        </div>
      </div>

      <div class="positions">
        <h1>Positions</h1>
        <table>
          <TransitionGroup name="list" tag="tbody">
            <tr v-for="(car, index) in posSortedCars" v-bind:key="index" :class="{player: car.ai == 0}">
              <td class="right">{{ car.pos }}</td>
              <td><span v-if="car.driver !== 'DRV'">{{ car.driver }}</span></td>
              <td>{{ car.name }}</td>
              <td><span v-if="car.team !== 'INVALID'">{{ car.team }}</span></td>
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

    <div>
      Map offset
      
      <div>
        X: <input type="text" v-model="mapOffset.x" />
        Y: <input type="text" v-model="mapOffset.y" />
        Rotate: <input type="text" v-model="mapOffset.deg" />
        Width: <input type="text" v-model="mapOffset.width" />
        Height: <input type="text" v-model="mapOffset.height" />
      </div>
    </div>

    <div>
      Map size
      <div>
        Width: <input type="text" v-model="mapSize.width" />
        Height: <input type="text" v-model="mapSize.height" />
      </div>
    </div>

  </main>
</template>

<script setup>

import { reactive, computed, watch } from 'vue'
import {additionalMapData} from './resources/additionalMapData'

const socket = new WebSocket('ws://localhost:3000')

socket.onopen = (event) => {
  console.log("WebSocket connection opened:", event);
}

// socket.onmessage = (event) => {
//   console.log("WebSocket message received:", event.value);
// }
const mapOffset = reactive({
  x: 200,
  y: 200,
  deg: 0,
  width: 10,
  height: 10
});
const mapSize = reactive({
  width: 500,
  height: 500
});
const track = reactive({
  id: null,
  name: 'Not loaded'
});

const cars = reactive([]);

// Load additional map data when track changes
watch(track, (track) => {
  console.log(track)

  for (let prop in additionalMapData[track.id].mapOffset) {
    mapOffset[prop] = additionalMapData[track.id].mapOffset[prop]
  }

  for (let prop in additionalMapData[track.id].mapSize) {
    mapSize[prop] = additionalMapData[track.id].mapSize[prop]
  }
})

const posSortedCars = computed(() => {
  return cars.toSorted((a,b) => a.pos > b.pos)
    .filter((car) => car.pos != 0)
})

function getMapOffsetStyles() {
  return {
    left: mapOffset.x + 'px',
    top: mapOffset.y + 'px',
    rotate: mapOffset.deg + 'deg'
  }
}

function getMapStyles() {
  let output = {
    width: mapSize.width + 'px',
    height: mapSize.height + 'px'
  }
  
  if (track.id) {
    output.backgroundImage = "url('/maps/"+track.id+".png')"
  }

  return output
}

function getCarStyles(car) {
    return {
    backgroundColor: car.color,
    zIndex: car.ai == 0 ? 1 : 0,
    borderWidth: (car.ai == 0 ? 3 : 1) + 'px',
    left: ((car.x * (mapOffset.width/100))) + '%',
    top: ((car.y * (mapOffset.height/100))) + '%'
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
  formattedTime += `${seconds}.${remainingMilliseconds.toString().padEnd(3, 0)}`;

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
  background-position: center center;
  background-size: contain;
  /* overflow: hidden; */
  z-index: -1;
}

.map .mapOffset {
  position: absolute;
  width: 100%;
  height: 100%;
}

.car {
  display: block;
  position: absolute;
  background: white;
  border-radius: 100%;
  width: 15px;
  height: 15px;
  border: solid 1px black;
  transform: translateX(-50%) translateY(-50%)
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

.positions {
  margin-left: 1em;
}
.positions table td {
  padding: 0.2em;
}

.positions table tr.player td {
  font-weight: bold;
  background-color: rgba(0, 0, 255, 0.2)
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
