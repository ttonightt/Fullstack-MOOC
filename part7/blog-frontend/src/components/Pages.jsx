import { useParams } from "react-router-dom";

import LoginSection from "./sections/LoginSection";
import UserListSection from "./sections/UserListSection";
import PostListSection from "./sections/PostListSection";
import SingleUserSection from "./sections/SingleUserSection";
import SinglePostSection from "./sections/SinglePostSection";
import NewPostSection from "./sections/NewPostSection";


const UserList = () => <UserListSection/>;

const PostList = () => (<>
	
	<NewPostSection/>
	<PostListSection/>
</>);

const UserProfile = () => {

	const { id } = useParams();

	return <SingleUserSection id={id} />;
};

const Post = () => {

	const { id } = useParams();

	return <SinglePostSection id={id} />
};

const Login = () => <LoginSection/>;

export default {

	UserList,
	PostList,
	UserProfile,
	Post,
	Login
};