import { useState, useEffect, useRef } from "react";
import { Blog } from "./components/Blog";
import { LoginForm } from "./components/LoginForm";
import { PostForm } from "./components/PostForm";
import { useNotification } from "./notification";
import { NotificationBody } from "./NotificationBody";
import { Togglable } from "./components/Togglable";

import { Container } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser, fetchUser } from "./reducers/userReducer";
import { fetchPosts, likePost } from "./reducers/postReducer";

import blogService from "./services/blogs";


const App = () => {
	const user = useSelector(state => state.user);
	const posts = useSelector(state => state.posts);
	const dispatch = useDispatch();

	const [notification, notify] = useNotification();

	const togglableRef = useRef();

	const toggleVisibility = () => {

		togglableRef.current.toggleVisibility();
	};

	useEffect(() => {

		dispatch(fetchPosts());
	}, []);

	const logInfo = (...messages) => {

		notify({
			type: "log",
			timeout: 5000,
			messages
		});

		console.log(...messages);
	};

	const logError = (...messages) => {

		notify({
			type: "error",
			timeout: 5000,
			messages
		});

		console.error(...messages);
	};

	const handleLogin = (username, password) => {

		dispatch(fetchUser({username, password}))
			.unwrap()
			.then(() => {

				logInfo("You logged in successfully!");
			})
			.catch(e => {

				if (e.status === 401)
					logError("Wrong credentials!");
			});
	};

	const handleSavePost = ({title, author, url}) => {

		//blogService
		//	.create({title, author, url}, user.token)
		//	.then(post => {

		//		setPosts(posts.concat(post));
		//		logInfo("You added the post:", post.title, "by", post.author);

		//		toggleVisibility();
		//	})
		//	.catch(err => {

		//		if (err.response.data.error.includes("token has expired")) {

		//			alert("Your session seems to be expired, please log in again");
		//			handleLogout();

		//		} else
		//			console.error(err);
		//	});
	};

	const handleLogout = () => {

		dispatch(logoutUser());
	};

	const handleDelete = id => {

		//blogService
		//	.remove(id, user.token)
		//	.then(() => {

		//		setPosts(posts.filter(post => post.id !== id));

		//		logInfo("Post was successfully deleted!");
		//	})
		//	.catch(err => {

		//		if (err.response.data.error.includes("invalid token")) {

		//			alert("Invalid token");
		//			handleLogout();

		//		} else if (err.response.data.error.includes("token has expired")) {

		//			alert("Your session seems to be expired, please log in again");
		//			handleLogout();

		//		} else
		//			console.error(err);
		//	});
	};

	const handleLike = id => {

		dispatch(likePost({id, token: user.token}))
			.unwrap()
			.catch(err => {

				//if (err.data.error.includes("invalid token")) {

				//	alert("Invalid token, please log in");
				//	handleLogout();

				//} else if (err.data.error.includes("token has expired")) {

				//	alert("Your session seems to be expired, please log in again");
				//	handleLogout();

				//} else
					console.error(err);
			});
	};

	if (user) {
		return (
			
			<Container>
				<h2>
					Blogs of <i>{user.name}</i>&nbsp;
					<button onClick={handleLogout}>Log out</button>
				</h2>
				<Togglable ref={togglableRef} buttonLabel="New Post">
					<PostForm onSubmit={handleSavePost} />
				</Togglable>
				<Blog posts={posts} user={user} onDelete={handleDelete} onLike={handleLike} />
				<NotificationBody ofNotification={notification}/>
			</Container>
		);
	} else
		return (<>
			<div>
				<h2>Login</h2>
				<LoginForm onSubmit={handleLogin} />
				<NotificationBody ofNotification={notification}/>
			</div>
			<p>
				<i>* Login session lasts for 15 minutes only!</i>
			</p>
		</>);
};

export default App;