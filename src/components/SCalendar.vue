<template>
    <v-sheet height="400">
        <div
            class="overflow-hidden"
            ref="s-calendar-controls"
        >
            <slot name="calendar-controls">
                <v-row
                    no-gutters
                    v-if="!noDefaultCalendarControls"
                >
                    <v-col>
                        <v-icon
                            @click="move(-1)"
                            size="20"
                            v-text="'fa-angle-left'"
                        />
                    </v-col>
                    <v-col>
                        <v-icon
                            @click="move(0)"
                            size="11"
                            v-text="'fa-circle'"
                        />
                    </v-col>
                    <v-col>
                        <v-icon
                            @click="move(1)"
                            size="20"
                            v-text="'fa-angle-right'"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-menu offset-y>
                            <template #activator="{on}">
                                <v-btn
                                    icon
                                    v-on="on"
                                >
                                    <v-icon
                                        size="20"
                                        v-text="'fa-calendar-day'"
                                    />
                                </v-btn>
                            </template>
                            <v-date-picker
                                :color="color"
                                :events="datePickerEvents"
                                next-icon="fa-angle-right"
                                no-title
                                prev-icon="fa-angle-left"
                                v-model="dateModel"
                            />
                        </v-menu>
                    </v-col>
                </v-row>
            </slot>
        </div>
        <v-calendar
            :end="end.format('YYYY-MM-DD')"
            :event-ripple="false"
            :events="containers"
            :first-interval="firstInterval"
            :interval-count="intervalCount"
            :interval-height="intervalHeight"
            :interval-minutes="intervalMinutes"
            :interval-width="intervalWidth"
            :short-intervals="false"
            :start="start.format('YYYY-MM-DD')"
            :weekdays="weekdays"
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
                <transition-group
                    :duration="{ leave: 0, enter: 0 }"
                    appear
                    name="s-calendar-events-transition"
                >
                    <div
                        :class="`s-calendar-event ${ghost === event ? '' : 's-calendar-events-transition-item'}`"
                        :key="event.index"
                        :ref="`event-${event.index}`"
                        :style="{ position: 'absolute', left: 0, right: 0, ...geometry(event), overflow: 'hidden', opacity: displayGhosts ? 0.5 : 1 }"
                        v-for="event in eventsOnDate(day.date)"
                        v-if="$refs.calendar"
                    >

                        <!-- OVERLAY -->
                        <v-overlay
                            :value="displayGhosts && (event.locked === true || (!droppable && eventsOnDate(day.date).includes(ghost)))"
                            absolute
                            color="error"
                        >
                            <v-expand-transition appear>
                                <div class="fill-height">
                                    <v-icon
                                        color="error"
                                        v-text="'fa-lock'"
                                    />
                                </div>
                            </v-expand-transition>
                        </v-overlay>

                        <!-- HEADER -->
                        <div
                            :class="`s-calendar-event-header ${eventColor} overflow-hidden`"
                            :style="{ height: `${intervalHeight - 3}px` }"
                        >
                            <v-row
                                :class="headerClass(event)"
                                :style="headerCss(event)"
                                no-gutters
                            >

                                <!-- TITLE -->
                                <v-col
                                    @mousedown="dragStart(event)"
                                    class="s-calendar-event-title overflow-hidden mr-2"
                                >
                                    <slot
                                        :event="event"
                                        name="event-title"
                                    />
                                </v-col>

                                <!-- CONTROLS -->
                                <v-col
                                    :key="controlIndex"
                                    class="s-calendar-event-controls"
                                    cols="auto"
                                    v-for="(control, controlIndex) in controls"
                                    v-if="!displayGhosts"
                                >
                                    <s-calendar-event-control
                                        :icon="control.icon(event)"
                                        :icon-color="control.iconColor ? control.iconColor(event) : undefined"
                                        :icon-disabled="control.iconDisabled ? control.iconDisabled(event) : undefined"
                                        :icon-size="controlsIconsSize"
                                        @click="(mouseEvent) => control.click(event, mouseEvent)"
                                    />
                                </v-col>

                            </v-row>
                        </div>

                        <!-- BODY -->
                        <div
                            :class="`s-calendar-event-body ${eventColor} overflow-hidden`"
                            :style="{ height: `${geometry(event).height.replace('px', '') - intervalHeight + 3}px` }"
                        >
                            <slot
                                :event="event"
                                name="event-body"
                            />
                        </div>

                        <!-- RESIZER TOP -->
                        <div
                            :style="{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', cursor: 'row-resize' }"
                            @mousedown="resize(event, 'top')"
                            class="s-calendar-event-resizer"
                            v-if="!event.locked"
                        />

                        <!-- RESIZER BOTTOM -->
                        <div
                            :style="{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', cursor: 'row-resize' }"
                            @mousedown="resize(event, 'bottom')"
                            class="s-calendar-event-resizer"
                            v-if="!event.locked"
                        />

                        <!-- MENU -->
                        <v-menu
                            :activator="ref(event)"
                            :close-on-content-click="false"
                            :left="day.weekday > 3"
                            :nudge-left="day.weekday > 3 ? 3 : 0"
                            :nudge-right="day.weekday <= 3 ? 3 : 0"
                            :open-on-click="false"
                            :right="day.weekday <= 3"
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
                </transition-group>
            </template>
            <template #interval="{date, time}">
                <div class="interval fill-height">
                    <div
                        :style="{ position: 'absolute', left: 0, width: '50%', opacity: 0.4 }"
                        @mouseenter="drag({date, time}, 'top')"
                        class="fill-height"
                    />
                    <div
                        :style="{ position: 'absolute', right: 0, width: '50%', opacity: 0.4 }"
                        @mouseenter="drag({date, time}, 'bottom')"
                        class="fill-height"
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
	import SCalendarEventControl from './SCalendarEventControl'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 's-calendar',

		components: {SCalendarEventControl},

		props: {
			noDefaultCalendarControls: {
				type: Boolean
			},
			weekdays: {
				type: Array,
				default: () => [1, 2, 3, 4, 5, 6, 0]
			},
			intervalWidth: {
				type: Number,
				default: 60
			},
			removableEvents: {
				type: Boolean,
				default: true
			},
			lockableEvents: {
				type: Boolean,
				default: true
			},
			customControls: {
				type: Array,
				default: () => []
			},
			color: {
				type: String,
				default: 'primary'
			},
			datePickerEventColorForDate: {
				type: Function,
				default: (_) => 'secondary'
			},
			eventColor: {
				type: String,
				default: 'primary'
			},
			firstInterval: {
				type: Number,
				default: 0
			},
			intervalCount: {
				type: Number,
				default: 24
			},
			intervalMinutes: {
				type: Number,
				default: 60
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
				default: (_) => ['primary']
			}
		},

		data: () => ({
			start: moment().startOf('week'),
			end: moment().endOf('week'),
			date: moment().format('YYYY-MM-DD'),
			dragging: {
				status: false,
				event: null
			},
			resizing: {
				status: false,
				event: null,
				slot: null
			},
			droppable: true,
			events: [
				{
					index: 0,
					start: '2020-05-16 02:15',
					end: '2020-05-16 03:15',
					showMenu: false
				},
				{
					index: 1,
					start: '2020-05-12 03:30',
					end: '2020-05-12 04:45',
					showMenu: false
				},
				{
					index: 2,
					start: '2020-05-14 10:15',
					end: '2020-05-14 10:45',
					showMenu: false
				},
				{
					index: 3,
					start: '2020-05-11 02:00',
					end: '2020-05-11 03:30',
					showMenu: false
				},
				{
					index: 4,
					start: '2020-05-13 03:30',
					end: '2020-05-13 04:30',
					showMenu: false
				},
				{
					index: 5,
					start: '2020-05-12 01:30',
					end: '2020-05-12 01:45',
					showMenu: false
				},
				{
					index: 6,
					start: '2020-05-19 02:00',
					end: '2020-05-19 02:45',
					showMenu: false
				},
				{
					index: 7,
					start: '2020-05-20 03:00',
					end: '2020-05-20 03:45',
					showMenu: false
				},
				{
					index: 8,
					start: '2020-05-05 02:00',
					end: '2020-05-05 04:45',
					showMenu: false
				},
				{
					index: 9,
					start: '2020-05-05 01:30',
					end: '2020-05-05 02:00',
					showMenu: false
				}
			]
		}),

		mounted() {
			$(this.$refs['s-calendar-controls']).appendTo('.v-calendar-daily__intervals-head')
			const self = this
			$('.interval').css({
				position: 'relative',
				zIndex: 0
			})
			$(document).mouseup(function () {
				self.dragging.status = false
				self.resizing.status = false
				self.dragging.event = null
				self.resizing.event = null
				$('.interval').css({zIndex: 0})
			})
		},

		watch: {
			displayGhosts(displayGhosts) {
				if (displayGhosts) {
					this.events.forEach(e => {
						this.$set(e, 'showMenu', false)
						this.$set(e, 'tmpGhost', this.clone(e))
						this.$set(e, 'ghost', this.clone(e))
					})
					$('.interval').css({
						position: 'relative',
						zIndex: 1
					})
					// $('.s-calendar-event').css({ position: 'absolute', zIndex: 0})
				} else {
					if (this.droppable) {
						this.events.forEach(e => {
							e.start = e.ghost.start
							e.end = e.ghost.end
						})
					}
					this.droppable = true
				}
			}
		},

		computed: {
			dateModel: {
				get() {
					return this.date
				},
				set(date) {
					this.start = moment(date).startOf('week')
					this.end = moment(date).endOf('week')
					this.date = date
				}
			},
			containers() {
				return Array.from(moment.range(this.start, this.end).by('day'), (day => ({
					start: day.format('YYYY-MM-DD 00:00'),
					end: day.format('YYYY-MM-DD 24:00')
				})))
			},
			controls() {
				return [
					this.customControls,
					this.lockableEvents ? [
						{
							icon: (event) => {
								return event.locked ? 'fa-lock' : 'fa-lock-open'
							},
							iconColor: (event) => {
								return event.locked ? 'error' : undefined
							},
							click: (event) => {
								this.toggleLock(event)
							}
						}
					] : [],
					this.removableEvents ? [
						{
							icon: () => 'fa-times',
							iconDisabled: (event) => {
								return event.locked
							},
							click: (event) => {
								this.remove(event)
							}
						}
					] : []
				].flat()
			},
			controlsIconsSize() {
				return this.intervalHeight / 2
			},
			displayGhosts() {
				return this.dragging.status || this.resizing.status
			},
			ghost() {
				return (this.dragging.status && this.dragging.event.ghost) || (this.resizing.status && this.resizing.event.ghost)
			},
			ghosts() {
				return this.events.map(event => event.ghost)
			},
			tmpGhosts() {
				return this.events.map(event => event.tmpGhost)
			},
			forbiddenRanges() {
				return [...moment.range(this.start, this.end).by('day')].map(day => [
					moment.range(moment(day.format('YYYY-MM-DD 00:00')), moment(day.format('YYYY-MM-DD 00:00')).add({minutes: this.firstInterval * this.intervalMinutes})),
					moment.range(moment(day.format('YYYY-MM-DD 00:00')).add({minutes: (this.intervalCount + this.firstInterval) * this.intervalMinutes}), moment(day.format('YYYY-MM-DD 24:00')))
				]).flat()
			}
		},

		methods: {
			move(amount) {
				if (amount === 0) {
					this.start = moment().startOf('week')
					this.end = moment().endOf('week')
					this.date = moment().format('YYYY-MM-DD')
				} else {
					this.start = moment(this.start).add({week: amount})
					this.end = moment(this.end).add({week: amount})
					this.date = this.start.format('YYYY-MM-DD')
				}
			},
			datePickerEvents(date) {
				return this.eventsOnDate(date).length ? this.datePickerEventColorForDate(date) : false
			},
			eventsOnDate(date) {
				return (this.displayGhosts ? this.ghosts : this.events).filter(event => moment(event.start).format('YYYY-MM-DD') === date)
			},
			geometry(event) {
				const top = this.$refs.calendar.timeToY(moment(event.start).format('HH:mm')) + 1
				const height = this.$refs.calendar.timeToY(moment(event.end).format('HH:mm')) - top - 2
				return {
					top: `${top}px`,
					height: `${height}px`
				}
			},
			dragStart(event) {
				if (!event.locked) {
					this.dragging.status = true
					this.dragging.event = event
				}
			},
			drag({date, time}, slot) {
				if (this.displayGhosts) {
					let start, end, event
					if (this.dragging.status) {
						event = this.dragging.event
						const duration = moment.range(moment(event.ghost.start), moment(event.ghost.end)).duration()
						start = `${date} ${time}`
						end = moment(`${date} ${time}`).add(duration).format('YYYY-MM-DD HH:mm')
					} else if (this.resizing.status) {
						event = this.resizing.event
						if (this.resizing.slot === 'top') {
							start = `${moment(event.ghost.start).format('YYYY-MM-DD')} ${time}`
							end = this.resizing.event.end
						} else {
							start = this.resizing.event.start
							end = moment(`${moment(event.ghost.end).format('YYYY-MM-DD')} ${time}`).add({minutes: this.intervalMinutes}).format('YYYY-MM-DD HH:mm')
						}
					}
					if (moment(end).isAfter(moment(start))) {
						this.events.forEach(e => e.ghost = {...e.tmpGhost})
						event.ghost = {
							...this.clone(event),
							start,
							end
						}
						if (this.overlapsForbiddenRange(event.ghost)) {
							this.droppable = false
						} else {
							this.droppable = true
							this.schedule(event.ghost, slot)
						}
					}
				}
			},
			schedule(ghost, slot) {
				const before = []
				const after = []
				// Gathering tmpGhosts before, same or after and overlapping before, same or after the ghost
				this.tmpGhosts.filter(g => g.index !== ghost.index && moment(g.start).isSame(moment(ghost.start), 'day')).forEach(g => {
					if (moment(g.start).isBefore(moment(ghost.start))) {
						before.push(g)
					} else if (moment(g.start).isSame(moment(ghost.start))) {
						if (slot === 'left') {
							before.push(g)
						} else {
							after.push(g)
						}
					} else {
						after.push(g)
					}
				})
				// Sorting gathered tmpGhosts
				before.sort((first, second) => {
					return moment(first.start).isBefore(moment(second.start)) ? 1 : moment(first.start).isSame(moment(second.start)) ? 0 : -1
				})
				after.sort((first, second) => {
					return moment(first.start).isAfter(moment(second.start)) ? 1 : moment(first.start).isSame(moment(second.start)) ? 0 : -1
				})
				// Scheduling
				if (before.length) {
					const previous = before.shift()
					this._scheduleBefore(ghost, previous, before)
				}
				if (after.length) {
					const next = after.shift()
					this._scheduleAfter(ghost, next, after)
				}
			},
			_scheduleBefore(after, before, remaining) {
				if (moment(after.start).isBefore(moment(before.end))) {
					const diff = moment.duration(moment(before.end).diff(moment(after.start)))
					const ghost = this.ghosts.find(ghost => ghost.index === before.index)
					if (ghost.locked || this.overlapsForbiddenRange({
						start: moment(ghost.start).subtract(diff).format('YYYY-MM-DD HH:mm'),
						end: moment(ghost.end).subtract(diff).format('YYYY-MM-DD HH:mm')
					})) {
						this.droppable = false
					} else {
						ghost.start = moment(ghost.start).subtract(diff).format('YYYY-MM-DD HH:mm')
						ghost.end = moment(ghost.end).subtract(diff).format('YYYY-MM-DD HH:mm')
					}
					if (remaining.length) {
						this._scheduleBefore(ghost, remaining.shift(), remaining)
					}
				}
			},
			_scheduleAfter(before, after, remaining) {
				if (moment(before.end).isAfter(moment(after.start))) {
					const diff = moment.duration(moment(before.end).diff(moment(after.start)))
					const ghost = this.ghosts.find(ghost => ghost.index === after.index)
					if (ghost.locked || this.overlapsForbiddenRange({
						start: moment(ghost.start).add(diff).format('YYYY-MM-DD HH:mm'),
						end: moment(ghost.end).add(diff).format('YYYY-MM-DD HH:mm')
					})) {
						this.droppable = false
					} else {
						ghost.start = moment(ghost.start).add(diff).format('YYYY-MM-DD HH:mm')
						ghost.end = moment(ghost.end).add(diff).format('YYYY-MM-DD HH:mm')
					}
					if (remaining.length) {
						this._scheduleAfter(ghost, remaining.shift(), remaining)
					}
				}
			},
			resize(event, slot) {
				this.resizing.status = true
				this.resizing.event = event
				this.resizing.slot = slot
			},
			toggleLock(event) {
				this.$set(event, 'locked', !event.locked)
			},
			remove(event) {
				this.events = this.events.filter(e => e !== event)
			},
			overlapsForbiddenRange(event) {
				return this.forbiddenRanges.some(forbiddenPeriod => moment.range(moment(event.start), moment(event.end)).overlaps(forbiddenPeriod))
			},
			clone(event) {
				const {ghost, tmpGhost, ...clone} = event
				return clone
			},
			ref(event) {
				const ref = this.$refs[`event-${event.index}`]
				return ref ? ref[0] : null
			}
		}

	}
</script>

<style>
    @import '~vuetify/dist/vuetify.css';

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

    /*noinspection CssUnusedSymbol*/
    .s-calendar-events-transition-item {
        transition: transform 500ms ease;
    }
</style>
