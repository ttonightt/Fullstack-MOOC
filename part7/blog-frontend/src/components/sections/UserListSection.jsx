import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchUserList } from "../../reducers/userListReducer";


const UserListSection = () => {

	const userlist = useSelector(state => state.userlist);
	const dispatch = useDispatch();

	useEffect(() => {

		dispatch(fetchUserList());
	}, []);

	if (userlist) {

		return userlist.map(user => (

			<div key={user.id}>
				{user.username} {user.posts.length}
				<ul>
					{user.posts.map(post => 

						<li key={post.id}>{post.title}</li>
					)}
				</ul>
			</div>
		));
	} else {
		return "Loading...";
	}
};

export default UserListSection;