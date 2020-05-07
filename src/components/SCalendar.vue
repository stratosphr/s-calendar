<template>
    <v-sheet height="350">
        <v-calendar
            :end="end.format('YYYY-MM-DD')"
            :event-ripple="false"
            :events="containers"
            :first-interval="6"
            :interval-count="24 * 4 - 6"
            :interval-height="20"
            :interval-minutes="15"
            :short-intervals="false"
            :start="start.format('YYYY-MM-DD')"
            :weekdays="[1, 2, 3, 4, 5, 6]"
            event-color="transparent"
            type="week"
        >
            <template #day-label-header="props">
                <slot
                    name="day-header"
                    v-bind="props"
                />
            </template>
            <template #event="{event}">
                <div
                    :style="{position: 'relative'}"
                    class="red"
                >
                    <div>
                        Hello
                    </div>
                    <div>
                        World
                    </div>
                </div>
            </template>
        </v-calendar>
    </v-sheet>
</template>

<script>
	import Moment           from 'moment'
	import { extendMoment } from 'moment-range'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 's-calendar',

		data: () => ({
			start: moment().startOf('week'),
			end: moment().endOf('week')
		}),

		mounted() {
		},

		computed: {
			containers() {
				return Array.from(moment.range(this.start, this.end).by('day'), (day => ({
					start: day.format('YYYY-MM-DD 00:00'),
					end: day.format('YYYY-MM-DD 24:00')
				})))
			}
		}

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
