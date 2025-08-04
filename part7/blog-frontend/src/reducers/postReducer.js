import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import postService from "../services/blogs";


export const removePost = createAsyncThunk(
	"user/likeStatus",
	async ({ id }, thunk) => {

		const state = thunk.getState();

		try {
			await postService.remove(id);

			return state.filter(pst => pst.id !== id);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

const postSlice = createSlice({

	name: "posts",
	initialState: [],
	reducers: {

		setPosts (state, {payload}) {

			return payload;
		},

		replacePost (state, {payload}) {

			return state.map(post => post.id === payload.id ? payload.post : post);
		} 
	},
	extraReducers (builder) {

		//builder.addCase(likePost.fulfilled, (state, {payload}) => {

		//	return payload;
		//});
	}
});

const { setPosts, replacePost } = postSlice.actions;
export default postSlice.reducer;


export const fetchPosts = () => {

	return async dispatch => {

		const posts = await postService.getAll();

		dispatch(setPosts(posts));
	}
};

export const likePost = (id, token) => {

	return async dispatch => {

		const post = await postService.like(id, token);

		dispatch(replacePost({id, post}));
	}
};