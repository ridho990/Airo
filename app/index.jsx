import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
export default function App() {
	return (
		<>
			<View className="flex-1 items-center justify-center bg-primary">
				<Text className="text-4xl text-[#777] mb-10">Hallo guys</Text>
				<StatusBar style="auto" />
				<Link href="/profile" style={{ color: 'blue' }}>
					Go To Profile
				</Link>
			</View>
		</>
	);
}
