import { playlistCategories } from '@/utils/staticData'
import shortcuts from "@/utils/shortcuts";

interface ProxyConfig {
    protocol: string;
    server: string;
    port: number | null;
}

interface Settings {
    lang: string | null;
    musicLanguage: string;
    appearance: string;
    musicQuality: number;
    lyricFontSize: number;
    outputDevice: string;
    showPlaylistsByAppleMusic: boolean;
    enableUnblockNeteaseMusic: boolean;
    automaticallyCacheSongs: boolean;
    cacheLimit: number;
    enableReversedMode: boolean;
    nyancatStyle: boolean;
    showLyricsTranslation: boolean;
    lyricsBackground: boolean;
    enableOsdlyricsSupport: boolean;
    closeAppOption: string;
    enableDiscordRichPresence: boolean;
    enableGlobalShortcut: boolean;
    showLibraryDefault: boolean;
    subTitleDefault: boolean;
    linuxEnableCustomTitlebar: boolean;
    enabledPlaylistCategories: string[];
    proxyConfig: ProxyConfig;
    shortcuts: Record<any, any>;
}

interface Data {
    user: Record<any, any>;
    likedSongPlaylistID: number;
    lastRefreshCookieDate: number;
    loginMode: string | null;
}

interface LocalStorage {
    player: Record<any, any>;
    settings: Settings;
    data: Data;
}

const enabledPlaylistCategories = playlistCategories
    .filter(e => e.enable)
    .map(e => e.name);

const localStorage: LocalStorage = {
    player: {},
    settings: {
        lang: null,
        musicLanguage: 'all',
        appearance: 'auto',
        musicQuality: 320000,
        lyricFontSize: 28,
        outputDevice: 'default',
        showPlaylistsByAppleMusic: true,
        enableUnblockNeteaseMusic: true,
        automaticallyCacheSongs: true,
        cacheLimit: 8192,
        enableReversedMode: false,
        nyancatStyle: false,
        showLyricsTranslation: true,
        lyricsBackground: true,
        enableOsdlyricsSupport: false,
        closeAppOption: 'ask',
        enableDiscordRichPresence: false,
        enableGlobalShortcut: true,
        showLibraryDefault: false,
        subTitleDefault: false,
        linuxEnableCustomTitlebar: false,
        enabledPlaylistCategories,
        proxyConfig: {
            protocol: 'noProxy',
            server: '',
            port: null,
        },
        shortcuts: shortcuts,
    },
    data: {
        user: {},
        likedSongPlaylistID: 0,
        lastRefreshCookieDate: 0,
        loginMode: null,
    },
}

export default localStorage
