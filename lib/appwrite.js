import {
	Client,
	Account,
	ID,
	Avatars,
	Databases,
	Query,
	Storage,
} from 'react-native-appwrite';

export const appwriteConfig = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.raf.aora',
	projectId: '66b7454700125b5ff679',
	databaseId: '66b74bb7002b61f58ac9',
	userCollectionId: '66b74be6001ab7bbb5d0',
	videoCollectionId: '66b74c2b001ca0b60371',
	storageId: '66b82b9300079cea19fc',
};

const {
	endpoint,
	platform,
	projectId,
	databaseId,
	userCollectionId,
	videoCollectionId,
	storageId,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
	.setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
	.setProject(appwriteConfig.projectId) // Your project ID
	.setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username,
		);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{ accountId: newAccount.$id, email, username, avatar: avatarUrl },
		);

		return newUser;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export async function signIn(email, password) {
	try {
		const session = await account.createEmailPasswordSession(email, password);
		return session;
	} catch (error) {
		throw new Error(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get();
		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal('accountId', currentAccount.$id)],
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		console.log(error);
		return null;
	}
}

// Get all video Posts
export async function getAllPosts() {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt'),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

// Get latest video Posts
export async function getLatestPosts() {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt', Query.limit(7)),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export async function searchPost(query) {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.search('title', query),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export async function getUserPosts(userId) {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.equal('creator', userId),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export const signOut = async () => {
	try {
		const session = await account.deleteSession('current');

		return session;
	} catch (error) {
		throw new Error(error);
	}
};

export const getFilePreview = async (fileId, type) => {
	let fileUrl;

	try {
		if (type === 'video') {
			fileUrl = storage.getFileView(storageId, fileId);
		} else if (type === 'image') {
			fileUrl = storage.getFilePreview(
				storageId,
				fileId,
				2000,
				2000,
				'top',
				100,
			);
		} else {
			throw new Error('Invalid file type');
		}

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
};

export const uploadFile = async (file, type) => {
	if (!file) return;

	const asset = {
		name: file.fileName,
		type: file.mimeType,
		size: file.fileSize,
		uri: file.uri,
	};

	try {
		const uploadedFile = await storage.createFile(
			storageId,
			ID.unique(),
			asset,
		);

		const fileUrl = await getFilePreview(uploadedFile.$id, type);
		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
};

export const createVideo = async (form) => {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, 'image'),
			uploadFile(form.video, 'video'),
		]);

		const newPost = await databases.createDocument(
			databaseId,
			videoCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				prompt: form.prompt,
				creator: form.userId,
			},
		);

		return newPost;
	} catch (error) {
		throw new Error(error);
	}
};
