import { useEffect, useState } from "react";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { useErrorHandler, useNotify, usePost, useSession } from "../hooks";
import { useNavigate } from "react-router-dom";

const ContextMenu = ({ id }) => {

	const [session] = useSession();

	const [post, service] = usePost(id);

	const navigate = useNavigate();

	const interactive = session.status === "stored" && post && session.data.id === post.user.id;

	const handleDelete = () => {

		if (!interactive) return;
		if (!confirm(`Are you sure deleting "${post.title}"?`)) return;

		service.remove({ id, token: session.data.token });

		navigate("/posts");
	};

	const handleResetComments = () => {

		if (!interactive) return;
		if (!confirm("Are you sure you want to reset all the comments under this post?")) return;

		service.resetComments({ id, token: session.data.token });
	};

	return (<>
		<Dropdown>
			<MenuButton data-testid="post-menu-btn" disabled={!interactive} sx={{ px: "0.5em" }} variant="plain">
				<MoreHorizRoundedIcon />
			</MenuButton>
			<Menu data-testid="post-menu-opts">
				<MenuItem data-testid="post-menu-reset" disabled={!interactive} onClick={handleResetComments}>Reset Comments</MenuItem>
				<MenuItem data-testid="post-menu-delete" disabled={!interactive} onClick={handleDelete}>Delete Post</MenuItem>
			</Menu>
		</Dropdown>
	</>);
};

export default ContextMenu;