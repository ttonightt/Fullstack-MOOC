import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./reducers/loginReducer";
import postReducer from "./reducers/postReducer";
import notificationReducer from "./reducers/notificationReducer";
import userListReducer from "./reducers/userListReducer";


const store = configureStore({
	reducer: {
		user: loginReducer,
		posts: postReducer,
		notification: notificationReducer,
		userlist: userListReducer
	}
});

export default store;