import server from 'NeteaseCloudMusicApi/server'
import clc from 'cli-color'
import {createRequire} from "node:module";

const require = createRequire(import.meta.url)
export async function startMusicServer() {

    console.log(`${clc.redBright('[Music Server]')} Starting...`)

    await server.serveNcmApi({
        port: 30888,
        moduleDefs: require('./musicModelDef.mjs')
    })
}
