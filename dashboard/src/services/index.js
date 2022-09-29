import axios from "axios";
import router from '../router'
import { setGlobalLoading } from "@/store/global";
import AuthService from './auth'
import UsersService from './users'
import FeedbacksServices from './feedbacks'

const API_ENVS = {
    production: 'https://backend-treinamento-vue3-ten.vercel.app/',
    development: '',
    local: 'http://localhost:3000'
}

const httpClient = axios.create({
    baseURL: API_ENVS[process.env.NODE_ENV] ?? API_ENVS.local
})

httpClient.interceptors.request.use(config => {
    setGlobalLoading(true)
    const token = window.localStorage.getItem('token')

    if(token) {
        config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
})

httpClient.interceptors.response.use((response) => {
    setGlobalLoading(false)
    return response
}, (error) => {
    
    if(error.response.status === 401) {
        router.push({ name: 'Home' })
    }
    
    const canThrowAnError = error.request.status === 0 || error.request.status === 500

    if(!canThrowAnError) {
        throw error.response.status
        setGlobalLoading(false)
    }

    setGlobalLoading(false)
    return error
})

export default {
    auth: AuthService(httpClient),
    users: UsersService(httpClient),
    feedbacks: FeedbacksServices(httpClient)
}