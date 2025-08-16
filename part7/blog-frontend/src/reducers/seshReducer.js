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
	async (___, thunk) => {

		const stored = JSON.parse(window.localStorage.getItem("session"));

		if (!stored ?.user)
			return thunk.rejectWithValue({
				status: 0,
				data: { error: "A user isn't saved in the local browser storage" }
			});

		try {
			return await loginService.check(stored.user.token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);


const initStoreState = JSON.parse(window.localStorage.getItem("session"));

const userSlice = createSlice({

	name: "session",
	initialState: {
		data: initStoreState,
		status: initStoreState ?.user ?.token ? "stored" : "empty"
	},
	reducers: {

		setSessionUser (state, {payload}) {

			return {...state, data: payload };
		},

		setSessionStatus (state, {payload}) {

			return {...state, status: payload };
		}
	},
	extraReducers (builder) {

		builder
			.addCase(loginUser.fulfilled, (state, {payload}) => {
				console.log("checkUser/fulfilled");
				const session = {user: payload};

				window.localStorage.setItem("session", JSON.stringify(session));

				return { data: session, status: "stored" };
			})
			.addCase(loginUser.pending, (state) => {
				console.log("loginUser/pending");
				return {...state, status: "fetching" };
			})
			.addCase(loginUser.rejected, (state) => {
				console.log("loginUser/rejected");
				return {...state, status: "empty" };
			})
			.addCase(checkUser.fulfilled, (state) => {
				console.log("checkUser/fulfilled");
				return {...state, status: "stored" };
			})
			.addCase(checkUser.pending, (state) => {
				console.log("checkUser/pending");
				return {...state, status: "fetching" };
			})
			.addCase(checkUser.rejected, () => {
				console.log("checkUser/rejected");
				window.localStorage.removeItem("session");

				return { data: null, status: "empty" };
			});
	}
});

const {setSessionUser, setSessionStatus} = userSlice.actions;
export default userSlice.reducer;


export const logoutUser = () => {

	return dispatch => {

		window.localStorage.removeItem("session");

		dispatch(setSessionUser(null));
		dispatch(setSessionStatus("empty"));
	};
};