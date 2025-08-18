import { configureStore } from "@reduxjs/toolkit";

import seshReducer from "./reducers/seshReducer";
import postReducer from "./reducers/postReducer";
import userReducer from "./reducers/userReducer";


const store = configureStore({
	reducer: {
		session: seshReducer,
		posts: postReducer,
		users: userReducer
	}
});

export default store;