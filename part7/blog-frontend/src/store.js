import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./reducers/loginReducer";
import postReducer from "./reducers/postReducer";
import notificationReducer from "./reducers/notificationReducer";


const store = configureStore({
	reducer: {
		user: loginReducer,
		posts: postReducer,
		notification: notificationReducer
	}
});

export default store;