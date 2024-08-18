import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import EmptyState from '../../components/EmptyState';
import useAppWrite from '../../lib/useAppWrite';
import { getUserPosts, signOut } from '../../lib/appwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';

const Profile = () => {
	const { user, setUser, setIsLoggedIn } = useGlobalContext();
	const { data: posts, refetch } = useAppWrite(() => getUserPosts(user.$id));

	const logOut = async () => {
		await signOut();
		setUser(null);
		setIsLoggedIn(false);

		router.replace('/sign-in');
	};

	return (
		// scroll view tidak mendukung scroll veritikal dan horizontal dalam satu waktu yang sama
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => <VideoCard video={item} />}
				ListHeaderComponent={() => (
					<View className="w-full justify-center items-center mt-6 mb-12 px-4">
						<TouchableOpacity
							className="w-full items-end mb-10"
							onPress={logOut}
						>
							<Image
								source={icons.logout}
								resizeMode="contain"
								className="w-6 h-6"
							/>
						</TouchableOpacity>

						<View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
							<Image
								source={{ uri: user?.avatar }}
								className="w-[90%] h-[90%] rounded-lg"
								resizeMode="cover"
							/>
						</View>

						<InfoBox
							title={user?.username}
							containerStyles="mt-5"
							titleStyles="text-lg"
						/>

						<View className="mt-5 flex-row">
							<InfoBox
								title={posts.length || 0}
								subtitle="Posts"
								containerStyles="mr-10"
								titleStyles="text-xl"
							/>
							<InfoBox
								title="1.2K"
								subtitle="Followers"
								titleStyles="text-lg"
							/>
						</View>
					</View>
				)}
				// ini ituh buat handle data kosong
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="No videos found for this search"
					/>
				)}
				// ini untuk gesture refresh dengan scroll down
			/>
		</SafeAreaView>
	);
};

export default Profile;
