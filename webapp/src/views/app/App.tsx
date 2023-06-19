import './App.css';
import Login from '../login/login';
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { useSession } from '@inrupt/solid-ui-react';
import Error404Page from '../errorpage';
import { useEffect, useState } from 'react';
import LoginOrHome from '../LoginOrHome';
import AddPointForm from '../addPointForm/addPointForm';
import AddFriend from '../addFriendForm/addFriendForm';
import ManagePrivatePoints from '../managePrivatePoints/managePrivatePoints';
import ManageSharedPoints from '../manageSharedPoints/manageSharedPoints';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { session } = useSession();

	session.onLogin(() => {
		setIsLoggedIn(true);
	});

	//We have logged out
	session.onLogout(() => {
		setIsLoggedIn(false);
	});

	const isPageRefresh =
		window.performance &&
		window.performance
			.getEntriesByType("navigation")
			.map((nav: any) => nav.type)
			.includes("reload");

	useEffect(() => {
		sessionStorage.setItem("currentPath", window.location.href);
		const reload = async () => {
			if (isPageRefresh) {
				sessionStorage.setItem("isReload", "true");
				await session.handleIncomingRedirect({
					url: window.location.href
				});
			} else {
				sessionStorage.setItem("isReload", "false");
			}
		};
		reload();
	}, [isPageRefresh, session]);

	useEffect(() => {
		if (session.info.isLoggedIn) {
			window.localStorage.setItem("webId", session.info.webId ?? "");
		}
	}, [isLoggedIn, session.info.webId, session.info.isLoggedIn]);

	if (!session.info.isLoggedIn) {
		sessionStorage.clear();
		return <Login />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<LoginOrHome isLoggedIn={isLoggedIn} />}></Route>
				<Route path="/addPoint" element={<AddPointForm></AddPointForm>}></Route>
				<Route path="/addFriend" element={<AddFriend></AddFriend>}></Route>
				<Route path="/sharePoints" element={<ManagePrivatePoints></ManagePrivatePoints>}></Route>
				<Route path="/unsharePoints" element={<ManageSharedPoints></ManageSharedPoints>}></Route>
				<Route path="*" element={<Error404Page />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
