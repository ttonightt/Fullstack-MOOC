import { configureStore } from "@reduxjs/toolkit";

import seshReducer from "./reducers/seshReducer";
import postReducer from "./reducers/postReducer";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";


const store = configureStore({
	reducer: {
		session: seshReducer,
		posts: postReducer,
		notification: notificationReducer,
		users: userReducer
	}
});

export default store;