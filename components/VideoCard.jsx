import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { useEffect, useState } from 'react';
import { Video, ResizeMode } from 'expo-av';

import { icons } from '../constants';
import { useGlobalContext } from '../context/GlobalProvider';
import { bookmarkVideo } from '../lib/appwrite';

const VideoCard = ({
	video: {
		title,
		thumbnail,
		video,
		creator: { username, avatar },
		$id,
		liked,
	},
}) => {
	const { user } = useGlobalContext();
	const [play, setPlay] = useState(false);
	const [bookmark, setBookmark] = useState(false);

	const onLikedPress = () => {
		bookmarkVideo($id, user.$id, bookmark);
		setBookmark(!bookmark);
	};

	const isVideosBookmark = () => {
		const userLikeVideos = liked.map((item) => item.$id);
		setBookmark(userLikeVideos.includes(user.$id));
	};

	useEffect(() => {
		isVideosBookmark();
	}, []);

	// console.log('test', is);

	return (
		<View className="flex flex-col items-center px-4 mb-14">
			<View className="flex flex-row gap-3 items-start">
				<View className="flex justify-center items-center flex-row flex-1">
					<View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
						<Image
							source={{ uri: avatar }}
							className="w-full h-full rounded-lg"
							resizeMode="cover"
						/>
					</View>

					<View className="flex justify-center flex-1 ml-3 gap-y-1">
						<Text className="text-white font-psemibold text-sm">{title}</Text>
						<Text className="textxs text-gray-100 font-pregular">
							{username}
						</Text>
					</View>
				</View>

				<View className="pt-2 flex-row gap-2">
					<TouchableOpacity activeOpacity={0.7} onPress={onLikedPress}>
						<Image
							source={bookmark ? icons.loveFill : icons.loveBorder}
							className="w-5 h-5"
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
				</View>
			</View>

			{play ? (
				<Video
					source={{ uri: video }}
					className="w-full h-60 rounded-xl mt-3"
					resizeMode={ResizeMode.CONTAIN}
					useNativeControls
					shouldPlay
					onPlaybackStatusUpdate={(status) => {
						if (status.didJustFinish) {
							setPlay(false);
						}
					}}
				/>
			) : (
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setPlay(true)}
					className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
				>
					<Image
						source={{ uri: thumbnail }}
						className="w-full h-full rounded-xl mt-3"
						resizeMode="cover"
					/>
					<Image
						source={icons.play}
						className="h-12 w-12 absolute"
						resizeMode="contain"
					/>
					{/* <Text className="text-white">{thumbnail}</Text> */}
				</TouchableOpacity>
			)}
		</View>
	);
};

export default VideoCard;
