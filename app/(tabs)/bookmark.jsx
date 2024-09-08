import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '../../components/EmptyState';
import useAppWrite from '../../lib/useAppWrite';
import { getBookmarkPosts } from '../../lib/appwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Bookmark = () => {
	const { user } = useGlobalContext();
	const [refreshing, setRefreshing] = useState(false);

	const { data: posts, refetch } = useAppWrite(() =>
		getBookmarkPosts(user.$id),
	);

	const onRefresh = async () => {
		setRefreshing(true);
		// re call videos --> if any new videos appeard
		await refetch();
		setRefreshing(false);
	};

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
							<Text className="text-2xl font-psemibold text-white">
								Saved Videos
							</Text>
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

export default Bookmark;
