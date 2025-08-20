import { useEffect, useState } from "react";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { useErrorHandler, useNotify, usePost } from "../hooks";
import { useNavigate } from "react-router-dom";

const ContextMenu = ({ id }) => {

	const session = useSelector(state => state.session);

	const [post, service] = usePost(id);
	
	const dispatch = useDispatch();
	const notify = useNotify();
	const errorHandler = useErrorHandler();
	const navigate = useNavigate();

	const interactive = session.status === "stored" && post && session.data.user.id === post.user.id;

	const handleDelete = () => {

		if (!interactive) return;
		if (!confirm(`Are you sure deleting "${post.title}"?`)) return;

		service.remove({ id, token: session.data.user.token });

		navigate(-1);
	};

	const handleResetComments = () => {

		if (!interactive) return;
		if (!confirm("Are you sure you want to reset all the comments under this post?")) return;

		service.resetComments({ id, token: session.data.user.token });
	};

	return (<>
		<Dropdown>
			<MenuButton data-testid="post-menu-btn" disabled={!interactive} sx={{ px: "0.5em" }} variant="plain">
				<MoreHorizRoundedIcon />
			</MenuButton>
			<Menu data-testid="post-menu-opts">
				<MenuItem disabled={!interactive} onClick={handleResetComments}>Reset Comments</MenuItem>
				<MenuItem disabled={!interactive} onClick={handleDelete}>Delete Post</MenuItem>
			</Menu>
		</Dropdown>
	</>);
};

export default ContextMenu;