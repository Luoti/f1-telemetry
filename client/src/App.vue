<template>
  <main class="container is-fluid">

    <h1 class="title is-2 f1-font">{{ session.trackName }}</h1>

    <section class="mainSection columns">
      <div class="column" v-if="settings.show.map">
        <map-component 
          :settings="settings"
          :cars="cars"
          :session="session"
          :mapOffset="mapOffset"
          :mapSize="mapSize"
          :savedDebugCarPositions="savedDebugCarPositions"
           />
      </div>

      <div v-if="settings.show.positions" class="column f1-font">
        <positions :settings="settings" :cars="cars" :session="session"></positions>
      </div>

      <div v-if="settings.show.pitStrategy" class="column">
        <pit-strategy :settings="settings" :session="session" :cars="cars"></pit-strategy>
      </div>
    </section>
  
    <settings-modal :settings="settings"></settings-modal>

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
        <button class="button" @click="getMockData('carstatus')">CarStatus</button>
      </p>
      <p class="control">
        <button class="button" @click="getMockData('lapdata1')">lapdata1</button>
      </p>
      <p class="control">
        <button class="button" @click="getMockData('lapdata2')">lapdata2</button>
      </p>
      <p class="control">
        <button class="button" @click="startCarPositionSave">
          Save car positions (
            <span v-if="savedDebugCarPositions.timer">stop</span>
            <span v-else>start</span>
            )
        </button>
      </p>

    </div>

  </main>

</template>

<script setup>

import { reactive, watch, onMounted } from 'vue'
import { additionalMapData } from './resources/additionalMapData'

import MapComponent from './components/MapComponent.vue';
import Positions from './components/Positions.vue';
import PitStrategy from './components/PitStrategy.vue';
import SettingsModal from './components/SettingsModal.vue';

// socket.onmessage = (event) => {
//   console.log("WebSocket message received:", event.value);
// }
// @TODO move to map component
const mapOffset = reactive({
  x: 200,
  y: 200,
  rotate: 0,
  width: 10,
  height: 10
});
// @TODO move to map component
const mapSize = reactive({
  width: 500,
  height: 500
});

const session = reactive({});
const cars = reactive([]);

var socket = null

const settings = reactive({
  websocketHost: 'localhost:3000',
  player1NetworkId: 0,
  player2NetworkId: 1,
  player1Abbreviation: '',
  player2Abbreviation: '',
  player1Color: '',
  player2Color: '',
  show: {
    map: true,
    mapControls: true,
    positions: true,
    positionsGap: true,
    positionsPenalty: true,
    pitStrategy: true,
  }
});

// Try to load settings from localstorage
if (localStorage.getItem('settings') !== null) {
  const savedSettings = JSON.parse(localStorage.getItem('settings'))

  for (const prop in settings) {
    if (savedSettings[prop] !== null) [
      settings[prop] = savedSettings[prop]
    ]
  }
}

// Autosave settings
watch(settings, (settings, oldSettings) => {
  localStorage.setItem('settings', JSON.stringify(settings))
})

// Reconnect when host is changed
watch(
  () => settings.websocketHost,
  () => {
    // fires only when state.someObject is replaced
    connectWebSocket()
  }
)

onMounted(() => {
  connectWebSocket()
})

// @TODO move to map component
// Load additional map data when session changes
watch(session, (session) => {
  if (typeof additionalMapData[session.trackId] == 'undefined') {
    return
  }

  for (let prop in additionalMapData[session.trackId].mapOffset) {
    mapOffset[prop] = additionalMapData[session.trackId].mapOffset[prop]
  }
  for (let prop in additionalMapData[session.trackId].mapSize) {
    mapSize[prop] = additionalMapData[session.trackId].mapSize[prop]
  }
})

function updateCars(data) {
  for (const participant in data.data) {

    // Don't add cars that don't have positions
    if (data.data[participant].pos == 0) {
      return;
    }

    if (typeof cars[participant] === 'undefined') {
      cars[participant] = {}
    }
    for (const prop in data.data[participant]) {
      cars[participant][prop] = data.data[participant][prop];
    }
  }
}

function updateSession(data) {
  for (const prop in data.data) {
    session[prop] = data.data[prop];
  }
}

function connectWebSocket() {
  if (socket) {
    socket.close();
  }
  socket = new WebSocket('ws://'+settings.websocketHost)

  socket.onopen = (event) => {
    console.log("WebSocket connection opened:", event);
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
    } else if (message.packetID == 'carStatus') {
      updateCars(message)
    } else if (message.packetID == 'session') {
      updateSession(message)
    }
  }
}

// @TODO move to map component
const savedDebugCarPositions = reactive({
  timer: null,
  savedPositions: []
});

function startCarPositionSave() {
  if (savedDebugCarPositions.timer !== null) {
    clearInterval(savedDebugCarPositions.timer)
    savedDebugCarPositions.timer = null
    return
  }

  savedDebugCarPositions.savedPositions = []

  savedDebugCarPositions.timer = setInterval(function() {
    for (let i in cars) {
      
      let debugCar = {}

      for (const prop in cars[i]) {
        debugCar[prop] = cars[i][prop];
      }
      savedDebugCarPositions.savedPositions.push(debugCar)
    }
  }, 5000)
}

function getMockData(name) {
  socket.send(name);
}

</script>

<style scoped>
.mainSection {
  display: flex;
}
</style>
