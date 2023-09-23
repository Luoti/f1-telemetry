<template>
    <section>
        <button class="button is-primary" @click="toggle">Settings</button>
        <div class="modal" :class="{'is-active': showSettings}">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Modal title</p>
                    <button class="delete" aria-label="close" @click="toggle"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                              <input v-model="settings.show.map" type="checkbox"> Map
                            </label>
                        </div>
                        <div class="control">
                            <label class="checkbox">
                              <input v-model="settings.show.mapControls" type="checkbox"> Map controls
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                              <input v-model="settings.show.positions" type="checkbox"> Positions
                            </label>
                        </div>
                        <div class="control">
                            <label class="checkbox">
                                <input v-model="settings.show.positionsGap" type="checkbox"> Positions / Gap
                            </label>
                        </div>
                        <div class="control">
                            <label class="checkbox">
                            <input v-model="settings.show.positionsPenalty" type="checkbox"> Positions / Penalty
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                                <input v-model="settings.show.pitStrategy" type="checkbox"> Pit strategy
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Player 1 abbreviation</label>
                        <div class="control">
                            <input class="input is-uppercase" type="text">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Player 2 abbreviation</label>
                        <div class="control">
                            <input class="input is-uppercase" type="text">
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="toggle">Close</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script setup>

import { ref } from "vue";

defineProps({
    settings: {
        required: true
    }
})

const showSettings = ref(false);

function toggle() {
    showSettings.value = !showSettings.value;
}

</script>