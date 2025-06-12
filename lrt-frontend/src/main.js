import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)

app.use(router)

// 👇 Async Bootstrapping: auth + user laden vor Mount
;(async () => {
    const auth = useAuthStore()
    auth.init()

    const userStore = useUserStore()
    if (auth.token && !userStore.user) {
        await userStore.fetchUser()
    }

    app.mount('#app')
})()
