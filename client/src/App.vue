<template>
  <main class="container is-fluid">

    <h1 class="title is-1">{{ track.name }}</h1>

    <section class="mainSection columns">
      <div class="column">
        <div class="map block has-background-black" :style="getMapStyles()">
          <div class="mapOffset" :style="getMapOffsetStyles()">
            <div v-for="(car, index) in cars" v-bind:key="index" class="car" :style="getCarStyles(car)">
              <div class="tag is-dark" v-if="car.ai == 0" :style="nameTagStyles"> {{ car.name }} </div>
            </div>
          </div>
        </div>

        <div class="block">
          <nav class="panel">
            <p class="panel-heading">
              Map controls
            </p>

            <div class="panel-block">
              <p class="is-size-6">Map Offset</p>
            </div>
            <div class="panel-block is-horizontal">
              <p class="control">
                <div class="columns">
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">X:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapOffset.x" /></div></div>
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Y:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapOffset.y" /></div></div>
                </div>
                <div class="columns">
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Width:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapOffset.width" /></div></div>
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Height:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapOffset.height" /></div></div>
                </div>
                <div class="columns">
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Rotate:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapOffset.rotate" /></div></div>
                </div>
              </p>
            </div>

            <div class="panel-block">
              <p class="is-size-6">Map Size</p>
            </div>
            <div class="panel-block is-horizontal">
              <p class="control">
                <div class="columns">
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Width:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapSize.width" /></div></div>
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Height:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapSize.height" /></div></div>
                </div>
              </p>
            </div>
          </nav>

          <div class="field is-grouped is-grouped-centered">
            <p class="control">
              <button class="button is-primary" @click="getMockData('participants')">Participants</button>
            </p>
            <p class="control">
              <button class="button" @click="getMockData('motion')">Motion</button>
            </p>
            <p class="control">
              <button class="button" @click="getMockData('session')">Session</button>
            </p>
            <p class="control">
              <button class="button" @click="getMockData('lapdata1')">lapdata1</button>
            </p>
            <p class="control">
              <button class="button" @click="getMockData('lapdata2')">lapdata2</button>
            </p>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="positions">
          <h2 class="title is-2">Positions</h2>
          <table class="table">
            <thead>
              <tr>
                <th class="has-text-right">Pos</th>
                <th></th>
                <th></th>
                <th>Team</th>
                <th class="has-text-right">Gap</th>
                <th class="has-text-right">Penalty</th>
              </tr>
            </thead>
            <TransitionGroup name="list" tag="tbody">
              <tr v-for="(car, index) in posSortedCars" v-bind:key="car.origIndex" :class="{'is-selected': car.ai == 0}">
                <td class="has-text-right">{{ car.pos }}</td>
                <td><span v-if="car.driver !== 'DRV'">{{ car.driver }}</span></td>
                <td>{{ car.name }}</td>
                <td><span v-if="car.team !== 'INVALID'">{{ car.team }}</span></td>
                <td class="has-text-right">{{ formatMilliseconds(car.deltaToFront) }}</td>
                <td class="has-text-right"><span v-if="car.penalty > 0">{{ car.penalty }}</span></td>
              </tr>
            </TransitionGroup>
          </table>
        </div>
      </div>
    </section>
  
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
  rotate: 0,
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
  let sortedCars = cars.filter((car) => car.pos != 0);

  // For the vue for key
  for (let i in sortedCars) {
    sortedCars[i].origIndex = i;
  }

  return sortedCars.sort((a,b) => a.pos > b.pos)
})

const nameTagStyles = computed(() => {
  return {
    rotate: 0-mapOffset.rotate + 'deg'
  }
})

function getMapOffsetStyles() {
  return {
    left: mapOffset.x + '%',
    top: mapOffset.y + '%',
    rotate: mapOffset.rotate + 'deg'
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
    left: ((car.x * (mapOffset.height/100))) + '%',
    top: ((car.y * (mapOffset.width/100))) + '%'
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
.car .tag {
  position: absolute;
  transform: translateX(18%) translateY(-150%);
  transform-origin: left top;
  z-index: 10;
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
