import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../../reducers/userReducer";
import { Avatar, Box, Button, Container, List, ListItem, Paper } from "@mui/material";
import { Link } from "react-router-dom";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

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
				<h2>{user.username}</h2>
				<Avatar sx={{ width: 100, height: 100 }} alt={user.username} src={`/public/avatars/${user.id}.png`} />
				<hr />
				<h2>{user.posts.length} Posts</h2>
				{user.posts.map(post => 

					<Link to={`/posts/${post.id}`} key={post.id}>
						<Paper>
							{post.title} <i>— {post.author}</i>
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