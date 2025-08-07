import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchUserList } from "../../reducers/userReducer";
import { Grid } from "@mui/material";
import User from "../User";


const UserListSection = () => {

	const userlist = useSelector(state => state.users);
	const dispatch = useDispatch();

	useEffect(() => {

		dispatch(fetchUserList());
	}, []);

	if (userlist.length) {

		return (
			<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
				{
					userlist.map(user => 
						<User
							key={user.id}
							user={user}
						/>
					)
				}
			</Grid>
		);
	} else {
		return "Loading...";
	}
};

export default UserListSection;