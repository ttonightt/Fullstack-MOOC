import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/joy";

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