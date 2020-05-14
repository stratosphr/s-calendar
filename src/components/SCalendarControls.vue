<template>
    <v-row no-gutters>
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
            <v-menu
                :close-on-click="false"
                :close-on-content-click="false"
                offset-y
                v-model="showDatePicker"
            >
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
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'SCalendarControls',

		data: () => ({
			value: moment().format('YYYY-MM-DD'),
			showDatePicker: false
		}),

		props: {
			color: {
				type: String,
				default: 'primary'
			},
			datePickerEventColorForDate: {
				type: Function,
				default: (_) => 'primary lighten-3'
			},
			datePickerEvents: {
				type: Function,
				default: (_) => false
			}
		},

		computed: {
			dateModel: {
				get() {
					return this.value
				},
				set(date) {
					this.value = date
					this.showDatePicker = false
					this.$emit('input', this.value)
				}
			}
		},

		methods: {
			move(amount) {
				if (amount === 0) {
					this.dateModel = moment().format('YYYY-MM-DD')
				} else {
					this.dateModel = moment(this.dateModel).add({week: amount}).startOf('week').format('YYYY-MM-DD')
				}
			}
		}
	}
</script>

<style scoped>

</style>
