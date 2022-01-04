import React, { useEffect, useState, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux'
import Icon from '../Icon';
import * as Modal from '../../widgets/Modals';
import millisToMin from '../../helpers/millisToMin';
import { api } from '../../api';
import { useAssets } from 'expo-asset';
import { DISPATCHES } from '../../constants';
import * as FileSystem from 'expo-file-system';

const MusicList = ({
	id = '',
	style = {},
	imageURL,
	title = 'Song Title',
	author = `Artist Name`,
	duration = 132,
	onPlayPress = () => { },
	moreOptions = [],
	downloadable = false,
	playable = true,
	songs,
	uri,
	searchTerm,
}) => {
	console.error({uri})
	const [moreOptionsModal, setMoreOptionsModal] = useState(false);

	return (
		<>
			<TouchableOpacity style={[styles.container, style]} onLongPress={() => setMoreOptionsModal(true)} activeOpacity={0.8}>
				<View style={styles.left}>
					<Image
						style={{
							width: 70,
							height: 70,
							position: 'absolute',
							bottom: -3,
							opacity: 0.5,
							alignSelf: 'center',
						}}
						source={{ uri: imageURL }}
						resizeMode="cover"
						borderRadius={6}
						blurRadius={100}
					/>
					<Image style={styles.coverArt} source={{ uri: imageURL }} resizeMode="cover" borderRadius={6} />
				</View>
				<View style={styles.middle}>
					<View>
						<Text style={styles.title} numberOfLines={2}>
							{title}
						</Text>
						<Text style={styles.author}>{author}</Text>
					</View>
					<Text style={styles.duration}>{millisToMin(duration)}</Text>
				</View>
				{playable &&
					<View style={styles.right}>
						<TouchableOpacity onPress={onPlayPress}>
							<Icon family='AntDesign' name="play" color="orange" />
						</TouchableOpacity>
					</View>
				}
				{downloadable && <DownloadButton songs={songs} searchTerm={searchTerm} id={id} title={title} imageURL={imageURL} duration={duration} author={author}/>}


			</TouchableOpacity>

			<Modal.MoreOptions visible={moreOptionsModal} onClose={setMoreOptionsModal} title={title} moreOptions={moreOptions} />
		</>
	);
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
export default connect(mapStateToProps, null)(memo(MusicList));

const mapStateToProps2 = (state) => ({ songs: state?.player?.songs });
const mapDispatchToProps = (dispatch) => ({ dispatch });
const DownloadButton = connect(mapStateToProps2, mapDispatchToProps)(
	({ songs, id, searchTerm, dispatch, title, duration, author, imageURL }) => {
		const [isDownloading, setIsDownloading] = useState(false)
		const [isDownloaded, setIsDownloaded] = useState(false)

		const download = async () => {
			setIsDownloading(true)

			const downloadUrl = api.getDownloadUrl(searchTerm)
			const fileUri = FileSystem.documentDirectory + id
			console.error({downloadUrl, fileUri})
			const downloadResumable = FileSystem.createDownloadResumable(
				downloadUrl,
				fileUri,
				{},
				() => { }
			);
			try {
				const { uri } = await downloadResumable.downloadAsync();
				console.log('Finished downloading to ', uri);
				dispatch({
					type: DISPATCHES.NEW_SONG,
					payload: {
						newSong: {
							id,
							title,
							author,
							img: imageURL,
							uri: fileUri,
							durationMillis: duration,
						},

					}
				})
			} catch (e) {
				console.error(e);
			}
		}

		useEffect(() => {
			if (songs.find(({ id: savedSongId }) => id === savedSongId)) {
				setIsDownloaded(true)
			} else {
				setIsDownloaded(false)
			}
		}, [songs, id])

		const onClick = () => {
			if (isDownloaded) {
				// deleteDownload
			} else if (isDownloading) {
				// stopDownloading
			} else {
				download()
			}
		}

		return <View style={styles.right}>
			<TouchableOpacity onPress={onClick}>
				{(() => {
					if (isDownloaded) {
						return <Icon family='MaterialCommunityIcons' name="arrow-down-circle" color="orange" />
					} else if (isDownloading) {
						return <Icon family='MaterialCommunityIcons' name="stop-circle-outline" color="orange" />
					} else {
						return <Icon family='MaterialCommunityIcons' name="arrow-down-circle-outline" color="orange" />
					}
				})()}
			</TouchableOpacity>
		</View>
	})

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	left: {},
	middle: {
		flex: 1,
		height: 80,
		marginLeft: 10,
		marginRight: 20,
		justifyContent: 'space-between',
	},
	right: {},
	coverArt: {
		width: 80,
		height: 80,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	author: {
		color: '#888',
	},
	duration: {
		color: '#A4A4A4',
	},
	playBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		paddingLeft: 4,
		borderRadius: 100,
		borderWidth: 1.5,
		borderColor: '#FFF',
	},
});
