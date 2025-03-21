import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import useAppWrite from '../../lib/useAppWrite';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
// import { useAppwrite } from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Home = () => {
	const { user, setUser, setIsLoggedIn } = useGlobalContext();
	const [refreshing, setRefreshing] = useState(false);

	const { data: posts, refetch, isLoading } = useAppWrite(getAllPosts);
	const { data: latestPosts } = useAppWrite(getLatestPosts);

	const onRefresh = async () => {
		setRefreshing(true);
		// re call videos --> if any new videos appeard
		await refetch();
		setRefreshing(false);
	};

	// console.log(posts);

	return (
		// scroll view tidak mendukung scroll veritikal dan horizontal dalam satu waktu yang sama
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => <VideoCard video={item} />}
				ListHeaderComponent={() => (
					<View className="my-6 px-4 space-y-6">
						<View className="justify-between items-start flex-row mb-6">
							<View>
								<Text className="font-pmedium text-sm text-gray-100">
									Welcome back,
								</Text>
								<Text className="text-2xl font-psemibold text-white">
									{user?.username}
								</Text>
							</View>

							<View className="mt-1.5">
								<Image
									source={images.logoSmall}
									className="w-9 h-10"
									resizeMode="contain"
								/>
							</View>
						</View>

						<SearchInput />

						<View className="w-full flex-1 pt-5 pb-8">
							<Text className="text-gray-100 tex-lg font-pregular mb-3">
								Latest Videos
							</Text>

							<Trending posts={latestPosts ?? []} />
						</View>
					</View>
				)}
				// stickyHeaderIndices={[0,1]}
				// ini ituh buat handle data kosong
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="Be the first one to upload a video"
					/>
				)}
				// ini untuk gesture refresh dengan scroll down
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		</SafeAreaView>
	);
};

export default Home;
