<template>
    <s-calendar>
        <template #day-header="{date}">
            {{date}}
        </template>
    </s-calendar>
</template>

<script>
	import SCalendar from '@/components/SCalendar'

	export default {
		name: 'CustomCalendar',
		components: {SCalendar}
	}
</script>

<style scoped>

</style>
