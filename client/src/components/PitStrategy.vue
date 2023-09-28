<template>
    <section>
        <div v-if="session.pitStop">
            <p>Lap
                <span class="has-text-primary has-text-weight-bold">
                    {{ cars[session.player1CarIndex].lap }}
                </span>
                /
                <span class="has-text-primary has-text-weight-bold">
                    {{ session.pitStop.windowIdealLap }}
                </span>
                - 
                <span class="has-text-primary has-text-weight-bold">
                    {{ session.pitStop.windowLatestLap }}
                </span>
            </p>
            <p>
                Rejoin position: <span class="has-text-primary has-text-weight-bold">{{ session.pitStop.rejoinPosition }}</span>
            </p>
            <p>
                Current tyres: <span v-if="cars[session.player1CarIndex]" class="has-text-primary has-text-weight-bold">{{ cars[session.player1CarIndex].tyreAgeLaps }}</span> laps old
            </p>
        </div>
    </section>
</template>

<script setup>

defineProps({
    settings: {
        required: true
    },
    session: {
        required: true
    },
    cars: {
        required: true
    }
})

</script>

<style scoped>

section {
    font-size: 3em;
}

</style>