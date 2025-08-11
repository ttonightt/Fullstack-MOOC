import { useParams } from "react-router-dom";

import LoginSection from "./sections/LoginSection";
import UserListSection from "./sections/UserListSection";
import PostListSection from "./sections/PostListSection";
import SingleUserSection from "./sections/SingleUserSection";
import SinglePostSection from "./sections/SinglePostSection";
import NewPostSection from "./sections/NewPostSection";


export const UserList = () => <UserListSection/>;

export const PostList = () => (<>
	
	<PostListSection/>
	<NewPostSection/>
</>);

export const UserProfile = () => {

	const { id } = useParams();

	return <SingleUserSection id={id} />;
};

export const Post = () => {

	const { id } = useParams();

	return <SinglePostSection id={id} />
};

export const Login = () => <LoginSection/>;