import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

import * as Pages from "./components/Pages";
import NotificationContainer from "./components/NotificationContainer";
import Notification from "./components/Notification";
import App from "./App";

import store from "./store";

import "@fontsource/inter";
import { CssBaseline } from "@mui/joy";


const ROUTER = createBrowserRouter([
	{
		path: "/",
		Component: App,
		errorElement: <Pages.ErrorPage />,
		children: [
			{
				index: true,
				Component: Pages.Root
			},
			{
				path: "login",
				Component: Pages.Login
			},
			{
				path: "users",
				Component: Pages.UserList
			},
			{
				path: "posts",
				Component: Pages.PostList
			},
			{
				path: "users/:id",
				Component: Pages.UserProfile
			},
			{
				path: "posts/:id",
				Component: Pages.Post
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<CssBaseline />
		<NotificationContainer
			data-testid="notifications"
			useNotificationData={() => useSelector(state => state.notification)}
			Template={Notification}
		/>
		<RouterProvider router={ROUTER} />
	</Provider>
);