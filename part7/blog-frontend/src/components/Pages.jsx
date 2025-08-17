import { Link, useNavigate, useParams, useRouteError } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/joy";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import LoginSection from "./sections/LoginSection";
import UserListSection from "./sections/UserListSection";
import PostListSection from "./sections/PostListSection";
import SingleUserSection from "./sections/SingleUserSection";
import SinglePostSection from "./sections/SinglePostSection";
import NewPostSection from "./sections/NewPostSection";
import { useSelector } from "react-redux";
import { useEffect } from "react";


export const Root = () => {

	const session = useSelector(state => state.session);

	const navigate = useNavigate();

	useEffect(() => {

		if (session.status === "stored") {
	
			navigate("/posts");
		} else {
			navigate("/login");
		}
	});
};

export const ErrorPage = () => {

	const err = useRouteError();

	return (
		<Stack direction="column" sx={{ alignItems: "center", justifyContent: "center", height: "60vh" }}>
			<Typography level="h1" fontSize="4rem">{err.status || "Unknown Error"}</Typography>
			<Typography level="h4">{err.statusText}</Typography>
			<Link to="/">
				<Button variant="soft" size="sm" sx={{ mt: "1em" }} endDecorator={<ArrowOutwardIcon fontSize="small" />}>Home Page</Button>
			</Link>
		</Stack>
	);
};

export const UserList = () => (
	<Box sx={{ width: "60vw" }}>
		<UserListSection/>
	</Box>
);

export const PostList = () => (
	<Box sx={{ width: "60vw" }}>
		<NewPostSection/>
		<PostListSection/>
	</Box>
);

export const UserProfile = () => {

	const { id } = useParams();

	return (
		<Box sx={{ width: "60vw" }}>
			<SingleUserSection id={id} />
		</Box>
	);
};

export const Post = () => {

	const { id } = useParams();

	console.log("Pages.Post");

	return (
		<Box sx={{ width: "60vw" }}>
			<SinglePostSection id={id} />
		</Box>
	);
};

export const Login = () => <LoginSection/>;