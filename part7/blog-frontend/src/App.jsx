import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNotify } from "./hooks";
import { Route, Routes, Link, useNavigate } from "react-router-dom";

import { logoutUser, loginUser, checkUser } from "./reducers/seshReducer";
import { fetchPosts, createPost, likePost, dislikePost, removePost } from "./reducers/postReducer";

import { Avatar, Box, Button, Container } from "@mui/material";

import Pages from "./components/Pages";


const App = () => {

	const seshUser = useSelector(state => state.session)?.user;
	const dispatch = useDispatch();

	const notify = useNotify();

	useEffect(() => {

		if (seshUser)
			dispatch(checkUser());
	}, []);

	//const handleSavePost = post => {

	//	dispatch(createPost({post, token: user.token}))
	//		.then(post_ => {

	//			notify.log("You added the post");

	//			toggleVisibility();
	//		})
	//		.catch(e => {

	//			if (e.data.error.includes("token has expired")) {

	//				alert("Your session seems to be expired, please log in again");
	//				handleLogout();

	//			} else
	//				console.error(e);
	//		});
	//};

	const handleLogout = () => {

		dispatch(logoutUser());
	};

	return (
		<Box color="primary">
			<header>
				<Link to="/posts">Posts</Link>
				<Link to="/users">Users</Link>
				{
					seshUser
					?
					(<>
						<Avatar alt={seshUser.username} src={`/public/avatars/${seshUser.id}.png`} />
						<h5>{seshUser.username}</h5>
						<Button>Log Out</Button>
					</>)
					:
					<Link to="/login">
						<Button>Log In</Button>
					</Link>
				}
			</header>
			<Container maxWidth="md">
				<Routes>
					{/*<Route path="/" element={} />*/}
					<Route path="/login" element={<Pages.Login/>} />
					<Route path="/users" element={<Pages.UserList/>} />
					<Route path="/posts" element={<Pages.PostList/>} />
					<Route path="/users/:id" element={<Pages.UserProfile/>} />
					<Route path="/posts/:id" element={<Pages.Post/>} />
				</Routes>
			</Container>
		</Box>
	);
};

export default App;