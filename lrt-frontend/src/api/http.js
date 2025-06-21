import axios from 'axios'
import {useAuthStore} from "@/stores/auth.js";
import {useToastStore} from "@/stores/toast.js";

const http = axios.create({
    baseURL: 'http://localhost:3000/api'
})

// Token für JEDEN Request aus dem localStorage holen (auch nach Login/Logout)
http.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    } else {
        delete config.headers['Authorization']
    }
    return config
})

http.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            useAuthStore().logout() // oder: router.push('/login')
            useToastStore().show('Nicht eingeloggt! Bitte neu anmelden.', 'danger')
        }
        return Promise.reject(error)
    }
)

export default http
