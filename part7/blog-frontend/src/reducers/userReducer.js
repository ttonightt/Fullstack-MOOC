import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";


const userListSlice = createSlice({

	name: "users",
	initialState: [],
	reducers: {

		setUsers (state, {payload}) {

			return payload;
		},

		appendUser (state, {payload}) {

			state.data.push(payload);
		}
	}
});

const { setUsers, appendUser } = userListSlice.actions;
export default userListSlice.reducer;


export const fetchUserList = () => {

	return async dispatch => {

		const res = await userService.getAll();

		dispatch(setUsers(res));
	};
};

export const pushToUserList = user => {

	return async dispatch => {

		const res = await userService.create(user);

		dispatch(appendUser(res));
	};
};