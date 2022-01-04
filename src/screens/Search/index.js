import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';

import { Section } from '../../widgets';
import { Card, Icon } from '../../components';
import { api } from '../../api';

const Index = ({ songs }) => {
	const { goBack } = useNavigation();
	const [audios, setAudios] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [song, setSong] = useState(undefined)
	const [error, setError] = useState(undefined)

	const search = () => {
		setError(undefined)
		if (searchTerm && searchTerm.length) {
			api.search(searchTerm).then(
				(song) => {
					setSong(song)
					setError(undefined)
				},
				(err) => {
					setSong(undefined)
					setError(err)
				}
			)
		}
	}

	return (
		<>
			<StatusBar style="dark" />
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<SafeAreaView style={styles.container}>
					<View style={styles.header}>
						<View style={styles.input}>
							<Icon name="search" color="#FFF" />
							<TextInput
							style={styles.textInput} onChangeText={setSearchTerm} value={searchTerm}
							 returnKeyType="search" placeholder="Search..." onSubmitEditing={search}
							 />
						</View>
						<TouchableOpacity style={styles.btn} onPress={() => {
							setSearchTerm('')
							Keyboard.dismiss()
						}}>
							<Icon name="x" />
						</TouchableOpacity>
					</View>
					<View style={styles.result}>
						{(() => {
							if (error) {
								return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 24, fontWeight: 'bold', color: 'rgba(0, 0, 0, .3)' }}>Something went wrong...</Text>
									<Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, .3)' }}>{error.message}</Text>
								</View>
							} else if (song) {
								console.error({song})
								return <Card.MusicList imageURL={song.imageURL} title={song.name} artist={song.artist.name} duration={song.durationSeconds} downloadable playable={false} />
							} else {
								return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 24, fontWeight: 'bold', color: 'rgba(0, 0, 0, .3)' }}>Paste a SoundCloud URL...</Text>
								</View>
							}
						})()}
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</>
	);
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
export default connect(mapStateToProps, null)(memo(Index));

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 30,
		marginBottom: 15,
		marginHorizontal: 20,
	},
	input: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 15,
		backgroundColor: '#E6E6E6',
		borderRadius: 6,
	},
	textInput: {
		flex: 1,
		color: 'rgba(0, 0, 0, .5)',
		marginLeft: 10,
	},
	btn: {
		flexBasis: 80,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btnTxt: {
		color: '#C4C4C4',
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	result: {
		flex: 1,
	},
});
