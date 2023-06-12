import { SessionProvider } from "@inrupt/solid-ui-react";
import Home from "./home/home";
import Login from "./login/login";

function LoginOrHome(props: { isLoggedIn: boolean }) {
	return (
		<SessionProvider sessionId="login">
			{props.isLoggedIn ? <Home /> : <Login />}
		</SessionProvider>
	);
};

export default LoginOrHome;