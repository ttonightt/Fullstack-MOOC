import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button, AvatarGroup, Avatar, Stack, Card, Box, Typography, IconButton } from '@mui/joy';
import { dislikePost, likePost } from "../reducers/postReducer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";


export const Post = ({ post }) => {

	const seshUser = useSelector(state => state.session)?.user;
	const dispatch = useDispatch();

	const { id } = post;
	
	const interactive = !!seshUser;
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

	return (
		<Card size="sm" sx={{ marginBottom: "1em", pl: "1.25em" }}>
			<Stack direction="row" sx={{ flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center" }}>
				<Typography
					textOverflow="ellipsis"
					noWrap
					level="h4"
					fontWeight="md"
					flexGrow={1}
					pr="0.5em"
				>
					<Link to={post.id}>
						{post.title}
					</Link>
				</Typography>
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
								<Avatar size="sm" key={item.id} alt={item.username} src={`/public/avatars/${item.id}.png`} />
							)
						}
					</AvatarGroup>
					<IconButton variant="soft" color="danger" disabled={!interactive} onClick={handleLike}>
						{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				</Stack>
			</Stack>
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<Typography level="body-sm" fontStyle="italic" lineHeight="1em">by</Typography>
				<Avatar size="sm" alt={post.user.username} src={`/public/avatars/${post.user.id}.png`} />
				<Typography level="body-sm" lineHeight="1em">@{post.user.username}</Typography>
			</Stack>
			{/*<Grid size="grow">
				<Paper>
					<Link to={post.id}>
						<h3>{post.title}</h3>
					</Link>
					<Avatar key={post.user.id} alt={post.user.username} src={`/public/avatars/${post.user.id}.png`} />
					{post.user.name}
				</Paper>
			</Grid>
			<Grid size="auto">
				<Paper>
					{post.likes.length}
					<AvatarGroup max={4} spacing={24}>
						{
							post.likes.map(item => 
								<Avatar key={item.id} alt={item.username} src={`/public/avatars/${item.id}.png`} />
							)
						}
					</AvatarGroup>
				</Paper>
			</Grid>
			<Grid size="auto">
				<Button onClick={handleLike} data-testid="like-button" disabled={!interactive}>{liked ? "🩶" : "❤️"}</Button>
			</Grid>*/}
		</Card>
	);
};