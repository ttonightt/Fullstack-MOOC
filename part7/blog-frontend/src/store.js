import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./reducers/loginReducer";
import postReducer from "./reducers/postReducer";


const store = configureStore({
	reducer: {
		user: loginReducer,
		posts: postReducer
	}
});

export default store;