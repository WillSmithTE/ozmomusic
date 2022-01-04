export type SearchResult = {
    song: Song,
}

export type Song = {
    id: string,
    name: string,
    artist: Artist,
    imageURL: string,
    durationSeconds: number,
    uri?: string,
    
}

export const metadataToSong = (songMetadata: any, uri: string): Song => {
    return {
        id: `${songMetadata.extractor}:${songMetadata.id}`,
        name: songMetadata.title || songMetadata.fulltitle,
        artist: {
            id: `${songMetadata.extractor}:${songMetadata.uploader_id}`,
            name: songMetadata.uploader
        },
        uri,
        imageURL: songMetadata.thumbnail,
        durationSeconds: songMetadata.duration,
    }
}

export type Artist = {
    id?: string,
    name: string,
}