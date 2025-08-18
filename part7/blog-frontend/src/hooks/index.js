import { useDispatch, useSelector } from "react-redux";
import { triggerNotification } from "../reducers/notificationReducer";
import { fetchPosts } from "../reducers/postReducer";
import { useEffect } from "react";
import { logoutUser } from "../reducers/seshReducer";
import { fetchUsers } from "../reducers/userReducer";

export const useNotify = () => {

	const notifications = useSelector(state => state.notification);
	const dispatch = useDispatch();

	return {
		confirm: {

			success (message, timeout) {

				console.log(message);

				if (!notifications.some(item => item.message === message))
					dispatch(triggerNotification(message.toString(), { type: "success", timeout, confirmation: true }));
			},
			error (message, timeout) {

				console.error(message);

				if (!notifications.some(item => item.message === message))
					dispatch(triggerNotification(message.toString(), { type: "error", timeout, confirmation: true }));
			}
		},
		success (message) {

			console.log(message);
			dispatch(triggerNotification(message.toString(), { timeout: 5000, type: "success" }));
		},
		log (message) {

			console.log(message);
			dispatch(triggerNotification(message.toString(), { timeout: 5000, type: "info" }));
		},
		error (message) {

			console.error(message);
			dispatch(triggerNotification(message.toString(), { timeout: 5000, type: "error" }));
		}
	};
};

export const usePosts = id => {

	const dispatch = useDispatch();

	const posts = useSelector(state => state.posts);
	const post = posts ?.find(item => item.id === id);

	const errorHandler = useErrorHandler();

	console.log(id, posts, post);

	useEffect(() => {

		if (id && posts && !post)
			errorHandler(204);

	}, [posts ?.length]);

	useEffect(() => {

		dispatch(fetchPosts())
			.unwrap()
			.catch(errorHandler);
	}, []);

	return id ? post : posts;
};

export const useUsers = id => {

	const dispatch = useDispatch();

	const users = useSelector(state => state.users);
	const user = users ?.find(item => item.id === id);

	const errorHandler = useErrorHandler();

	useEffect(() => {

		if (id && users && !user)
			errorHandler(204);

	}, [users ?.length]);

	useEffect(() => {

		dispatch(fetchUsers())
			.unwrap()
			.catch(errorHandler);
	}, []);

	return id ? user : users;
};

export const useErrorHandler = () => {

	const notify = useNotify();
	const dispatch = useDispatch();

	return e => {

		if (e === 204) {

			throw { status: 204, statusText: "No content" };
		};

		if (e.status === 500) {

			throw { status: 500, statusText: "No connection with the server" };
		}

		if (e.status === 401) {

			if (e.data.error.includes("invalid token")) {

				notify.confirm.error("Invalid user token! Log in again please");
				dispatch(logoutUser());
				return;
			}

			if (e.data.error.includes("token has expired")) {

				notify.confirm.error("Your login session passed over, please log in again");
				dispatch(logoutUser());
				return;
			};

			notify.error("Wrong credentials!");
			return;
		}

	};
};