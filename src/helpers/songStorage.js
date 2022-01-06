import { SONG_LIST_KEY } from "../constants"
import { getJson, storeJson } from "./storage"

export const saveSong = async (song) => {
	const savedSongs = await getJson(SONG_LIST_KEY)
	const newList = savedSongs === null ? [song] : [song, ...savedSongs]
	await storeJson(SONG_LIST_KEY, newList)
}

export const getSongs = async () => {
	const savedSongs = await getJson(SONG_LIST_KEY)
	return savedSongs === null ? [] : savedSongs
}

