import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";


export const fetchUsers = createAsyncThunk(
	"users/fetchStatus",
	async (action, thunk) => {

		try {
			return await userService.getAll();

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

const userListSlice = createSlice({

	name: "users",
	initialState: [],
	extraReducers (builder) {

		builder
			.addCase(fetchUsers.fulfilled, (state, {payload}) => payload);
	}
});

export default userListSlice.reducer;