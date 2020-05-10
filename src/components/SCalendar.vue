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
            ref="calendar"
            type="week"
        >
            <template #day-label-header="props">
                <slot
                    name="day-header"
                    v-bind="props"
                />
            </template>
            <template #event="{day}">
                <div
                    :class="`event`"
                    :key="eventIndex"
                    :style="{ position: 'absolute', left: 0, right: 0, ...geometry(event), overflow: 'hidden', opacity: displayGhosts ? 0.5 : 1 }"
                    @mousedown="onMouseDownEvent(event)"
                    v-for="(event, eventIndex) in eventsOnDate(day.date)"
                    v-if="$refs.calendar"
                >
                    <div
                        :class="`s-calendar-event-header ${eventColor} overflow-hidden`"
                        :style="{ height: `${headerHeight - 3}px` }"
                    >
                        <slot name="event-header" />
                    </div>
                    <div
                        :class="`s-calendar-event-body ${eventColor} overflow-hidden`"
                        :style="{ height: `${geometry(event).height.replace('px', '') - headerHeight + 3}px` }"
                    >
                        <slot name="event-body" />
                    </div>
                </div>
            </template>
            <template #interval="{date, time}">
                <div class="interval fill-height">
                    <div
                        :style="{ height: '50%' }"
                        @mouseenter="onMouseEnterInterval({date, time}, 'top')"
                        class="red"
                    />
                    <div
                        :style="{ height: '50%' }"
                        @mouseenter="onMouseEnterInterval({date, time}, 'bottom')"
                        class="blue"
                    />
                </div>
            </template>
        </v-calendar>
    </v-sheet>
</template>

<script>
	import Moment           from 'moment'
	import { extendMoment } from 'moment-range'
	import $                from 'jquery'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 's-calendar',

		props: {
			eventColor: {
				type: String,
				default: 'primary'
			},
			headerHeight: {
				type: Number,
				default: 20
			}
		},

		data: () => ({
			start: moment().startOf('week'),
			end: moment().endOf('week'),
			dragging: {
				status: false,
				event: null
			},
			events: [
				{
					start: '2020-05-09 02:10',
					end: '2020-05-09 03:12'
				},
				{
					start: '2020-05-06 03:23',
					end: '2020-05-06 04:47'
				},
				{
					start: '2020-05-07 10:22',
					end: '2020-05-07 10:45'
				},
				{
					start: '2020-05-05 02:00',
					end: '2020-05-05 03:30'
				},
				{
					start: '2020-05-05 03:30',
					end: '2020-05-05 04:30'
				},
				{
					start: '2020-05-05 01:30',
					end: '2020-05-05 01:45'
				}
			]
		}),

		mounted() {
			const self = this
			$('*').css({cursor: 'default'})
			$('.interval').css({
				position: 'relative',
				zIndex: 0
			})
			$(document).mouseup(function () {
				$('*').css({cursor: 'default'})
				$('.interval').css({zIndex: 0})
				self.dragging.status = false
				self.dragging.event = null
			})
		},

		computed: {
			containers() {
				return Array.from(moment.range(this.start, this.end).by('day'), (day => ({
					start: day.format('YYYY-MM-DD 00:00'),
					end: day.format('YYYY-MM-DD 24:00')
				})))
			},
			displayGhosts() {
				return this.dragging.status
			}
		},

		methods: {
			eventsOnDate(date) {
				return this.events.filter(event => moment(event.start).format('YYYY-MM-DD') === date)
			},
			geometry(event) {
				const top = this.$refs.calendar.timeToY(moment(event.start).format('HH:mm')) + 1
				const height = this.$refs.calendar.timeToY(moment(event.end).format('HH:mm')) - top - 2
				return {
					top: `${top}px`,
					height: `${height}px`
				}
			},
			onMouseDownEvent(event) {
				$('*').css({cursor: 'grabbing'})
				$('.interval').css({zIndex: 1})
				this.dragging.status = true
				this.dragging.event = event
			},
			onMouseEnterInterval({date, time}, slot) {
				const duration = moment.range(moment(this.dragging.event.start), moment(this.dragging.event.end)).duration()
				this.dragging.event.start = `${date} ${time}`
				this.dragging.event.end = moment(this.dragging.event.start).add(duration)
			}
		}

	}
</script>

<style>
    /*noinspection CssUnusedSymbol*/
    .v-calendar {
        user-select: none;
    }

    /*noinspection CssUnusedSymbol*/
    .v-calendar-daily__day {
        margin-top: -1px;
    }

    /*noinspection CssUnusedSymbol*/
    .v-calendar-daily__intervals-body {
        margin-top: -1px;
    }

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

    .s-calendar-event-body > * {
        height: 100% !important;
    }

    .s-calendar-event-header > * {
        height: 100% !important;
    }
</style>
