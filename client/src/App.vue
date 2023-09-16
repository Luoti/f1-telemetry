<template>
  <main>

    <h1>{{ track.name }}</h1>

    <section class="mainSection">
      <div class="map" :style="getMapStyles()">
        <div v-for="(car, index) in cars" v-bind:key="index" class="car" :style="getCarStyles(car)"></div>
      </div>

      <div class="positions">
        <h1>Positions</h1>
        <table>
          <tbody>
            <tr v-for="(car, index) in cars" v-bind:key="index">
              <td>{{ index+1 }}</td>
              <td>{{ car.driver }}</td>
              <td>{{ car.name }}</td>
              <td>{{ car.team }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <button @click="getMockData('participants')">Participants</button>
    <button @click="getMockData('motion')">Motion</button>
    <button @click="getMockData('session')">Session</button>

  </main>
</template>

<script setup>

import { reactive } from 'vue'

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
  
  console.log(track.id)
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
  
  console.log(message);
  
  if (message.packetID == 'participants') {
    updateCars(message)
  } else if (message.packetID == 'motion') {
    updateCars(message)
  } else if (message.packetID == 'session') {
    updateSession(message)
  }

  // try {
  //   cars[message.car].left = message.x + 'px'
  //   cars[message.car].top = message.y + 'px'
  // } catch (error) {
  //   console.log(message.car);
  // }
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
</style>
