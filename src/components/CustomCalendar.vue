<template>
    <div>
        <s-calendar
            :custom-controls="customControls"
            :date-picker-event-color-for-date="datePickerEventColorForDate"
            :first-interval="6"
            :header-class="headerClass"
            :header-css="headerCss"
            :interval-count="14"
            :interval-minutes="15"
            :weekdays="[1, 2, 3, 4, 5, 6]"
            color="cyan"
            event-color="transparent"
            ref="calendar"
        >
            <template #context-menu="{time}">
                <v-card class="elevation-1">
                    <v-card-text>
                        {{time.date}}
                        {{time.time}}
                    </v-card-text>
                </v-card>
            </template>
            <template #event-title>
                <div>
                    <div class="text-truncate caption">Long header text on top</div>
                    <div>Long header text on middle</div>
                    <div>Long header text on bottom</div>
                </div>
            </template>
            <template #event-body="{event}">
                <div
                    :style="bodyStyle"
                    class="fill-height text-left pa-1 black--text"
                >
                    <div>{{event.start}}</div>
                    <div>{{event.end}}</div>
                    <div>Very large text, much larger than the events themselves even if calendar is fullscreen</div>
                    <div>For</div>
                    <div>Overflow</div>
                    <div>Checking</div>
                </div>
            </template>
            <template #event-menu="{event}">
                <v-card max-width="300">
                    <v-card-text>
                        <div v-text="event" />
                        <v-btn>Click</v-btn>
                    </v-card-text>
                </v-card>
            </template>
        </s-calendar>
    </div>
</template>

<script>
	import moment             from 'moment'
	import SCalendar          from './SCalendar'
	import colors             from 'vuetify/lib/util/colors'
	import SCalendarDayHeader from './SCalendarDayHeader'

	moment.locale('fr')

	export default {
		name: 'CustomCalendar',

		components: {
			SCalendarDayHeader,
			SCalendar
		},

		data: () => ({
			headerClass: () => ['pl-1'],
			headerCss: () => ({
				backgroundColor: colors.teal.lighten2,
				borderTopLeftRadius: '3px',
				borderTopRightRadius: '3px',
				border: `solid ${colors.teal.base} 1px`
			}),
			bodyStyle: {
				backgroundColor: colors.teal.lighten4,
				borderBottomLeftRadius: '3px',
				borderBottomRightRadius: '3px',
				border: `solid ${colors.teal.base} 1px`,
				borderTop: 'none'
			}
		}),

		computed: {
			customControls() {
				return [
					{
						icon: () => 'fa-eye',
						iconColor: (event) => {
							return event.showMenu ? 'white' : undefined
						},
						click: (event) => {
							event.showMenu = !event.showMenu
						}
					}
				]
			}
		},

		methods: {
			datePickerEventColorForDate() {
				return 'teal darken-1'
			}
		}
	}
</script>

<style scoped>

</style>
