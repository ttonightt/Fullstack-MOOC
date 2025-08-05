import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import loginService from "../services/login";


export const loginUser = createAsyncThunk(
	"user/fetchStatus",
	async (user, thunk) => {

		try {
			return await loginService.login(user);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

export const checkUser = createAsyncThunk(
	"user/fetchStatus",
	async (data, thunk) => {

		try {
			return await loginService.check(JSON.parse(window.localStorage.getItem("user"))?.token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

const userSlice = createSlice({

	name: "user",
	initialState: JSON.parse(window.localStorage.getItem("user")),
	reducers: {

		setUser (state, {payload}) {

			return payload;
		}
	},
	extraReducers (builder) {

		builder.addCase(loginUser.fulfilled, (state, {payload}) => {

			window.localStorage.setItem("user", JSON.stringify(payload));

			return payload;
		});

		builder.addCase(checkUser.rejected, () => {

			window.localStorage.removeItem("user");

			return null;
		});
	}
});

const {setUser} = userSlice.actions;
export default userSlice.reducer;


export const logoutUser = () => {

	return dispatch => {

		window.localStorage.removeItem("user");

		dispatch(setUser(null));
	};
};