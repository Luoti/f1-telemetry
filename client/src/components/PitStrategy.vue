<template>
    <section>
        <h2 class="title is-2">Pit Strategy</h2>
        <div v-if="session.pitStop">
            <p>Lap
                <span class="has-text-primary">
                    {{ session.pitStop.windowIdealLap }}
                </span>
                - 
                <span class="has-text-primary">
                    {{ session.pitStop.windowLatestLap }}
                </span>
            </p>
            <p>
                Rejoin position: <span class="has-text-primary">{{ session.pitStop.rejoinPosition }}</span>
            </p>
            <p>
                Current tyres: <span v-if="cars[session.player1CarIndex]" class="has-text-primary">{{ cars[session.player1CarIndex].tyreAgeLaps }}</span> laps old
            </p>
        </div>
    </section>
</template>

<script setup>

defineProps({
    session: {
        required: true
    },
    cars: {
        required: true
    }
})

</script>