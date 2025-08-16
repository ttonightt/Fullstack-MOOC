import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button, AvatarGroup, Avatar, Stack, Card, Box, Typography, IconButton } from '@mui/joy';
import { dislikePost, likePost } from "../reducers/postReducer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useErrorHandler } from "../hooks";


export const Post = ({ post }) => {

	const session = useSelector(state => state.session);
	const dispatch = useDispatch();

	const errorHandler = useErrorHandler();

	const { id } = post;
	
	const interactive = session.status === "stored";
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

	return (
		<Card size="sm" sx={{ marginBottom: "1em", pl: "1.25em" }}>
			<Stack direction="row" sx={{ flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center" }}>
				<Typography
					textOverflow="ellipsis"
					noWrap
					level="h4"
					fontWeight="md"
					display="inline"
				>
					<Link to={post.id}>
						{post.title}
					</Link>
				</Typography>
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
				</Stack>
			</Stack>
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
		</Card>
	);
};