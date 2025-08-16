import { useDispatch, useSelector } from "react-redux";
import { triggerNotification, appendNotification } from "../reducers/notificationReducer";
import { fetchPosts } from "../reducers/postReducer";
import { useEffect } from "react";
import { logoutUser } from "../reducers/seshReducer";

export const useNotify = () => {

	const notifications = useSelector(state => state.notification);
	const dispatch = useDispatch();

	return {
		confirm: {

			success (message) {

				console.log(message);

				if (!notifications.some(item => item.message === message))
					dispatch(triggerNotification(message.toString(), { type: "success", confirmation: true }));
			},
			error (message) {

				console.error(message);

				if (!notifications.some(item => item.message === message))
					dispatch(triggerNotification(message.toString(), { type: "error", confirmation: true }));
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

	const notify = useNotify();
	const dispatch = useDispatch();

	const posts = useSelector(state => state.posts);
	const post = posts ?.find(item => item.id === id);

	const errorHandler = useErrorHandler();

	useEffect(() => {

		if (id && posts && !post)
			errorHandler("Unknown endpoint!");

	}, [posts ?.length || 0]);

	useEffect(() => {

		dispatch(fetchPosts())
			.unwrap()
			.catch(e => {

				notify.confirm.error("No connection! Try again in a while");
			});
	}, []);

	return id ? post : posts;
};

export const useErrorHandler = () => {

	const notify = useNotify();
	const dispatch = useDispatch();

	return e => {

		if (e === "Unknown endpoint!") {

			notify.confirm.error("Unknown endpoint!");
			return;
		};

		if (e.data.error.includes("token has expired")) {

			notify.confirm.error("Your login session passed over, please log in again");
			dispatch(logoutUser());
			return;
		};
	};
};

//export const useSession = () => {

//	const session = useSelector(state => state.session);

//	const errorHandler = useErrorHandler();

//	useEffect(() => {

//		if (session.status === "stored")
//			dispatch(checkUser())
//				.unwrap()
//				.catch(errorHandler);
//	}, []);

//	return { status: session.status, user: session.data ?.user };
//};