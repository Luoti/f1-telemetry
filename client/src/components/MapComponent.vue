<template>
    <section>
        <div class="map block has-background-black" :style="getMapStyles()">
          <div class="mapOffset" :style="getMapOffsetStyles()">
            <div v-for="(car, index) in cars" v-bind:key="index" class="car" :style="getCarStyles(car)">
              <div class="tag is-dark f1-font" v-if="car.ai == 0" :style="nameTagStyles"> {{ getDriverName(car) }} </div>
            </div>

            <div v-for="(car, index) in savedDebugCarPositions.savedPositions" v-bind:key="index" class="car" :style="getCarStyles(car)"> </div>
          </div>
        </div>

        <div v-if="settings.show.mapControls" class="block p-3">
          <nav class="panel">
            <p class="panel-heading">
              Map controls
            </p>

            <div class="panel-block">
              <p class="is-size-6">Map Offset</p>
            </div>
            <div class="panel-block is-horizontal">
              <div class="control">
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
              </div>
            </div>

            <div class="panel-block">
              <p class="is-size-6">Map Size</p>
            </div>
            <div class="panel-block is-horizontal">
              <div class="control">
                <div class="columns">
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Width:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapSize.width" /></div></div>
                  <div class="column is-narrow"><div class="field-label is-normal"><label class="label">Height:</label></div></div>
                  <div class="column"><div class="field-body"><input class="input" type="number" step="0.5" v-model="mapSize.height" /></div></div>
                </div>
              </div>
            </div>
          </nav>
        </div>
    </section>
</template>

<script setup>

import { computed } from 'vue'

const props = defineProps({
    settings: {
        required: true
    },
    session: {
        required: true
    },
    cars: {
        required: true
    },
    mapOffset: {
        required: true
    },
    mapSize: {
        required: true
    },
    savedDebugCarPositions: {
        required: true
    }
})

const nameTagStyles = computed(() => {
  return {
    rotate: 0-props.mapOffset.rotate + 'deg'
  }
})

function getMapOffsetStyles() {
  return {
    left: props.mapOffset.x + '%',
    top: props.mapOffset.y + '%',
    rotate: props.mapOffset.rotate + 'deg'
  }
}

function getMapStyles() {
  let output = {
    width: props.mapSize.width + 'px',
    height: props.mapSize.height + 'px'
  }
  
  if (props.session.trackId) {
    output.backgroundImage = "url('/maps/"+props.session.trackId+".png')"
  }

  return output
}

function getCarStyles(car) {
  return {
    backgroundColor: car.color,
    zIndex: car.ai == 0 ? 1 : 0,
    borderWidth: (car.ai == 0 ? 3 : 1) + 'px',
    left: ((car.x * (props.mapOffset.height/100))) + '%',
    top: ((car.y * (props.mapOffset.width/100))) + '%'
  }
}

// @TODO this function is specified twice. COMBINE!
function getDriverName(car) {
  if (car.driver !== 'DRV') {
    return car.driver
  }

  if (
    car.networkId == props.settings.player1NetworkId &&
    props.settings.player1Abbreviation != ''
  ) {
    return props.settings.player1Abbreviation
  }

  if (
    car.networkId == props.settings.player2NetworkId &&
    props.settings.player2Abbreviation != ''
  ) {
    return props.settings.player2Abbreviation
  }

  return car.name
}

</script>

<style scoped>

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


</style>