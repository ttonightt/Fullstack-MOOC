import { useParams } from "react-router-dom";
import { Box } from "@mui/joy";

import LoginSection from "./sections/LoginSection";
import UserListSection from "./sections/UserListSection";
import PostListSection from "./sections/PostListSection";
import SingleUserSection from "./sections/SingleUserSection";
import SinglePostSection from "./sections/SinglePostSection";
import NewPostSection from "./sections/NewPostSection";


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

	return (
		<Box sx={{ width: "60vw" }}>
			<SinglePostSection id={id} />
		</Box>
	);
};

export const Login = () => <LoginSection/>;