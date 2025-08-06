import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNotify } from "./hooks";
import { Route, Routes } from "react-router-dom";

import { logoutUser, loginUser, checkUser } from "./reducers/loginReducer";
import { fetchPosts, createPost, likePost, dislikePost, removePost } from "./reducers/postReducer";

import { Container } from "@mui/material";


import LoginSection from "./components/sections/LoginSection";
import SignupSection from "./components/sections/SignupSection";
import UserListSection from "./components/sections/UserListSection";
import PostListSection from "./components/sections/PostListSection";
import SingleUserSection from "./components/sections/SingleUserSection";
import SinglePostSection from "./components/sections/SinglePostSection";
import NewPostSection from "./components/sections/NewPostSection";


const App = () => {
	const user = useSelector(state => state.user);
	const posts = useSelector(state => state.posts);
	const dispatch = useDispatch();

	const notify = useNotify();

	useEffect(() => {

		if (user !== null)
			dispatch(checkUser());
	}, []);

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

	return (<>
		<header>{user ? user.name : "Loading..."}</header>
		<Container>
			<Routes>
				{/*<Route path="/" element={} />*/}
				<Route path="/login" element={<LoginSection/>} />
				<Route path="/signup" element={<SignupSection/>} />
				<Route path="/users" element={<UserListSection/>} />
				<Route path="/posts" element={<PostListSection/>} />
				<Route path="/users/:id" element={(<>
					<SingleUserSection/>
					<PostListSection/>
				</>)} />
				<Route path="/posts/:id" element={<SinglePostSection/>} />
				<Route path="/new-post" element={<NewPostSection/>} />
			</Routes>
		</Container>
	</>);

	//if (user) {
	//	return (
			
	//		<Container>
	//			<h2>
	//				Blogs of <i>{user.name}</i>&nbsp;
	//				<button onClick={handleLogout}>Log out</button>
	//			</h2>
	//			<Togglable ref={togglableRef} buttonLabel="New Post">
	//				<PostForm onSubmit={handleSavePost} />
	//			</Togglable>
	//			<Blog posts={posts} user={user} onDelete={handleDelete} onLike={handleLike} />
	//		</Container>
	//	);
	//} else
	//	return (<>
	//		<div>
	//			<h2>Login</h2>
	//			<LoginForm onSubmit={handleLogin} />
	//		</div>
	//		<p>
	//			<i>* Login session lasts for 15 minutes only!</i>
	//		</p>
	//	</>);
};

export default App;