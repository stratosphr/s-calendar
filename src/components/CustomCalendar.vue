<template>
    <s-calendar
        :header-class="headerClass"
        :header-css="headerCss"
        event-color="transparent"
    >
        <template #day-header="{date}">
            <div class="text-capitalize text-truncate caption px-1">
                {{ formattedDate(date) }}
            </div>
        </template>
        <template #event-title>
            <div>
                <div class="text-truncate caption">Long header text on top</div>
                <div>Long header text on middle</div>
                <div>Long header text on bottom</div>
            </div>
        </template>
        <template #event-body>
            <div
                :style="bodyStyle"
                class="fill-height text-left pa-1 black--text"
            >
                <div>Tall</div>
                <div>And</div>
                <div>Very large text, much larger than the events themselves even if calendar is fullscreen</div>
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
	import colors    from 'vuetify/lib/util/colors'

	moment.locale('fr')

	export default {
		name: 'CustomCalendar',

		components: {SCalendar},

		data: () => ({
			headerClass: () => ['pl-1'],
			headerCss: () => ({
				backgroundColor: colors.teal.lighten2,
				borderTopLeftRadius: '3px',
				borderTopRightRadius: '3px',
				border: `solid ${colors.teal.base} thin`
			}),
			bodyStyle: {
				backgroundColor: colors.teal.lighten4,
				borderBottomLeftRadius: '3px',
				borderBottomRightRadius: '3px',
				border: `solid ${colors.teal.base} 1px`,
				borderTop: 'none'
			}
		}),

		methods: {
			formattedDate(date) {
				return moment(date).format('dddd\xa0-\xa0DD\xa0MMM\xa0YYYY')
			}
		}
	}
</script>

<style scoped>

</style>
