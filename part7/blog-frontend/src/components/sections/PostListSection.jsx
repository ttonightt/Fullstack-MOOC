import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchPosts } from "../../reducers/postReducer";

import { Grid } from '@mui/material';
import { Post } from "../Post";


const PostListSection = () => {

	const posts = useSelector(state => state.posts);
	const dispatch = useDispatch();

	useEffect(() => {

		dispatch(fetchPosts());
	}, []);

	return (
		<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
		</Grid>
	);
};

export default PostListSection;