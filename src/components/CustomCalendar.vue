<template>
    <s-calendar event-color="transparent">
        <template #day-header="{date}">
            <div class="text-capitalize text-truncate caption px-1">
                {{ formattedDate(date) }}
            </div>
        </template>
        <template #event-header>
            <div
                :style="{ borderTopLeftRadius: '3px', borderTopRightRadius: '3px' }"
                class="black--text teal lighten-2 fill-height"
            >
                <div>Long header text on top</div>
                <div>Long header text on middle</div>
                <div>Long header text on bottom</div>
            </div>
        </template>
        <template #event-body>
            <div
                :style="{ borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' }"
                class="black--text info lighten-2 fill-height"
            >
                <div>Tall</div>
                <div>And</div>
                <div>Large debug text</div>
                <div>For</div>
                <div>Overflow</div>
                <div>Checking</div>
            </div>
        </template>
    </s-calendar>
</template>

<script>
	import moment    from 'moment'
	import SCalendar from '@/components/SCalendar'

	moment.locale('fr')

	export default {
		name: 'CustomCalendar',

		components: {SCalendar},

		methods: {
			formattedDate(date) {
				return moment(date).format('dddd\xa0-\xa0DD\xa0MMM\xa0YYYY')
			}
		}
	}
</script>

<style scoped>

</style>
