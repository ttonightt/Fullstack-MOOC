import { useState } from "react";
import PropTypes from "prop-types";

export const Post = ({ post, user, id, onDelete, onLike }) => {
	
	const [visibility, setVisibility] = useState(false);

	const toggleVisibility = () => setVisibility(!visibility);

	const handleDelete = () => {

		if (!confirm(`Are you sure deleting "${post.title}" by ${post.author}?`)) return;

		onDelete(post.id);
	};

	return (<>
		<tr>
			<td>{id}</td>
			<td className="title">
				{post.title}
			</td>
			<td className="author">
				<i>by</i> {post.author}
			</td>
			<td className="likes" data-testid="likes">
				<b>{post.likes}</b>
			</td>
			<td>
				<button onClick={() => onLike(post.id, post.likes + 1)} data-testid="like-button">❤️</button>
			</td>
			<td>
				<button onClick={toggleVisibility} data-testid="toggle-button">{visibility ? "Hide" : "Show"}</button>
			</td>
		</tr>
		{
			visibility && (<>
				<tr className="url">
					<td></td>
					<td colSpan={5}><u>URL:</u> {post.url}</td>
				</tr>
				<tr>
					<td colSpan={5}>
					{
						(post.user.username === user.username) && <button onClick={handleDelete}>Delete</button>
					}
					</td>
				</tr>
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