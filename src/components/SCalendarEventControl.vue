<template>
    <v-icon
        :color="iconColor"
        :disabled="iconDisabled"
        :size="iconSize"
        :style="{ marginTop: '-1px' }"
        @click="mouseEvent => $emit('click', mouseEvent)"
        left
        v-text="icon"
    />
</template>

<script>
	export default {
		name: 'SCalendarEventControl',

		props: {
			icon: {
				type: String,
				required: true
			},
			iconColor: {
				type: String
			},
			iconDisabled: {
				type: Boolean
			},
			iconSize: {
				type: Number,
				default: 20
			}
		}
	}
</script>

<style scoped>

</style>
