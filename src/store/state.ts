import initLocalStorage from './modules/initLocalStorage.ts'
import pkg from '../../package.json'

interface Liked {
    songs: string[];
    songsWithDetails: string[];
    playlists: string[];
    albums: string[];
    artists: string[];
    mvs: string[];
    cloudDisk: string[];
    playHistory: {
        weekData: string[];
        allData: string[];
    }
}

interface ContextMenu {
    clickObjectID: number;
    showMenu: boolean;
}

interface Toast {
    show: boolean;
    text: string;
    timer: null | ReturnType<typeof setTimeout>;
}

interface Modals {
    addTrackToPlaylistModal: {
        show: boolean;
        selectedTrackID: number;
    };
    newPlaylistModal: {
        show: boolean;
        afterCreateAddTrackID: number;
    };
}

interface State {
    showLyrics: boolean;
    enableScrolling: boolean;
    title: string;
    liked: Liked;
    contextMenu: ContextMenu;
    toast: Toast;
    modals: Modals;
    dailyTracks: string[];
    lastfm: Record<any, any>;
    player: Record<any, any>;
    settings: Record<any, any>;
    data: Record<any, any>;
}

if (localStorage.getItem('appVersion') === null) {
    localStorage.setItem('settings', JSON.stringify(initLocalStorage.settings))
    localStorage.setItem('data', JSON.stringify(initLocalStorage.data))
    localStorage.setItem('appVersion', pkg.version)
}

const state: State = {
    showLyrics: false,
    enableScrolling: true,
    title: 'Eddy-Cloud-Music',
    liked: {
        songs: [],
        songsWithDetails: [],
        playlists: [],
        albums: [],
        artists: [],
        mvs: [],
        cloudDisk: [],
        playHistory: {
            weekData: [],
            allData: [],
        },
    },
    contextMenu: {
        clickObjectID: 0,
        showMenu: false,
    },
    toast: {
        show: false,
        text: '',
        timer: null,
    },
    modals: {
        addTrackToPlaylistModal: {
            show: false,
            selectedTrackID: 0,
        },
        newPlaylistModal: {
            show: false,
            afterCreateAddTrackID: 0,
        },
    },
    dailyTracks: [],
    lastfm: JSON.parse(localStorage.getItem('lastfm') || '{}'),
    player: JSON.parse(localStorage.getItem('player') || '{}'),
    settings: JSON.parse(localStorage.getItem('settings') || '{}'),
    data: JSON.parse(localStorage.getItem('data') || '{}'),
}

export default state
