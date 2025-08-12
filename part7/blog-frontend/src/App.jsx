import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNotify } from "./hooks";
import { Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";

import { logoutUser, checkUser } from "./reducers/seshReducer";
import { fetchPosts, createPost, likePost, dislikePost, removePost } from "./reducers/postReducer";

import { Button, ButtonGroup, Sheet, Stack, Typography, Avatar, Box } from "@mui/joy";

import * as Pages from "./components/Pages";


const tabs = [
	{title: "Posts", url: "/posts"},
	{title: "Users", url: "/users"}
];

const App = () => {

	const seshUser = useSelector(state => state.session)?.user;
	const dispatch = useDispatch();

	const notify = useNotify();

	const location = useLocation();

	useEffect(() => {

		if (seshUser)
			dispatch(checkUser());
	}, []);

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

	return (
		<Stack direction="column" sx={{ minHeight: "60vh", "& a": { color: "inherit", textUnderlineOffset: "0.15em", textDecorationThickness: "1px" } }}>
			<Sheet sx={{ p: "1em" }}>
				<Stack direction="row" sx={{ height: "3em", justifyContent: "space-between", alignItems: "center" }}>
					<Typography level="h4" fontWeight="xl">Catcity Blog</Typography>
					<ButtonGroup>
					{
						tabs.map((item) =>
							<Link key={item.title} to={item.url}>
								<Button size="md" variant="soft"
									color={item.url.startsWith(location.pathname) ? "primary" : "neutral"}
								>{item.title}</Button>
							</Link>
						)
					}
					</ButtonGroup>
					<Box>
					{
						seshUser
						?
						(<Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
							<Avatar alt={seshUser.username} src={`/public/avatars/${seshUser.id}.png`} />
							<Box>
								<Typography lineHeight="1.25em" level="body-sm" fontWeight="lg">{seshUser.name}</Typography>
								<Typography lineHeight="1.25em" level="body-sm">@{seshUser.username}</Typography>
							</Box>
							<Button onClick={handleLogout}>Log Out</Button>
						</Stack>)
						:
						<Link to="/login">
							<Button>Log In</Button>
						</Link>
					}
					</Box>
				</Stack>
			</Sheet>

			<Stack sx={{ py: "2em", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
				<Routes>
					{/*<Route path="/" element={} />*/}
					<Route path="/login" element={<Pages.Login/>} />
					<Route path="/users" element={<Pages.UserList/>} />
					<Route path="/posts" element={<Pages.PostList/>} />
					<Route path="/users/:id" element={<Pages.UserProfile/>} />
					<Route path="/posts/:id" element={<Pages.Post/>} />
				</Routes>
			</Stack>
		</Stack>
	);
};

export default App;