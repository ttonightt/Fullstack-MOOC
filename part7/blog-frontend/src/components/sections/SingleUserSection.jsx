import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../../reducers/userReducer";
import { Link } from "react-router-dom";
import { Avatar, Box, Card, Divider, Stack, Typography } from "@mui/joy";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";


const SingleUserSection = ({ id }) => {

	const user = useSelector(state => state.users.find(item => item.id === id));
	const dispatch = useDispatch();

	useEffect(() => {

		if (!user) 
			dispatch(fetchUserList());
	}, []);

	if (user) {

		return (
			<Card variant="soft" size="lg">
				<Stack direction="row" spacing={3} sx={{ alignItems: "center", flexWrap: "nowrap" }}>
					<Avatar sx={{ width: 100, height: 100 }} alt={user.username} src={`/public/avatars/${user.username}.png`} />
					<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
						<Typography level="h3">
							{user.name}
						</Typography>
						<Typography level="body-lg">
							@{user.username}
						</Typography>
					</Box>
				</Stack>
				<Divider/>
				<Stack direction="row" spacing={1}>
					<Card variant="soft" color="primary" sx={{ flexGrow: 1 }}>
						<Typography noWrap textOverflow="ellipsis" level="h4" color="primary" lineHeight="1em">
							{user.posts.length} {user.posts.length === 1 ? "Post" : "Posts"}
						</Typography>
					</Card>
					<Card variant="soft" color="danger">
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<FavoriteBorderIcon />
							<Typography noWrap textOverflow="ellipsis" level="h5" lineHeight="1em">
								{user.posts.reduce((sum, {likes}) => sum + likes.length, 0)} Likes
							</Typography>
						</Stack>
					</Card>
				</Stack>
				{user.posts.map(post => 

					<Card variant="plain" key={post.id}>
						<Stack direction="row" sx={{ alignItems: "start", justifyContent: "space-between" }}>
							<Box>
								<Link to={`/posts/${post.id}`} key={post.id}>
									<Typography textOverflow="ellipsis" noWrap level="h4" fontWeight="md">
										{post.title}
									</Typography>
								</Link>
								<Typography level="body-md">
									{post.author}
								</Typography>
							</Box>
							<Card size="sm" variant="plain" color="danger" sx={{ p: "0.5em", height: "content" }}>
								<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
									<FavoriteBorderIcon />
									<Typography noWrap textOverflow="ellipsis" level="h5" lineHeight="1em">
										{post.likes.length} Likes
									</Typography>
								</Stack>
							</Card>
						</Stack>
					</Card>
				)}
			</Card>
		);
	} else {
		return "Loading...";
	}
};

export default SingleUserSection;