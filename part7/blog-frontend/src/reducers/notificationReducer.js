import { createSlice } from "@reduxjs/toolkit";


let index = 0;

const userSlice = createSlice({

	name: "notification",
	initialState: [],
	reducers: {

		appendNotification (state, {payload}) {

			state.push(payload);
		},

		detachNotification (state, {payload}) {

			return state.filter(item => item.__notificationId !== payload);
		}
	}
});

export const { appendNotification, detachNotification } = userSlice.actions;
export default userSlice.reducer;


export const closeNotification = notification => {

	return dispatch => {

		clearTimeout(notification.__timeoutId);
		dispatch(detachNotification(notification));
	};
};

export const triggerNotification = (message, { timeout, type, confirmation }) => {

	return dispatch => {

		const id = index++;

		const notification = { message, type, confirmation };

		Object.defineProperty(notification, "__notificationId", {

			value: id,
			writable: false,
			configurable: false,
			enumerable: false
		});

		if (timeout > 0) {

			const timeoutId = setTimeout(() => {

				dispatch(detachNotification(id));
			}, timeout);

			Object.defineProperty(notification, "__timeoutId", {

				value: timeoutId,
				writable: false,
				configurable: false,
				enumerable: false
			});
		}

		dispatch(appendNotification(notification));
	};
};