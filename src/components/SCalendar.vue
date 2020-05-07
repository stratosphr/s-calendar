<template>
    <v-sheet height="350">
        <v-calendar
            :weekdays="[1, 2, 3, 4, 5, 6]"
            type="week"
        >

        </v-calendar>
    </v-sheet>
</template>

<script>
	export default {
		name: 's-calendar'
	}
</script>

<style>
    /*noinspection CssUnusedSymbol*/
    .v-calendar-daily_head-weekday {
        display: none;
    }

    /*noinspection CssUnusedSymbol*/
    .v-calendar-daily_head-day-label {
        padding: 0 !important;
    }

    /*noinspection CssUnusedSymbol*/
    .v-event-timed-container {
        margin: 0 !important;
    }

    /*noinspection CssUnusedSymbol*/
    *.v-event-timed {
        padding: 0 !important;
        border: 0 solid !important;
        cursor: default !important;
        border-radius: 0 !important;
    }
</style>
