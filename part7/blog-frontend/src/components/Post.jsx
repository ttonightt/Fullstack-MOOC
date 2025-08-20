import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AvatarGroup, Avatar, Stack, Card, Box, Typography, IconButton } from '@mui/joy';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useErrorHandler, usePost } from "../hooks";


export const Post = ({ id }) => {

	const session = useSelector(state => state.session);
	
	const [post, service] = usePost(id);
	
	const interactive = session.status === "stored";
	const liked = interactive ? post.likes.some(item => item.id === session.data.user.id) : false;

	const handleLike = () => {

		if (!interactive) return;

		if (liked) {

			service.dislike({id, token: session.data.user.token});
		} else
			service.like({id, token: session.data.user.token});
	};

	return (
		<Card size="sm" sx={{ marginBottom: "1em", pl: "1.25em" }} data-testid=".postlist-post">
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
							<Avatar data-testid="post-like-user" size="sm">
								+{post.likes.length - 4}
							</Avatar>
						}
						{
							post.likes.slice(0, Math.min(4, post.likes.length)).map(item => 
								<Avatar data-testid="post-like-user" size="sm" key={item.id} alt={item.username} src={`/public/avatars/${item.username}.png`} />
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