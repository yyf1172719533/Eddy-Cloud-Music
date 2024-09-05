import Cookies from 'js-cookie'
import store from '@/store'
import { logout } from '@/utils/auth'

export const getCookie = (key: string): string | undefined => {
    return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`)
}

export const setCookies = (cookiesString: string) => {
    const cookies = cookiesString.split(';;')
    cookies.forEach((cookie) => {
        document.cookie = cookie
        const cookieKeyVal = cookie.split(';')[0].split('=')
        localStorage.setItem(`cookie-${cookieKeyVal[0]}`, cookieKeyVal[1])
    })
}

export const removeCookie = (key: string) => {
    Cookies.remove(key)
    localStorage.removeItem(`cookie-${key}`)
}

export const isLoggedIn = () => {
    return getCookie('MUSIC_U') !== undefined
}

export const isAccountLoggedIn = () => {
    return getCookie('MUSIC_U') !== undefined && store.state.data.loginMode === 'account'
}

export const isUsernameLoggedIn = () => {
    return store.state.data.loginMode === 'username'
}

export const isLooseLoggedIn = () => {
    return isAccountLoggedIn() || isUsernameLoggedIn()
}

export const doLogout = () => {
    logout()
    removeCookie('MUSIC_U')
    removeCookie('__csrf')
    store.commit('updateData', { key: 'user', value: {} })
    store.commit('updateData', { key: 'loginMode', value: null })
    store.commit('updateData', { key: 'likedSongPlaylistID', value: undefined })
}
