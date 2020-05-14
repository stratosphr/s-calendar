<template>
    <v-row
        :class="`text-capitalize caption ${present ? `${color}--text font-weight-bold` : ''}`"
        align="center"
        justify="center"
        no-gutters
    >
        <v-col cols="auto">
            {{formattedDay}}
        </v-col>
        <v-col
            class="hidden-sm-and-down"
            cols="auto"
        >
            <span v-text="'\xa0-\xa0'" />
        </v-col>
        <v-col
            cols="12"
            md="auto"
        >
            <span v-text="formattedDate" />
        </v-col>
    </v-row>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'SCalendarDayHeader',

		props: {
			color: {
				type: String,
				default: 'primary'
			},
			date: {
				type: String,
				required: true
			},
			present: {
				type: Boolean,
				required: true
			}
		},

		computed: {
			formattedDay() {
				return moment(this.date).format('dddd')
			},
			formattedDate() {
				return moment(this.date).format('DD\xa0MMM\xa0YYYY')
			}
		}
	}
</script>

<style scoped>

</style>
