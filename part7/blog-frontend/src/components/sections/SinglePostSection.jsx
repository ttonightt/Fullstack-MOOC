import { useDispatch, useSelector } from "react-redux";
import { commentPost, dislikePost, fetchPosts, likePost } from "../../reducers/postReducer";
import { useEffect } from "react";
import { Avatar, Container, AvatarGroup, Button, TextField, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import PostContextMenu from "../PostContextMenu";
import { useState } from "react";


const SinglePostSection = ({ id }) => {

	const seshUser = useSelector(state => state.session)?.user;

	const [comment, setComment] = useState();

	const post = useSelector(state => state.posts.find(item => item.id === id));
	const dispatch = useDispatch();

	useEffect(() => {

		if (!post)
			dispatch(fetchPosts());
	}, []);

	const handleComment = () => {

		dispatch(commentPost({ id, token: seshUser.token, comment }))
			.unwrap()
			.catch(e => {

				console.error(e);

				if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();
				}
			});

		setComment("");
	};

	const interactive = seshUser && post;
	const liked = interactive ? post.likes.some(item => item.id === seshUser.id) : false;

	const handleLike = () => {
		(
			liked
			?
			dispatch(dislikePost({id, token: seshUser.token}))
			:
			dispatch(likePost({id, token: seshUser.token}))
		)
			.unwrap()
			.catch(e => {

				console.error(e);

				if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();
				}
			});
	};

	if (post) {

		return (
			<Container maxWidth="sm">
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
					<Button onClick={handleLike} data-testid="like-button" disabled={!interactive}>{liked ? "🩶" : "❤️"}</Button>
					<PostContextMenu id={id} />
				</h4>
				<hr />
				<p>{post.content}</p>
				<hr />
				<Grid container>
					<Grid size="grow">
						<TextField
							value={comment}
							onChange={e => setComment(e.target.value)}
							fullWidth
							multiline
							variant="standard"
						/>
					</Grid>
					<Grid size="auto">
						<Button onClick={handleComment}>Share</Button>
					</Grid>
				</Grid>
				{
					post.comments.length === 0
					?
					"No comments"
					:
					post.comments.map((item, i) => <p key={i}>{item}</p>)
				}
			</Container>
		);
	} else {
		return "Loading...";
	}
};

export default SinglePostSection;