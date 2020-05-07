import Vue     from 'vue'
import App     from './App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.'
Vue.config.warnHandler = function (msg, vm, trace) {
	if (msg !== ignoreWarnMessage) {
		console.error(msg, trace)
	}
}

new Vue({
	vuetify,
	render: h => h(App)
}).$mount('#app')
