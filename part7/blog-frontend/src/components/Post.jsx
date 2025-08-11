import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { TableRow, TableCell, Button, Grid, Paper, AvatarGroup, Avatar } from '@mui/material';
import { dislikePost, likePost } from "../reducers/postReducer";


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
		<Grid container size={12}>
			<Grid size="grow">
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
			</Grid>
			{/*<TableRow>
				<TableCell colSpan={4}>
				{
					(user && post.user.username === user.username) && <Button onClick={handleDelete}>Delete</Button>
				}
				</TableCell>
			</TableRow>*/}
		</Grid>
	);
};