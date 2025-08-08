import { Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, removePost } from "../reducers/postReducer";

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

		dispatch(removePost({ id, token: seshUser.token }));

		handleClose();
	};

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
			<MenuItem disabled={!(seshUser && seshUser.id === post?.user.id)} onClick={handleDelete}>Delete Post</MenuItem>
		</Menu>
	</>);
};

export default ContextMenu;