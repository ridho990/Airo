import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import useAppWrite from '../../lib/useAppWrite';
import { searchPost } from '../../lib/appwrite';
// import { useAppwrite } from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';

const Search = () => {
	const query = useLocalSearchParams();
	const { data: posts, refetch } = useAppWrite(() => searchPost(query.query));

	console.log(query, posts);
	useEffect(() => {
		refetch();
	}, [query.query]);

	return (
		// scroll view tidak mendukung scroll veritikal dan horizontal dalam satu waktu yang sama
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => <VideoCard video={item} />}
				ListHeaderComponent={() => (
					<View className="my-6 px-4 ">
						<Text className="font-pmedium text-sm text-gray-100">
							Search Results
						</Text>
						<Text className="text-2xl font-psemibold text-white">
							{query.query}
						</Text>

						<View className="mt-6 mb-8">
							<SearchInput initialQuery={query.query} />
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

export default Search;
