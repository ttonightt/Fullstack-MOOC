import { useState } from "react";
import PropTypes from "prop-types";

import { TableRow, TableCell, Button } from '@mui/material';


export const Post = ({ post, user, id, onDelete, onLike }) => {
	
	const [visibility, setVisibility] = useState(false);

	const toggleVisibility = () => setVisibility(!visibility);

	const handleDelete = () => {

		if (!confirm(`Are you sure deleting "${post.title}" by ${post.author}?`)) return;

		onDelete(post.id);
	};

	const likedByUser = post.likes.some(item => item.id === user.id);

	return (<>
		<TableRow>
			<TableCell>{id}</TableCell>
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
				<Button onClick={() => onLike(post.id, likedByUser)} data-testid="like-button">{likedByUser ? "🩶" : "❤️"}</Button>
			</TableCell>
			<TableCell>
				<Button onClick={toggleVisibility} data-testid="toggle-button">{visibility ? "Hide" : "Show"}</Button>
			</TableCell>
		</TableRow>
		{
			visibility && (<>
				<TableRow className="url">
					<TableCell></TableCell>
					<TableCell colSpan={6}><u>URL:</u> {post.url}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell colSpan={6}>
					{
						(post.user.username === user.username) && <Button onClick={handleDelete}>Delete</Button>
					}
					</TableCell>
				</TableRow>
			</>)
		}
	</>);
};

Post.propTypes = {
	post: PropTypes.object.isRequired,
	id: PropTypes.number,
	onDelete: PropTypes.func,
	onLike: PropTypes.func
};