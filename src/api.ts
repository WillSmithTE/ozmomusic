import { metadataToSong, SearchResult, Song } from "./types"
import { ENV_VARS } from './variables'
import { toString } from "./util"

const db: { songs: Song[] } = {
    songs: []
}

export const api = {
    search: async function (url: string): Promise<Song> {
        console.debug(`search (url=${url})`)
        const encodedUrl = encodeURIComponent(url)
        try {
            const response = await fetch(`${ENV_VARS.apiUrl}/api/media/metadata?url=${encodedUrl}`)
            if (response.ok) {
                const json = await response.json()
                console.debug(`songMetadata=${toString(json)}`)

                const song: Song = metadataToSong(json)
                console.debug(`song=${toString(song)}`)
                return song
            } else {
                throw new Error(`youtube-dl failed (url=${url})`)
            }
        } catch (e: any) {
            console.error(`error in search - ${e.message}`)
            return Promise.reject(e)
        }
    },
    getDownloadUrl: function (url: string): string {
        console.debug(`getDownloadUrl (url=${url})`)
        const encodedUrl = encodeURIComponent(url)
        return `${ENV_VARS.apiUrl}/api/media/download?url=${encodedUrl}`
    }
}

