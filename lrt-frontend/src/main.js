import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { useSettingsStore } from '@/shared/stores/settings'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

// hier deine globalen Styles
import '@/assets/main.css'

import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)

const { useAuthStore } = await import('./shared/stores/auth')
const { useUserStore } = await import('./shared/stores/user')

const auth = useAuthStore()
auth.init()

const userStore = useUserStore()
if (auth.token && !auth.user) {
    await auth.fetchUser()
}

app.use(router)
app.mount('#app')

// einmalig Settings laden (kein _loaded-Guard mehr!)
useSettingsStore().fetch()
