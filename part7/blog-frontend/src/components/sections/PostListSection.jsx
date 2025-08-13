import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchPosts } from "../../reducers/postReducer";

import { Card, Box, Stack, Select, Option, Typography, LinearProgress } from '@mui/joy';
import { Post } from "../Post";


const PostListSection = () => {

	const posts = useSelector(state => state.posts);
	const dispatch = useDispatch();

	const [sortType, setSortType] = useState("mostLiked");

	let sorted = [...posts];

	switch (sortType) {
		case "mostLiked":
			sorted.sort((a, b) => b.likes.length - a.likes.length);
			break;
		case "recent":
			sorted.reverse();
	}


	useEffect(() => {

		dispatch(fetchPosts());
	}, []);

	if (posts.length) {
		return (
			<Box>
				<Card size="sm" variant="soft" color="primary" sx={{ marginBottom: "1em" }}>
					<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
						<Typography ml="0.5em" color="primary" level="h4" fontWeight="xl">Posts</Typography>
						<Select color="primary" defaultValue="mostLiked" onChange={(e, value) => setSortType(value)}>
							<Option color="primary" value="mostLiked">Most liked</Option>
							<Option color="primary" value="recent">Recent</Option>
						</Select>
					</Stack>
				</Card>
				{
					sorted.map(post => 
							<Post
								key={post.id}
								post={post}
							/>
						)
				}
			</Box>
		);
	} else
		return (
			<LinearProgress color="primary" size="sm" value={25} variant="soft" />
		);
};

export default PostListSection;