import axios from 'axios'

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

export default http
