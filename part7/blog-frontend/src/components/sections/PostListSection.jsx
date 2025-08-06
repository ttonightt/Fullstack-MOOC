import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchPosts } from "../../reducers/postReducer";

import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { Post } from "../Post";


const PostListSection = () => {

	const posts = useSelector(state => state.posts);
	const dispatch = useDispatch();

	useEffect(() => {

		dispatch(fetchPosts());
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
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
								/>
							)
					}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default PostListSection;