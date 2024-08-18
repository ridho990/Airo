import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite';

// anggap global context sebagai ID
const GlobalContext = createContext();
// nah disini membuat providernya, membuat hooks untuk memanggil konteks GlobalContext
export const useGlobalContext = () => useContext(GlobalContext);

// ini komponen providenya, taroh sebagai parent supaya semua child dapat data dari context
const GlobalProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getCurrentUser()
			.then((res) => {
				if (res) {
					setIsLoggedIn(true);
					setUser(res);
				} else {
					setIsLoggedIn(false);
					setUser(null);
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return (
		<GlobalContext.Provider
			value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;
