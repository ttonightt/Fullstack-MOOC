import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notification",
	initialState: null,
	reducers: {

		setNotification (state, {payload}) {

			return payload;
		}
	}
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

let timeoutBuffer = null;

export const triggerNotification = (message, s) => {

	return dispatch => {

		clearTimeout(timeoutBuffer);

		dispatch(setNotification(message));

		timeoutBuffer = setTimeout(() => {

			dispatch(setNotification(null));
		}, s * 1000);
	}
};