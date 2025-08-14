import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchPosts } from "../../reducers/postReducer";

import { Card, Box, Stack, Select, Option, Typography, LinearProgress } from '@mui/joy';
import { Post } from "../Post";
import { useNotify, usePosts } from "../../hooks";


const Header = ({ setSortType }) => (

	<Card size="sm" variant="soft" color="primary" sx={{ marginBottom: "1em" }}>
		<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
			<Typography ml="0.5em" color="primary" level="h4" fontWeight="xl">Posts</Typography>
			<Select color="primary" defaultValue="mostLiked" onChange={(e, value) => setSortType(value)}>
				<Option color="primary" value="mostLiked">Most liked</Option>
				<Option color="primary" value="recent">Recent</Option>
			</Select>
		</Stack>
	</Card>
);

const PostListSection = () => {

	const posts = usePosts();

	const [sortType, setSortType] = useState("mostLiked");

	if (!posts)
		return (
			<Box>
				<Header setSortType={setSortType} />
				<LinearProgress color="primary" size="sm" value={25} variant="soft" />
			</Box>
		);

	if (posts.length === 0)
		return (
			<Box>
				<Header setSortType={setSortType} />
				<Typography ml="1.25rem" sx={{ opacity: 0.2 }} level="h2">No posts yet...</Typography>
			</Box>
		);

	let sorted = [...posts];

	switch (sortType) {
		case "mostLiked":
			sorted.sort((a, b) => b.likes.length - a.likes.length);
			break;
		case "recent":
			sorted.reverse();
	}

	return (
		<Box>
			<Header setSortType={setSortType} />
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
};

export default PostListSection;