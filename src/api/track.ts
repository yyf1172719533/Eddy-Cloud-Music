import store from '@/store';
import request from '@/utils/request';

/**
 * 获取音乐 url
 * 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,
 * !!!未登录状态返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * @param {string} id - 音乐的 id，例如 id=405998841,33894312
 */
export const getMP3 = (id: string) => {
    const getBr = () => {
        const quality = store.state.settings?.musicQuality ?? '320000'
        return quality === 'flac' ? '350000' : quality
    }
    return request({
        url: '/song/url',
        method: 'get',
        params: {
            id,
            br: getBr()
        }
    })
}

/**
 * 获取歌曲详情
 * 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(注意:歌曲封面现在需要通过专辑内容接口获取)
 * @param {string} ids - 音乐 id, 例如 ids=405998841,33894312
 */
export const getTrackDetail = (ids: any) => {
    const fetchLatest = () => {
        return request({
            url: '/song/detail',
            method: 'get',
            params: {
                ids
            }
        }).then(data => {
            data.songs.map(song => {
                const privileges = data.privileges.find(p => p.id === song.id)
                // todo
            })
            // data.songs =
            return data
        })
    }

    fetchLatest()

    let idArr = [String(ids)]
    if (typeof ids === 'string') {
        idArr = ids.split(',')
    }
}

/**
 * 获取歌词
 * 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * @param {number} id - 音乐 id
 */
export const getLyric = (id: number) => {
    const fetchLatest = () => {
        return request({
            url: '/lyric',
            method: 'get',
            params: {
                id
            }
        }).then(res => {
            // todo
            return res
        })
    }

    fetchLatest()
}

/**
 * 新歌速递
 * 说明 : 调用此接口 , 可获取新歌速递
 * @param {number} type - 地区类型 id, 对应以下: 全部:0 华语:7 欧美:96 日本:8 韩国:16
 */
export const topSong = (type: number) => {
    return request({
        url: '/top/song',
        method: 'get',
        params: {
            type
        }
    })
}

/**
 * 喜欢音乐
 * 说明 : 调用此接口 , 传入音乐 id, 可喜欢该音乐
 * - id - 歌曲 id
 * - like - 默认为 true 即喜欢 , 若传 false, 则取消喜欢
 * @param {Object} params
 * @param {number} params.id
 * @param {boolean=} [params.like]
 */
export const likeATrack = (params: any) => {
    params.timestamp = new Date().getTime()
    return request({
        url: '/like',
        method: 'get',
        params
    })
}

/**
 * 听歌打卡
 * 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
 * - id - 歌曲 id
 * - sourceid - 歌单或专辑 id
 * - time - 歌曲播放时间,单位为秒
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.sourceid
 * @param {number=} params.time
 */
export const scrobble = (params: any) => {
    params.timestamp = new Date().getTime()
    return request({
        url: '/scrobble',
        method: 'get',
        params
    })
}
