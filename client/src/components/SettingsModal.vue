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
                    <p>
                        <label class="checkbox">
                            <input v-model="settings.show.map" type="checkbox"> Map
                        </label>
                    </p>
                    <p>
                        <label class="checkbox">
                            <input v-model="settings.show.positions" type="checkbox"> Positions
                        </label>
                    </p>
                    <p>
                        <label class="checkbox">
                            <input v-model="settings.show.mapControls" type="checkbox"> Map controls
                        </label>
                    </p>
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