import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
	const { isLoading, isLoggedIn } = useGlobalContext();

	if (!isLoading && isLoggedIn) return <Redirect href={'/home'} />;

	return (
		// safe area itu kayak ngebuat view tapi aman dari halangan kayak kamera dll
		<SafeAreaView className="bg-primary h-full">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="w-full justify-center items-center h-full px-4">
					<Image
						source={images.logo}
						className="w-[130px] h-[84px]"
						resizeMode="contain"
					/>
					<Image
						source={images.cards}
						className="max-w-[380px] w-full h-[300px]"
						resizeMode="contain"
					/>
					<View className="relative mt-5">
						<Text className="text-3xl text-white font-bold text-center">
							Discover Endless Possibilities With{' '}
							<Text className="text-secondary-200 ">Aora</Text>
						</Text>
						<Image
							source={images.path}
							className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
							resizeMode="contain"
						/>
					</View>
					<Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
						Where creativty meets innovation: embark on a journey of limitless
						exploration with Aora{' '}
					</Text>
					<CustomButton
						title={'Continue with Email'}
						handlePress={() => router.push('/sign-in')}
						containerStyles={'w-full mt-7'}
					/>
				</View>
			</ScrollView>
			{/* ini buat indikator atas ituloh yang ada baterai sinyal dkk */}
			<StatusBar backgroundColor="#161622" style="light" />
		</SafeAreaView>
	);
}
