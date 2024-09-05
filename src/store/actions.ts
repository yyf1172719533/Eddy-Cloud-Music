import {isAccountLoggedIn, isLooseLoggedIn} from '@/utils/auth'
import {
    cloudDisk,
    likedAlbums,
    likedArtists,
    likedMVs,
    userLikedSongsIDs,
    userPlayHistory,
    userPlaylist,
    userAccount
} from '@/api/user';
import {getPlaylistDetail} from '@/api/playlist';
import {getTrackDetail, likeATrack} from '@/api/track'
import State from "./state.ts";

export default {

    showToast({ state, commit }: { state: State, commit: any }, text: string) {
        if (state.toast.timer !== null) {
            clearTimeout(state.toast.timer);
            commit('updateToast', { show: false, text: '', timer: null })
        }
        commit('updateToast', {
            show: true,
            text,
            timer: setTimeout(() => {
                commit('updateToast', {
                    show: false,
                    text: state.toast.text,
                    timer: null
                })
            }, 3200)
        })
    },

    likeATrack({ state, commit, dispatch }: { state: State, commit: any, dispatch: any}, id: number) {
        if (!isAccountLoggedIn()) {
            dispatch('showToast', '此操作需要登录网易云账号')
            return
        }
        let like = true
        if (state.liked.songs.includes(id)) like = false
        likeATrack({ id, like }).then(() => {
            if (!like) {
                commit('updateLikedXXX', {
                    name: 'songs',
                    data: state.liked.songs.filter(item => item !== id)
                })
            } else {
                let newLikeSongs = [...state.liked.songs, id];
                commit('updateLikedXXX', {
                    name: 'songs',
                    data: newLikeSongs,
                });
                dispatch('fetchLikedSongsWithDetails');
            }
        }).catch(() => {
            dispatch('showToast', '操作失败，专辑下架或版权锁定');
        })
    },

    fetchLikedSongs: ({ state, commit }: { state: State, commit: any }) => {
        if (!isLooseLoggedIn()) return;
        if (isAccountLoggedIn()) {
            return userLikedSongsIDs({ uid: state.data.user.userId }).then(result => {
                if (result.ids) {
                    commit('updateLikedXXX', {
                        name: 'songs',
                        data: result.ids,
                    });
                }
            });
        } else {
            // TODO:搜索ID登录的用户
        }
    },

    fetchLikedSongsWithDetails: ({ state, commit }: { state: State, commit: any }) => {
        return getPlaylistDetail(state.data.likedSongPlaylistID, true).then(
            result => {
                if (result.playlist?.trackIds?.length === 0) {
                    return new Promise(resolve => {
                        resolve();
                    });
                }
                return getTrackDetail(
                    result.playlist.trackIds
                        .slice(0, 12)
                        .map(t => t.id)
                        .join(',')
                ).then(result => {
                    commit('updateLikedXXX', {
                        name: 'songsWithDetails',
                        data: result.songs,
                    });
                });
            }
        );
    },

    fetchLikedPlaylist: ({ state, commit }: { state: State, commit: any }) => {
        if (!isLooseLoggedIn()) return;
        if (isAccountLoggedIn()) {
            return userPlaylist({
                uid: state.data.user?.userId,
                limit: 2000,
                timestamp: new Date().getTime(),
            }).then(result => {
                if (result.playlist) {
                    commit('updateLikedXXX', {
                        name: 'playlists',
                        data: result.playlist,
                    });
                    // 更新用户”喜欢的歌曲“歌单ID
                    commit('updateData', {
                        key: 'likedSongPlaylistID',
                        value: result.playlist[0].id,
                    });
                }
            });
        } else {
            // TODO:搜索ID登录的用户
        }
    },

    fetchLikedAlbums: ({ commit }: { commit: any }) => {
        if (!isAccountLoggedIn()) return;
        return likedAlbums({ limit: 2000 }).then(result => {
            if (result.data) {
                commit('updateLikedXXX', {
                    name: 'albums',
                    data: result.data,
                });
            }
        });
    },

    fetchLikedArtists: ({ commit }: { commit: any }) => {
        if (!isAccountLoggedIn()) return;
        return likedArtists({ limit: 2000 }).then(result => {
            if (result.data) {
                commit('updateLikedXXX', {
                    name: 'artists',
                    data: result.data,
                });
            }
        });
    },

    fetchLikedMVs: ({ commit }: { commit: any }) => {
        if (!isAccountLoggedIn()) return;
        return likedMVs({ limit: 1000 }).then(result => {
            if (result.data) {
                commit('updateLikedXXX', {
                    name: 'mvs',
                    data: result.data,
                });
            }
        });
    },

    fetchCloudDisk: ({ commit }: { commit: any }) => {
        if (!isAccountLoggedIn()) return;
        return cloudDisk({ limit: 1000 }).then(result => {
            if (result.data) {
                commit('updateLikedXXX', {
                    name: 'cloudDisk',
                    data: result.data,
                });
            }
        });
    },

    fetchPlayHistory: ({ state, commit }: { state: State, commit: any }) => {
        if (!isAccountLoggedIn()) return;
        return Promise.all([
            userPlayHistory({ uid: state.data.user?.userId, type: 0 }),
            userPlayHistory({ uid: state.data.user?.userId, type: 1 }),
        ]).then(result => {
            const data = {} as { [key: string]: any[] };
            const dataType = { 0: 'allData', 1: 'weekData' };
            if (result[0] && result[1]) {
                for (let i = 0; i < result.length; i++) {
                    data[dataType[i]] = result[i][dataType[i]].map(item => {
                        const song = item.song;
                        song.playCount = item.playCount;
                        return song;
                    });
                }
                commit('updateLikedXXX', {
                    name: 'playHistory',
                    data: data,
                });
            }
        });
    },

    fetchUserProfile: ({ commit }: { commit: any }) => {
        if (!isAccountLoggedIn()) return;
        return userAccount().then(result => {
            if (result.code === 200) {
                commit('updateData', { key: 'user', value: result.profile });
            }
        });
    },
}
