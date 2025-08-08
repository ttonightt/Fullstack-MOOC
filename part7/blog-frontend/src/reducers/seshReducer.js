import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import loginService from "../services/login";


export const loginUser = createAsyncThunk(
	"session/loginStatus",
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
	"session/checkStatus",
	async (data, thunk) => {

		const user = JSON.parse(window.localStorage.getItem("session"))?.user;

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

	name: "session",
	initialState: JSON.parse(window.localStorage.getItem("session")),
	reducers: {

		setSessionUser (state, {payload}) {

			return payload;
		}
	},
	extraReducers (builder) {

		builder.addCase(loginUser.fulfilled, (state, {payload}) => {

			const session = {user: payload};

			window.localStorage.setItem("session", JSON.stringify(session));

			return session;
		});

		builder.addCase(checkUser.rejected, () => {

			window.localStorage.removeItem("session");

			return null;
		});
	}
});

const {setSessionUser} = userSlice.actions;
export default userSlice.reducer;


export const logoutUser = () => {

	return dispatch => {

		window.localStorage.removeItem("session");

		dispatch(setSessionUser(null));
	};
};