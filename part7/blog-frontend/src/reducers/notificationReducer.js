import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({

	name: "notification",
	initialState: [],
	reducers: {

		appendNotification (state, {payload}) {

			Object.defineProperty(payload, "__notificationId", {

				value: Symbol(),
				writable: false,
				configurable: false,
				enumerable: false
			});

			state.push(payload);
		},

		detachNotification (state, {payload}) {

			return state.filter(item => item.__notificationId !== payload.__notificationId);
		}
	}
});

export const { appendNotification, detachNotification } = userSlice.actions;
export default userSlice.reducer;


export const closeNotification = notification => {

	return dispatch => {

		clearTimeout(notification.__timeoutId);
		dispatch(detachNotification(notification))
	};
};

export const triggerNotification = (message, timeout, type) => {

	return dispatch => {

		const notification = { message, type };

		const timeoutId = setTimeout(() => {

			dispatch(detachNotification(notification));
		}, timeout);

		Object.defineProperty(notification, "__timeoutId", {

			value: timeoutId,
			writable: false,
			configurable: false,
			enumerable: false
		});

		dispatch(appendNotification(notification));
	};
};