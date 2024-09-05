import axios from 'axios';
import {doLogout, getCookie} from "./auth.ts";
import router from "../router";

let baseURL = ''
if (process.env.IS_ELECTRON) {
    if (process.env.NODE_ENV === 'production') {
        baseURL = process.env.VUE_APP_ELECTRON_API_URL
    } else {
        baseURL = process.env.VUE_APP_ELECTRON_API_URL_DEV
    }
} else {
    baseURL = process.env.VUE_APP_NETEASE_API_URL
}

export const service = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000
})

service.interceptors.request.use((config: AxiosRequestConfig) => {
    if (!config.params) config.params = {}
    if (baseURL.length) {
        if (baseURL[0] !== '/' && !process.env.IS_ELECTRON && getCookie('MUSIC_U') !== null) {
            config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`
        }
    } else {
        console.error("You must set up the baseURL in the service's config");
    }
    if (!process.env.IS_ELECTRON && !config.url?.includes('/login')) {
        config.params.realIP = '127.0.0.1'
    }
    if (process.env.VUE_APP_REAL_IP) {
        config.params.realIP = process.env.VUE_APP_REAL_IP
    }

    const settings = JSON.parse(localStorage.getItem('settings') || '{}')
    const proxy = settings.proxyConfig
    if (['HTTP', 'HTTPS'].includes(proxy?.protocol)) {
        config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`
    }

    return config
});


service.interceptors.response.use((response: AxiosResponse) => {
        return response.data
    },
    async (error: any) => {
        let response: AxiosResponse | null
        let data: any

        if (error === 'TypeError: baseURL is undefined') {
            response = error
            data = error
            console.error("You must set up the baseURL in the service's config");
        } else if (error.response) {
            response = error.response
            data = response.data
        }

        if (response && typeof data === 'object' && data.code === 301 && data.msg === '需要登录') {
            console.warn('Token has expired. Logout now!');

            doLogout()

            if (process.env.IS_ELECTRON) {
                await router.push({name: 'loginAccount'})
            } else {
                await router.push({name: 'login'})
            }
        }

        return Promise.reject(error)
    }
)
