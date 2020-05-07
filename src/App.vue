<template>
    <v-app>
        <s-calendar />
    </v-app>
</template>

<script>
	import SCalendar from '@/components/SCalendar'

	export default {
		name: 'App',

		components: {SCalendar},

		mounted() {
		}
	}
</script>

<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
