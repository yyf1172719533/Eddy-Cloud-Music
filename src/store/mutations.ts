import shortcuts from '@/utils/shortcuts';
import cloneDeep from 'lodash/cloneDeep';
import { MutationTree } from 'vuex';
import State from "./state.ts";

export const mutations: MutationTree<State> = {

    updateLikedXXX(state, { name, data }: { name: string; data: any }) {
        state.liked[name] = data;
        if (name === 'songs') {
            state.player.sendSelfToTpcMain()
        }
    },
    changeLang(state, lang: string | null) {
        state.settings.lang = lang;
    },
    changeMusicQuality(state, value: number) {
        state.settings.musicQuality = value;
    },
    changeLyricFontSize(state, value: number) {
        state.settings.lyricFontSize = value;
    },
    changeOutputDevice(state, deviceId: string) {
        state.settings.outputDevice = deviceId;
    },
    updateSettings(state, { key, value }: { key: string; value: any }) {
        state.settings[key] = value;
    },
    updateData(state, { key, value }: { key: string; value: any }) {
        state.data[key] = value;
    },
    togglePlaylistCategory(state, name: string) {
        const index = state.settings.enabledPlaylistCategories.findIndex(c => c === name);
        if (index !== -1) {
            state.settings.enabledPlaylistCategories = state.settings.enabledPlaylistCategories.filter(c => c !== name);
        } else {
            state.settings.enabledPlaylistCategories.push(name);
        }
    },
    updateToast(state, toast: any) {
        state.toast = toast;
    },
    updateModal(state, { modalName, key, value }: { modalName: string; key: string; value: any }) {
        state.modals[modalName][key] = value;
        if (key === 'show') {
            value === true
                ? setTimeout(() => (state.enableScrolling = false), 100)
                : (state.enableScrolling = true);
        }
    },
    toggleLyrics(state) {
        state.showLyrics = !state.showLyrics;
    },
    updateDailyTracks(state, dailyTracks: any) {
        state.dailyTracks = dailyTracks;
    },
    updateLastfm(state, session: any) {
        state.lastfm = session;
    },
    updateShortcut(state, { id, type, shortcut }: { id: string; type: string; shortcut: any }) {
        let newShortcut = state.settings.shortcuts.find(s => s.id === id);
        newShortcut[type] = shortcut;
        state.settings.shortcuts = state.settings.shortcuts.map(s => {
            if (s.id !== id) return s;
            return newShortcut;
        });
    },
    restoreDefaultShortcuts(state) {
        state.settings.shortcuts = cloneDeep(shortcuts);
    },
    enableScrolling(state, status: boolean | null = null) {
        state.enableScrolling = status ? status : !state.enableScrolling;
    },
    updateTitle(state, title: string) {
        state.title = title;
    },
}
