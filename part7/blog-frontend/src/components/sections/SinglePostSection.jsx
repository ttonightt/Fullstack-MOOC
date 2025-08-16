import { useDispatch, useSelector } from "react-redux";
import { commentPost, dislikePost, fetchPosts, likePost } from "../../reducers/postReducer";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import PostContextMenu from "../PostContextMenu";
import { useState } from "react";
import { Avatar, AvatarGroup, Box, Button, Card, Divider, IconButton, Input, LinearProgress, Stack, Textarea, Typography } from "@mui/joy";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useErrorHandler, useNotify, usePosts } from "../../hooks";


const SinglePostSection = ({ id }) => {

	const session = useSelector(state => state.session);

	const [comment, setComment] = useState("");

	const dispatch = useDispatch();
	const errorHandler = useErrorHandler();

	const post = usePosts(id);

	const handleComment = () => {

		dispatch(commentPost({ id, token: session.data.user.token, comment }))
			.unwrap()
			.catch(errorHandler);

		setComment("");
	};

	const interactive = session.status === "stored" && post;
	const liked = interactive ? post.likes.some(item => item.id === session.data.user.id) : false;

	const handleLike = () => {
		(
			liked
			?
			dispatch(dislikePost({id, token: session.data.user.token}))
			:
			dispatch(likePost({id, token: session.data.user.token}))
		)
			.unwrap()
			.catch(errorHandler);
	};

	const postable = session.status === "stored" && comment.length > 0;

	if (post === null) {

		return <LinearProgress color="primary" size="sm" value={25} variant="soft" />;
	}

	if (post === undefined) {

		return;
	}

	return (
		<Stack direction="column" spacing={2}>
			<Card variant="soft" size="lg" sx={{ gap: "0.4em" }}>
				<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "start" }}>
					<Box>
						<Typography level="h3">
							{post.title}
						</Typography>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<Typography level="body-md">
								{post.author}  /
							</Typography>
							<Typography level="body-sm" fontStyle="italic" lineHeight="1em">Posted by</Typography>
							<Avatar size="sm" alt={post.user.username} src={`/public/avatars/${post.user.username}.png`} />
							<Link to={`/users/${post.user.id}`}>
								<Typography level="body-sm" lineHeight="1em">@{post.user.username}</Typography>
							</Link>
						</Stack>
					</Box>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center", pl: "1.5em" }}>
						<AvatarGroup spacing={24} sx={{ flexDirection: 'row-reverse' }}>
							{
								post.likes.length > 4
								&&
								<Avatar size="sm">
									+{post.likes.length - 4}
								</Avatar>
							}
							{
								post.likes.slice(0, Math.min(4, post.likes.length)).map(item => 
									<Avatar size="sm" key={item.id} alt={item.username} src={`/public/avatars/${item.username}.png`} />
								)
							}
						</AvatarGroup>
						<IconButton variant="plain" color="danger" disabled={!interactive} onClick={handleLike}>
							{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
						<PostContextMenu id={post.id} />
					</Stack>
				</Stack>
				<Typography level="body-lg" mt="0.5em">
					{post.content}
				</Typography>
			</Card>
			<Card variant="soft" color="warning" sx={{ p: 0, gap: 0 }}>
				<Stack direction="row">
					<Typography level="h4" color="warning" p="0.75em 1em 0.25em 1em" flexGrow={1}>Share your point...</Typography>
					<Button variant={postable ? "solid" : "plain"} disabled={!postable} sx={{ m: "0.4em" }} color="warning" onClick={handleComment}>Comment</Button>
				</Stack>
				<Textarea
					minRows={2}
					variant="soft"
					color="warning"
					placeholder="I think..."
					sx={{ pl: "1.25em", boxShadow: "none" }}
					value={comment}
					onChange={e => setComment(e.target.value)}
				/>
			</Card>
			<Card variant="plain" sx={{ p: "0.5em 1.25rem" }}>
				{
					post.comments.length === 0
					?
					<Typography level="body-md">No comments</Typography>
					:
					post.comments.map((item, i) => (
						<Box key={i}>
							<Typography level="body-md">{item}</Typography>
							<Divider />
						</Box>
					))
				}
			</Card>
		</Stack>
	);
};

export default SinglePostSection;