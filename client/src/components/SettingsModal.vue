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
                        <label class="label">Server address (default localhost)</label>
                        <div class="control">
                            <input v-model="settings.websocketHost" class="input" type="text" placeholder="Default: localhost:3000">
                        </div>
                    </div>
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
                        <div class="control">
                            <label class="checkbox">
                            <input v-model="settings.show.positionsTyrecompound" type="checkbox"> Positions / Tyre
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
                    <div class="field columns">
                        <div class="column">
                            <label class="label">Player 1 abbreviation</label>
                            <div class="control">
                                <input v-model="settings.player1Abbreviation" class="input is-uppercase" type="text">
                            </div>
                        </div>
                        <div class="column">
                            <label class="label">Player 1 Color</label>
                            <div class="control">
                                <input v-model="settings.player1Color" class="input is-uppercase" type="text">
                            </div>
                        </div>
                    </div>
                    <div class="field columns">
                        <div class="column">
                            <label class="label">Player 2 abbreviation</label>
                            <div class="control">
                                <input v-model="settings.player2Abbreviation" class="input is-uppercase" type="text">
                            </div>
                        </div>
                        <div class="column">
                            <label class="label">Player 2 Color</label>
                            <div class="control">
                                <input v-model="settings.player2Color" class="input is-uppercase" type="text">
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="toggle">Close</button>
                    <p>Settings are autosaved</p>
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