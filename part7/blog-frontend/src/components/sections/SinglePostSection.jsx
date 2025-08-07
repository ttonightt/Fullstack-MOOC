import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../reducers/postReducer";
import { useEffect } from "react";
import { Avatar, Container, AvatarGroup, Button } from "@mui/material";
import { Link } from "react-router-dom";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";


const SinglePostSection = ({ id }) => {

	const seshUser = useSelector(state => state.session)?.user;

	const post = useSelector(state => state.posts.find(item => item.id === id));
	const dispatch = useDispatch();

	useEffect(() => {

		if (!post)
			dispatch(fetchPosts());
	}, []);

	const handleLike = () => {};

	const likable = !!seshUser;
	const liked = likable ? post.likes.some(item => item.id === seshUser.id) : false;

	if (post) {

		return (
			<Container maxWidth="sm">
				<Link to="/posts">
					<Button><ArrowBackIosRoundedIcon/></Button>
				</Link>
				<h2>{post.title}</h2>
				<h4>
					<i>by</i> <Avatar alt={post.user.username} src={`/public/avatars/${post.user.id}.png`} />

					{post.likes.length}
					<AvatarGroup max={4} spacing={24}>
						{
							post.likes.map(item => 
								<Avatar key={item.id} alt={item.username} src={`/public/avatars/${item.id}.png`} />
							)
						}
					</AvatarGroup>
					<Button onClick={handleLike} data-testid="like-button">{liked ? "🩶" : "❤️"}</Button>
				</h4>
				<hr />
				<p>Lorem ipsum dolor sit amet...</p>
			</Container>
		);
	} else {
		return "Loading...";
	}
};

export default SinglePostSection;