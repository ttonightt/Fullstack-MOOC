import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import loginService from "../services/login";


export const loginUser = createAsyncThunk(
	"login/loginStatus",
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
	"login/checkStatus",
	async (data, thunk) => {

		const user = JSON.parse(window.localStorage.getItem("user"));

		if (!user)
			return thunk.rejectWithValue({
				status: 0,
				data: { error: "A user isn't saved in the local browser storage" }
			});

		try {
			return await loginService.check(user.token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

const userSlice = createSlice({

	name: "login",
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