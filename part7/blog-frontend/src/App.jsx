import { useState, useEffect, useRef } from "react";
import { Blog } from "./components/Blog";
import { LoginForm } from "./components/LoginForm";
import { PostForm } from "./components/PostForm";
import { useNotify } from "./hooks";
import { Togglable } from "./components/Togglable";

import { Container } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser, loginUser, checkUser } from "./reducers/loginReducer";
import { fetchPosts, createPost, likePost, dislikePost, removePost } from "./reducers/postReducer";


const App = () => {
	const user = useSelector(state => state.user);
	const posts = useSelector(state => state.posts);
	const dispatch = useDispatch();

	const notify = useNotify();

	const togglableRef = useRef();

	const toggleVisibility = () => {

		togglableRef.current.toggleVisibility();
	};

	useEffect(() => {

		if (user !== null)
			dispatch(checkUser());
	}, []);

	useEffect(() => {

		if (user !== null)
			dispatch(fetchPosts());
	}, [user]);

	const handleLogin = (username, password) => {

		dispatch(loginUser({username, password}))
			.unwrap()
			.then(() => {

				notify.log("You logged in successfully!");
			})
			.catch(e => {

				if (e.status === 401)
					notify.error("Wrong credentials!");
			});
	};

	const handleSavePost = post => {

		dispatch(createPost({post, token: user.token}))
			.then(post_ => {

				notify.log("You added the post");

				toggleVisibility();
			})
			.catch(e => {

				if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();

				} else
					console.error(e);
			});
	};

	const handleLogout = () => {

		dispatch(logoutUser());
	};

	const handleDelete = id => {

		dispatch(removePost({id, token: user.token}))
			.unwrap()
			.then(() => {

				notify.log("Post was successfully deleted!");
			})
			.catch(e => {

				console.error(e);

				if (e.data.error.includes("invalid token")) {

					if (confirm("Invalid token. Would you like to start new user session?"))
						handleLogout();

				} else if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();
				}
			});
	};

	const handleLike = (id, liked) => {
		(
			liked
			?
			dispatch(dislikePost({id, token: user.token}))
			:
			dispatch(likePost({id, token: user.token}))
		)
			.unwrap()
			.catch(e => {

				console.error(e);

				if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();

				}
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
			</Container>
		);
	} else
		return (<>
			<div>
				<h2>Login</h2>
				<LoginForm onSubmit={handleLogin} />
			</div>
			<p>
				<i>* Login session lasts for 15 minutes only!</i>
			</p>
		</>);
};

export default App;