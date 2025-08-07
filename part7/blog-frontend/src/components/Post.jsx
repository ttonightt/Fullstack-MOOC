import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { TableRow, TableCell, Button, Grid, Paper, AvatarGroup, Avatar } from '@mui/material';


export const Post = ({ post }) => {

	const seshUser = useSelector(state => state.session)?.user;
	const dispatch = useDispatch();

	const { id } = post;

	const handleDelete = () => {

		if (!confirm(`Are you sure deleting "${post.title}" by ${post.author}?`)) return;

		dispatch(removePost({id, token: user.token}))
			.unwrap()
			.then(() => {

				notify.log("Post was successfully deleted!");
			})
			.catch(e => {

				console.error(e);

				if (e.data.error.includes("invalid token")) {

					if (confirm("Invalid token. Would you like to start new user session?"))
						handleLogout();

				} else if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();
				}
			});
	};

	const handleLike = () => {
		(
			liked
			?
			dispatch(dislikePost({id, token: user.token}))
			:
			dispatch(likePost({id, token: user.token}))
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
	
	const likable = !!seshUser;
	const liked = likable ? post.likes.some(item => item.id === sesh.user.id) : false;

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
				<Button onClick={handleLike} data-testid="like-button">{liked ? "🩶" : "❤️"}</Button>
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