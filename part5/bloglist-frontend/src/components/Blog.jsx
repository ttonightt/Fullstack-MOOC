
import { Post } from "./Post";

export const Blog = ({ posts, user, onDelete, onLike }) => {

	switch (posts?.length) {
		case undefined:
			return <p>Loading...</p>;

		case 0:
			return <p>You have got no posts yet!</p>
		
		default:
			return (
				<table>
					<tbody>
						<tr>
							<td>#</td>
							<td>Title</td>
							<td>Author</td>
							<td colSpan={3}>Likes</td>
						</tr>
						{
							posts
								.sort((a, b) => b.likes - a.likes)
								.map((post, i) => 
									<Post
										key={post.id}
										post={post}
										id={i + 1}
										user={user} // good idea for future improvements: to wrap the whole <Blog/> with react context to provide user data
										onDelete={onDelete}
										onLike={onLike}
									/>
								)
						}
					</tbody>
				</table>
			);
	}
};