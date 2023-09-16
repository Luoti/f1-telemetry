<script>
  import { ref, reactive } from 'vue'
</script>

<script setup>

const socket = new WebSocket('ws://localhost:3000')

socket.onopen = (event) => {
  console.log("WebSocket connection opened:", event);
}

// socket.onmessage = (event) => {
//   console.log("WebSocket message received:", event.value);
// }
const cars = reactive([]);

for (let i = 0; i<20; i++) {
  cars.push({
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'red',
  });
}

socket.onerror = (error) => {
  console.log("WebSocket error:", error);
}

socket.onclose = (event) => {
  console.log("WebSocket connection closed:", event.code);
}

const handleMessageSubmit = (username,text) => {
  socket.send(JSON.stringify(messageData))
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // console.log(message.car);
  try {
    cars[message.car].left = message.x + 'px'
    cars[message.car].top = message.y + 'px'
  } catch (error) {
    console.log(message.car);
  }
}

</script>

<template>
  <main>
    <div class="chat-window">
      <div v-for="(car, index) in cars" v-bind:key="index" class="car" :style="car">O</div>
    </div>
  </main>
</template>

<style scoped>
.car {
  font-size: 60px;
}
</style>
