import { player as playerState } from '../states';
import { DISPATCHES } from '../../constants';
import { toString } from '../../util';

const player = (state = playerState, { type = null, payload = {} }) => {
	switch (type) {
		case DISPATCHES.SET_CURRENT_SONG:
			const config = {
				playback: 'current',
				soundObj: 'current',
				detail: 'current',
				playbackStatus: 'current',
				...payload,
			};

			return {
				...state,
				currentSong: {
					playback: config?.playback === 'current' ? state?.currentSong?.playback : payload?.playback,
					soundObj: config?.soundObj === 'current' ? state?.currentSong?.soundObj : payload?.soundObj,
					detail: config?.detail === 'current' ? state?.currentSong?.detail : payload?.detail,
					playbackStatus: config?.playbackStatus === 'current' ? state?.currentSong?.playbackStatus : payload?.playbackStatus,
				},
			};

		case DISPATCHES.NEW_SONGS:
			console.info(`DISPATCHES.NEW_SONGS (newSongs=${toString(payload.newSongs)})`)
			console.info(`newStateSongs=${toString({
				...state,
				songs: payload.newSongs.concat(state.songs)
			}.songs)}`)
			return {
				...state,
				songs: payload.newSongs.concat(state.songs)
			};

		default:
			return state;
	}
};

export default player;
