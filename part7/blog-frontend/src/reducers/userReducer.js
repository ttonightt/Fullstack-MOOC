import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import loginService from "../services/login";


export const fetchUser = createAsyncThunk(
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

const userSlice = createSlice({

	name: "user",
	initialState: JSON.parse(window.localStorage.getItem("user")),
	reducers: {

		setUser (state, {payload}) {

			return payload;
		}
	},
	extraReducers (builder) {

		builder.addCase(fetchUser.fulfilled, (state, {payload}) => {

			window.localStorage.setItem("user", JSON.stringify(payload));

			return payload;
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