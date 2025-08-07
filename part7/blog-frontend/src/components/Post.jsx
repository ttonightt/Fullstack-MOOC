import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { TableRow, TableCell, Button, Grid, Paper, AvatarGroup, Avatar } from '@mui/material';


export const Post = ({ post }) => {

	const user = useSelector(state => state.user);
	const dispatch = useDispatch();

	const { id } = post;

	const likedByUser = user ? post.likes.some(item => item.id === user.id) : false;

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

	return (<>
		<Grid container size={12}>
			<Grid size="grow">
				<Paper>
					<Link to={post.id}>
						{post.title}
					</Link>
				</Paper>
			</Grid>
			<Grid size="auto">
				<Paper>
					<i>by</i> {post.author}
				</Paper>
			</Grid>
			<Grid size="auto">
				<Paper>
					{post.likes.length}
					<AvatarGroup max={4} spacing={24}>
						{
							post.likes.map(item => 
								<Avatar key={item.id} alt={item.username} src={`../public/avatars/${item.id}.png`} />
							)
						}
					</AvatarGroup>
					<b>{post.likes.length} {post.likes.reduce((str, item) => str + " " + item.name[0], "")}</b>
				</Paper>
			</Grid>
			<Grid size="auto">
				<Button onClick={handleLike} data-testid="like-button">{likedByUser ? "🩶" : "❤️"}</Button>
			</Grid>
			{/*<TableRow>
				<TableCell colSpan={4}>
				{
					(user && post.user.username === user.username) && <Button onClick={handleDelete}>Delete</Button>
				}
				</TableCell>
			</TableRow>*/}
		</Grid>
	</>);
};