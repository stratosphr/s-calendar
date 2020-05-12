<template>
    <v-sheet height="350">
        <v-calendar
            :end="end.format('YYYY-MM-DD')"
            :event-ripple="false"
            :events="containers"
            :first-interval="6"
            :interval-count="24 * 4 - 6"
            :interval-height="intervalHeight"
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
                    :key="event.index"
                    :ref="`event-${event.index}`"
                    :style="{ position: 'absolute', left: 0, right: 0, ...geometry(event), overflow: 'hidden', opacity: displayGhosts ? 0.5 : 1 }"
                    class="s-calendar-event"
                    v-for="event in eventsOnDate(day.date)"
                    v-if="$refs.calendar"
                >
                    <div
                        :class="`s-calendar-event-header ${eventColor} overflow-hidden`"
                        :style="{ height: `${intervalHeight - 3}px` }"
                    >
                        <v-row
                            :class="headerClass(event)"
                            :style="headerCss(event)"
                            no-gutters
                        >
                            <v-col
                                @mousedown="onMouseDownEvent(event)"
                                class="s-calendar-event-title overflow-hidden mr-2"
                            >
                                <slot name="event-title" />
                            </v-col>
                            <v-col
                                :key="controlIndex"
                                class="s-calendar-event-controls"
                                cols="auto"
                                v-for="(control, controlIndex) in controls"
                            >
                                <s-calendar-event-control
                                    :icon="control.icon"
                                    :icon-size="controlsIconsSize"
                                    @click="(mouseEvent) => control.click(event, mouseEvent)"
                                />
                            </v-col>
                        </v-row>
                    </div>
                    <div
                        :class="`s-calendar-event-body ${eventColor} overflow-hidden`"
                        :style="{ height: `${geometry(event).height.replace('px', '') - intervalHeight + 3}px` }"
                    >
                        <slot name="event-body" />
                    </div>
                    <v-menu
                        :activator="ref(event)"
                        :left="day.weekday > 3"
                        :nudge-left="day.weekday > 3 ? 3 : 0"
                        :nudge-right="day.weekday <= 3 ? 3 : 0"
                        :open-on-click="false"
                        :right="day.weekday <= 3"
                        allow-overflow
                        offset-overflow
                        offset-x
                        v-if="$scopedSlots['event-menu']"
                        v-model="event.showMenu"
                    >
                        <slot
                            :event="event"
                            name="event-menu"
                        />
                    </v-menu>
                </div>
            </template>
            <template #interval="{date, time}">
                <div class="interval fill-height">
                    <div
                        :style="{ height: '50%' }"
                        @mouseenter="onMouseEnterInterval({date, time}, 'top')"
                    />
                    <div
                        :style="{ height: '50%' }"
                        @mouseenter="onMouseEnterInterval({date, time}, 'bottom')"
                    />
                </div>
            </template>
        </v-calendar>
    </v-sheet>
</template>

<script>
	import Moment                from 'moment'
	import { extendMoment }      from 'moment-range'
	import $                     from 'jquery'
	import SCalendarEventControl from '@/components/SCalendarEventControl'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 's-calendar',

		components: {SCalendarEventControl},

		props: {
			customControls: {
				type: Array,
				default: () => []
			},
			eventColor: {
				type: String,
				default: 'primary'
			},
			intervalHeight: {
				type: Number,
				default: 23
			},
			headerCss: {
				type: Function,
				default: (_) => undefined
			},
			headerClass: {
				type: Function,
				default: (_) => (['primary'])
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
					index: 0,
					start: '2020-05-16 02:10',
					end: '2020-05-16 03:12'
				},
				{
					index: 1,
					start: '2020-05-12 03:23',
					end: '2020-05-12 04:47'
				},
				{
					index: 2,
					start: '2020-05-14 10:22',
					end: '2020-05-14 10:45'
				},
				{
					index: 3,
					start: '2020-05-11 02:00',
					end: '2020-05-11 03:30'
				},
				{
					index: 4,
					start: '2020-05-13 03:30',
					end: '2020-05-13 04:30'
				},
				{
					index: 5,
					start: '2020-05-12 01:30',
					end: '2020-05-12 01:45'
				}
			]
		}),

		mounted() {
			const self = this
			$('.interval').css({
				position: 'relative',
				zIndex: 0
			})
			$(document).mouseup(function () {
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
			controls() {
				return [
					...this.customControls,
					{
						icon: 'fa-lock-open',
						click: (event) => {
							this.toggleLock(event)
						}
					},
					{
						icon: 'fa-times',
						click: (event) => {
							this.remove(event)
						}
					}
				]
			},
			controlsIconsSize() {
				return this.intervalHeight / 2
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
				$('.interval').css({zIndex: 1})
				this.events.forEach(e => this.$set(e, 'showMenu', false))
				this.dragging.status = true
				this.dragging.event = event
			},
			onMouseEnterInterval({date, time}, slot) {
				const duration = moment.range(moment(this.dragging.event.start), moment(this.dragging.event.end)).duration()
				this.dragging.event.start = `${date} ${time}`
				this.dragging.event.end = moment(this.dragging.event.start).add(duration).format('YYYY-MM-DD HH:mm')
			},
			toggleLock(event) {
				this.$set(event, 'locked', !event.locked)
			},
			remove(event) {
				this.events = this.events.filter(e => e !== event)
			},
			ref(event) {
				const ref = this.$refs[`event-${event.index}`]
				return ref ? ref[0] : null
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
        cursor: default !important;
        border: 0 solid !important;
        border-radius: 0 !important;
    }

    .s-calendar-event-body > * {
        height: 100% !important;
    }

    .s-calendar-event-header > * {
        height: 100% !important;
    }
</style>
