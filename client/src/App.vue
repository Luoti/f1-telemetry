<template>
  <main>
    <section class="mainSection">
      <div class="map">
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

    <button @click="getParticipants">Participants</button>

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
const cars = reactive([]);

// for (let i = 0; i<20; i++) {
//   cars.push({
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     color: 'red',
//   });
// }

function getCarStyles(car) {
  return {
    'background-color': car.color,
    'index': car.ai == 0 ? 1 : 0
  }
}

function setParticipants(data) {
  for (const participant in data.data) {
    cars[participant] = data.data[participant];
  }
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
    setParticipants(message)
  }

  // try {
  //   cars[message.car].left = message.x + 'px'
  //   cars[message.car].top = message.y + 'px'
  // } catch (error) {
  //   console.log(message.car);
  // }
}

// MOCKS

function getParticipants() {
  socket.send('participants');
}

</script>

<style scoped>
.mainSection {
  display: flex;
}
.car {
  display: block;
  background: white;
  border-radius: 100%;
  width: 10px;
  height: 10px;
}
</style>
