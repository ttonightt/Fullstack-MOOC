import { configureStore } from "@reduxjs/toolkit";

import filterReducer from "./src/reducers/filterReducer";
import anecdoteReducer from "./src/reducers/anecdoteReducer";
import notificationReducer from "./src/reducers/notificationReducer";

export const store = configureStore({
	reducer: {
		anecdotes: anecdoteReducer,
		filter: filterReducer,
		notification: notificationReducer
	}
});