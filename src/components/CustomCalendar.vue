<template>
    <s-calendar>
        <template #day-header="{date}">
            <div class="text-capitalize text-truncate caption px-1">
                {{ formattedDate(date) }}
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
