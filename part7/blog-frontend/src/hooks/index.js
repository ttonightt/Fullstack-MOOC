import { useDispatch, useSelector } from "react-redux";
import { triggerNotification, appendNotification } from "../reducers/notificationReducer";
import { fetchPosts } from "../reducers/postReducer";
import { useEffect } from "react";

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

	const posts = useSelector(state => {
		
		if (id) {

			if (state.posts) {

				const post = state.posts.find(item => item.id === id);

				if (post) 
					return post;

				notify.confirm.error("Unknown endpoint!");
			}

			return undefined;
		} else {

			return state.posts;
		}
	});

	const dispatch = useDispatch();

	useEffect(() => {

		dispatch(fetchPosts())
			.unwrap()
			.catch(e => {

				notify.confirm.error("No connection! Try again in a while");
			});
	}, []);

	return posts;
};