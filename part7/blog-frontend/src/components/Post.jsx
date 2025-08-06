import { useDispatch, useSelector } from "react-redux";

import { TableRow, TableCell, Button } from '@mui/material';


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
		<TableRow>
			<TableCell className="title">
				{post.title}
			</TableCell>
			<TableCell className="author">
				<i>by</i> {post.author}
			</TableCell>
			<TableCell className="likes" data-testid="likes">
				<b>{post.likes.length} {post.likes.reduce((str, item) => str + " " + item.name[0], "")}</b>
			</TableCell>
			<TableCell>
				<Button onClick={handleLike} data-testid="like-button">{likedByUser ? "🩶" : "❤️"}</Button>
			</TableCell>
		</TableRow>
		<TableRow className="url">
			<TableCell></TableCell>
			<TableCell colSpan={4}><u>URL:</u> {post.url}</TableCell>
		</TableRow>
		<TableRow>
			<TableCell colSpan={4}>
			{
				(user && post.user.username === user.username) && <Button onClick={handleDelete}>Delete</Button>
			}
			</TableCell>
		</TableRow>
	</>);
};