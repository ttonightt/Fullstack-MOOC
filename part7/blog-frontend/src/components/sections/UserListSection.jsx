import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchUserList } from "../../reducers/userReducer";
import { Box, LinearProgress } from "@mui/joy";
import User from "../User";


const UserListSection = () => {

	const userlist = useSelector(state => state.users);
	const dispatch = useDispatch();

	useEffect(() => {

		dispatch(fetchUserList());
	}, []);

	if (userlist.length) {

		return (
			<Box sx={{ display: "grid", gridTemplateColumns: "33% 33% 33%", gap: "1rem" }}>
				{
					userlist.map(user => 
						<Box key={user.id}>
							<User user={user} />
						</Box>
					)
				}
			</Box>
		);
	} else {
		return (
			<LinearProgress color="primary" size="sm" value={25} variant="soft" />
		);
	}
};

export default UserListSection;