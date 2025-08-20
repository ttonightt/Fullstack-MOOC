import { useContext, useEffect } from "react";
import { NotificationContext } from "../components/NotificationProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as postService from "../services/posts";
import * as userService from "../services/users";
import * as sessionService from "../services/login";
import { useState } from "react";

export const useNotify = () => {

	const {notifications, triggerNotification} = useContext(NotificationContext);

	return {
		confirm: {

			success (message, timeout) {

				console.log(message);

				if (!notifications.some(item => item.message === message))
					triggerNotification(message.toString(), { type: "success", timeout, confirmation: true });
			},
			error (message, timeout) {

				console.error(message);

				if (!notifications.some(item => item.message === message))
					triggerNotification(message.toString(), { type: "error", timeout, confirmation: true });
			}
		},
		success (message) {

			console.log(message);
			triggerNotification(message.toString(), { timeout: 5000, type: "success" });
		},
		log (message) {

			console.log(message);
			triggerNotification(message.toString(), { timeout: 5000, type: "info" });
		},
		error (message) {

			console.error(message);
			triggerNotification(message.toString(), { timeout: 5000, type: "error" });
		}
	};
};

export const usePost = postId => {

	const queryClient = useQueryClient();
	const notify = useNotify();
	const errorHandler = useErrorHandler();

	const posts = usePostList();

	const post = posts ?.find(item => item.id === postId);

	if (postId && posts && !post)
		throw { status: 204, statusText: "Unknown endpoint" };

	const likeMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.like(id, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );
		},
		onError: errorHandler
	});

	const dislikeMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.dislike(id, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );
		},
		onError: errorHandler
	});

	const commentMutation = useMutation({

		mutationFn: async ({ id, comment, token }) => {

			return await postService.comment(id, { comment }, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );
		},
		onError: errorHandler
	});

	const removeMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.remove(id, token);
		},
		onSuccess: () => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.filter(item => item.id !== postId) );

			notify.log("Post was successfully deleted!");
		},
		onError: errorHandler
	});

	const resetCommentsMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.resetComments(id, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );

			notify.log("Comments were successfully reseted!");
		},
		onError: errorHandler
	});

	return [
		post,
		{
			like (data) {
				likeMutation.mutate(data);
			},
			dislike (data) {
				dislikeMutation.mutate(data);
			},
			comment (data) {
				commentMutation.mutate(data);
			},
			remove (data) {
				removeMutation.mutate(data);
			},
			resetComments (data) {
				resetCommentsMutation.mutate(data);
			}
		}
	];
};

export const usePostList = () => {

	const posts = useQuery({

		queryKey: ["posts"],
		queryFn: postService.getAll,
		refetchOnWindowFocus: false,
		throwOnError: true

	}).data;

	return posts;
};

export const useUsers = id => {

	const users = useQuery({
		
		queryKey: ["users"],
		queryFn: userService.getAll,
		refetchOnWindowFocus: false
	}).data;

	const user = users ?.find(item => item.id === id);

	const errorHandler = useErrorHandler();

	useEffect(() => {

		if (id && users && !user)
			errorHandler(204);

	});

	return id ? user : users;
};

export const useErrorHandler = () => {

	const notify = useNotify();

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
				//dispatch(logoutUser());
				return;
			}

			if (e.data.error.includes("token has expired")) {

				notify.confirm.error("Your login session passed over, please log in again");
				//dispatch(logoutUser());
				return;
			};

			notify.error("Wrong credentials!");
			return;
		}
	};
};

export const useSession = () => {

	const queryClient = useQueryClient();
	const errorHandler = useErrorHandler();
	const notify = useNotify();

	const stored = JSON.parse(window.localStorage.getItem("session"));

	const [status, setStatus] = useState(stored ?.token ? "stored" : "empty");

	const session = useQuery({

			queryKey: ["session"],
			queryFn: async () => {
				try {

					return await sessionService.check(stored.token + "1");
				} catch (e) {
					setStatus("empty");
					errorHandler(e);
				}
			},
			retry: false,
			enabled: !queryClient.getQueryData(["session"]) && status === "stored"
		});

	const loginMutation = useMutation({
		mutationFn: async credits => {

			await new Promise(resolve => setTimeout(() => resolve(), 3000));

			return await sessionService.login(credits);
		},
		onSuccess: async session_ => {

			queryClient.setQueryData(["session"], session_);
			window.localStorage.setItem("session", JSON.stringify( session_ ));

			notify.success("You've logged in successfully!");
		},
		onError: e => {

			errorHandler(e);
			setStatus("empty");
		}
	});

	return [
		{
			data: session ?.data ?? stored,
			status
		},
		{
			login (username, password) {

				loginMutation.mutate({ username, password });
				setStatus("fetching");
			},
			logout () {

				window.localStorage.removeItem("session");
				setStatus("empty");
			}
		}
	];
};