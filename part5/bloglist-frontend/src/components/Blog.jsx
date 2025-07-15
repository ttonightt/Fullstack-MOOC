import { useState } from "react";
import PropTypes from "prop-types";

export const Blog = ({ post, id, onDelete, onLike }) => {
	
	const [visibility, setVisibility] = useState(false);

	const toggleVisibility = () => setVisibility(!visibility);

	const handleDelete = () => {

		if (!confirm(`Are you sure deleting "${post.title}" by ${post.author}?`)) return;

		onDelete(post.id);
	};

	return (<>
		<tr>
			<td>{id}</td>
			<td>
				{post.title}
			</td>
			<td>
				<i>by</i> {post.author}
			</td>
			<td>
				<b>{post.likes}</b>
			</td>
			<td>
				<button onClick={() => onLike(post.id, post.likes + 1)}>❤️</button>
			</td>
			<td>
				<button onClick={toggleVisibility}>{visibility ? "Hide" : "Show"}</button>
			</td>
		</tr>
		{
			visibility && (<>
				<tr>
					<td></td>
					<td colSpan={5}><u>URL:</u> {post.url}</td>
				</tr>
				<tr>
					<td></td>
					<td colSpan={5}>
						<button onClick={handleDelete}>Delete</button>
					</td>
				</tr>
			</>)
		}
	</>);
};

Blog.propTypes = {
	post: PropTypes.object.isRequired,
	id: PropTypes.number,
	onDelete: PropTypes.func,
	onLike: PropTypes.func
};