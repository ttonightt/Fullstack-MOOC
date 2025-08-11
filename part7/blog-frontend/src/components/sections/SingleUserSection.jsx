import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../../reducers/userReducer";
import { Avatar, Box, Button, Container, List, ListItem, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";


const SingleUserSection = ({ id }) => {

	const user = useSelector(state => state.users.find(item => item.id === id));
	const dispatch = useDispatch();

	useEffect(() => {

		if (!user) 
			dispatch(fetchUserList());
	}, []);

	if (user) {

		return (
			<Container maxWidth="sm">
				<Avatar sx={{ width: 100, height: 100 }} alt={user.username} src={`/public/avatars/${user.id}.png`} />
				<h2 style={{display: "inline"}}>{user.name}</h2>  <i>@{user.username}</i>

				<hr />
				<h2>{user.posts.length} {user.posts.length === 1 ? "Post" : "Posts"}</h2>
				{user.posts.map(post => 

					<Link to={`/posts/${post.id}`} key={post.id}>
						<Paper>
							<h4>{post.title}</h4>
						</Paper>
					</Link>
				)}
			</Container>
		);
	} else {
		return "Loading...";
	}
};

export default SingleUserSection;