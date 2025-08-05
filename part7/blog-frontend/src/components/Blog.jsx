
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { Post } from "./Post";

export const Blog = ({ posts, user, onDelete, onLike }) => {

	switch (posts?.length) {
		case undefined:
			return <p>Loading...</p>;

		case 0:
			return <p>You have got no posts yet!</p>

		default:
			return (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Title</TableCell>
								<TableCell>Author</TableCell>
								<TableCell colSpan={3}>Likes</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								[...posts]
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
						</TableBody>
					</Table>
				</TableContainer>
			);
	}
};