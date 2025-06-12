import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)

const { useAuthStore } = await import('./stores/auth')
const { useUserStore } = await import('./stores/user')

const auth = useAuthStore()
auth.init()

const userStore = useUserStore()
if (auth.token && !auth.user) {
    await auth.fetchUser()
}

app.use(router)
app.mount('#app')
