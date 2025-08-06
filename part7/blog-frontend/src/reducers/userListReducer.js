import { createSlice } from "@reduxjs/toolkit";
import userListService from "../services/users";


const userListSlice = createSlice({

	name: "userlist",
	initialState: [],
	reducers: {

		setUserList (state, {payload}) {

			return payload;
		},

		appendToUserList (state, {payload}) {

			state.push(payload);
		}
	}
});

const { setUserList, appendToUserList } = userListSlice.actions;
export default userListSlice.reducer;


export const fetchUserList = () => {

	return async dispatch => {

		const res = await userListService.getAll();

		dispatch(setUserList(res));
	};
};

export const pushToUserList = user => {

	return async dispatch => {

		const res = await userListService.create(user);

		dispatch(appendToUserList(res));
	};
};