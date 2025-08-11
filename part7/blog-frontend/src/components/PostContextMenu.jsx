import { Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, removePost, resetPostComments } from "../reducers/postReducer";

const ContextMenu = ({ id }) => {

	const [anchor, setAnchor] = useState();

	const seshUser = useSelector(state => state.session)?.user;
	const post = useSelector(state => state.posts.find(item => item.id === id));
	const dispatch = useDispatch();

	useEffect(() => {

		if (!post)
			dispatch(fetchPosts());
	}, []);

	const handleOpen = e => setAnchor(e.currentTarget);

	const handleClose = () => setAnchor(null);

	const handleDelete = () => {

		if (!confirm(`Are you sure deleting "${post.title}"?`)) return;

		dispatch(removePost({ id, token: seshUser.token }))
			.unwrap()
			.then(() => {

				notify.log("Post was successfully deleted!");
			})
			.catch(e => {

				console.error(e);

				if (e.data.error.includes("invalid token")) {

					if (confirm("Invalid token. Would you like to start new user session?"))
						handleLogout();

				} else if (e.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();
				}
			});

		handleClose();
	};

	const handleResetComments = () => {

		if (confirm("Are you sure you want to reset all the comments under this post?"))

			dispatch(resetPostComments({ id, token: seshUser.token }));
	};

	const disabled = !(seshUser && seshUser.id === post?.user.id);

	return (<>
		<Button
			onClick={handleOpen}
		>
			<MoreHorizRoundedIcon />
		</Button>
		<Menu
			anchorEl={anchor}
			open={!!anchor}
			onClose={handleClose}
		>
			<MenuItem disabled={disabled} onClick={handleResetComments}>Reset Comments</MenuItem>
			<MenuItem disabled={disabled} onClick={handleDelete}>Delete Post</MenuItem>
		</Menu>
	</>);
};

export default ContextMenu;