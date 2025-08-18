import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as Pages from "./components/Pages";
import NotificationProvider, { NotificationContext } from "./components/NotificationProvider";
import NotificationContainer from "./components/NotificationContainer";
import Notification from "./components/Notification";
import App from "./App";

import store from "./store";

import "@fontsource/inter";
import { CssBaseline } from "@mui/joy";
import { useContext } from "react";


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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<CssBaseline />
			<NotificationProvider>
				<NotificationContainer
					data-testid="notifications"
					useNotificationData={() => useContext(NotificationContext).notifications}
					Template={Notification}
				/>
				<RouterProvider router={ROUTER} />
			</NotificationProvider>
		</QueryClientProvider>
	</Provider>
);