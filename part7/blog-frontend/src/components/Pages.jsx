import { useParams } from "react-router-dom";
import { Box } from "@mui/joy";

import LoginSection from "./sections/LoginSection";
import UserListSection from "./sections/UserListSection";
import PostListSection from "./sections/PostListSection";
import SingleUserSection from "./sections/SingleUserSection";
import SinglePostSection from "./sections/SinglePostSection";
import NewPostSection from "./sections/NewPostSection";


export const UserList = () => <UserListSection/>;

export const PostList = () => (
	<Box sx={{ width: "60vw" }}>
		<PostListSection/>
		<NewPostSection/>
	</Box>
);

export const UserProfile = () => {

	const { id } = useParams();

	return <SingleUserSection id={id} />;
};

export const Post = () => {

	const { id } = useParams();

	return <SinglePostSection id={id} />
};

export const Login = () => <LoginSection/>;