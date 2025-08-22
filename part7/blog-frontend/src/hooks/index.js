import { useContext, useEffect } from "react";
import { NotificationContext } from "../components/NotificationProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as postService from "../services/posts";
import * as userService from "../services/users";
import * as sessionService from "../services/login";

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

	const [posts] = usePostList();

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
		}
	});

	const dislikeMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.dislike(id, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );
		}
	});

	const commentMutation = useMutation({

		mutationFn: async ({ id, comment, token }) => {

			return await postService.comment(id, { comment }, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );
		}
	});

	const removeMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.remove(id, token);
		},
		onSuccess: () => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.filter(item => item.id !== postId) );

			notify.log("Post was successfully deleted!");
		}
	});

	const resetCommentsMutation = useMutation({

		mutationFn: async ({ id, token }) => {

			return await postService.resetComments(id, token);
		},
		onSuccess: post_ => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.map(item => item.id === postId ? post_ : item) );

			notify.log("Comments were successfully reseted!");
		}
	});

	useEffect(() => {

		if (likeMutation.isError) errorHandler(likeMutation.error.response);

		if (dislikeMutation.isError) errorHandler(dislikeMutation.error.response);

		if (commentMutation.isError) errorHandler(commentMutation.error.response);

		if (removeMutation.isError) errorHandler(removeMutation.error.response);

		if (resetCommentsMutation.isError) errorHandler(resetCommentsMutation.error.response);
	}, [
		likeMutation.error,
		dislikeMutation.error,
		commentMutation.error,
		removeMutation.error,
		resetCommentsMutation.error
	]);

	return [
		post,
		{
			like (data) {
				return likeMutation.mutateAsync(data);
			},
			dislike (data) {
				return dislikeMutation.mutateAsync(data);
			},
			comment (data) {
				return commentMutation.mutateAsync(data);
			},
			remove (data) {
				return removeMutation.mutateAsync(data);
			},
			resetComments (data) {
				return resetCommentsMutation.mutateAsync(data);
			}
		}
	];
};

export const usePostList = () => {

	const queryClient = useQueryClient();
	const errorHandler = useErrorHandler();
	const notify = useNotify();

	const { data: posts, isError, error } = useQuery({

		queryKey: ["posts"],
		queryFn: postService.getAll,
		refetchOnWindowFocus: false,
		retry: false
	});

	useEffect(() => {

		if (isError) {

			errorHandler(error.response);
		}
	}, [error]);

	const createMutation = useMutation({

		mutationFn: async ({ post, token }) => {

			return await postService.create(post, token);
		},
		onSuccess: post => {

			const _posts = queryClient.getQueryData(["posts"]);

			queryClient.setQueryData( ["posts"], _posts.concat(post) );

			notify.log("Post was added");
		}
	});

	useEffect(() => {

		if (createMutation.isError) {

			errorHandler(createMutation.error.response);
		}
	}, [createMutation.error]);

	return [
		posts,
		{
			create (data) {
				return createMutation.mutateAsync(data);
			}
		}
	];
};

export const useUsers = id => {

	const { data: users, isError, error } = useQuery({
		
		queryKey: ["users"],
		queryFn: userService.getAll,
		refetchOnWindowFocus: false,
		retry: false
	});

	const user = users ?.find(item => item.id === id);

	const errorHandler = useErrorHandler();

	useEffect(() => {

		if (isError) {

			errorHandler(error.response);
		}
	}, [error]);

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

			console.error(e);

			if (e.data.error.includes("invalid token")) {

				notify.confirm.error("Invalid user token! Log in again please");
				return;
			}

			if (e.data.error.includes("token has expired")) {

				notify.confirm.error("Your login session passed over, please log in again");
				return;
			}

			notify.error("Wrong credentials!");
			return;
		}

		if (e.status === 404) {

			console.error(e);

			if (e.data.error.includes("invalid token")) {

				notify.confirm.error("Invalid user token! Log in again please");
				return;
			}
		}
	};
};

export const useSession = () => {

	const queryClient = useQueryClient();
	const errorHandler = useErrorHandler();
	const notify = useNotify();

	const stored = JSON.parse(window.localStorage.getItem("session"));

	const sessionState = useQuery({

			queryKey: ["session"],
			queryFn: async () => {
				
				const _session = queryClient.getQueryData(["session"]);

				if (sessionState.data.status !== "stored")
					return _session;

				const data = await sessionService.check(stored.token);

				return { data, status: "stored" };
			},
			initialData: { data: stored, status: stored ?.token ? "stored" : "empty" },
			retry: false,
			staleTime: 2000
		});

	useEffect(() => {

		if (sessionState.isError) {

			const e = sessionState.error.response;

			errorHandler(e);

			if (e.status === 401 || e.status === 401) {

				window.localStorage.removeItem("session");
				queryClient.setQueryData(["session"], { data: null, status: "empty" });
			}
		}
	}, [sessionState.error]);

	const loginMutation = useMutation({

		mutationFn: sessionService.login,
		onMutate: () => {

			const { data } = queryClient.getQueryData(["session"]);

			queryClient.setQueryData(["session"], { data, status: "fetching" });
		},
		onSuccess: session => {

			queryClient.setQueryData(["session"], { data: session, status: "stored" });
			window.localStorage.setItem("session", JSON.stringify( session ));

			notify.success("You've logged in successfully!");
		},
		onError: e => {

			const { data } = queryClient.getQueryData(["session"]);

			queryClient.setQueryData(["session"], { data, status: data ? "stored" : "empty" });
		}
	});

	useEffect(() => {

		if (loginMutation.isError) {

			const e = loginMutation.error.response;

			errorHandler(e);
		}
	}, [loginMutation.error]);

	return [
		sessionState.data,
		{
			login (username, password) {

				return loginMutation.mutateAsync({ username, password });
			},
			logout () {

				window.localStorage.removeItem("session");
				queryClient.setQueryData(["session"], { data: null, status: "empty" });
			}
		}
	];
};