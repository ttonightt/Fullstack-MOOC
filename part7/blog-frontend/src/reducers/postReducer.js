import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import postService from "../services/blogs";


export const createPost = createAsyncThunk(
	"user/createStatus",
	async ({ post, token }, thunk) => {

		try {
			return await postService.create(post, token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

export const removePost = createAsyncThunk(
	"user/removeStatus",
	async ({ id, token }, thunk) => {

		try {
			await postService.remove(id, token);

			return { id };

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

export const likePost = createAsyncThunk(
	"user/likeStatus",
	async ({ id, token }, thunk) => {

		try {
			return await postService.like(id, token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

export const dislikePost = createAsyncThunk(
	"user/dislikeStatus",
	async ({ id, token }, thunk) => {

		try {
			return await postService.dislike(id, token);

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
		}
	},
	extraReducers (builder) {

		builder.addCase(createPost.fulfilled, (state, {payload}) => {

			return state.concat(payload);
		});

		builder.addCase(likePost.fulfilled, (state, {payload}) => {

			return state.map(post => post.id === payload.id ? payload : post);
		});

		builder.addCase(dislikePost.fulfilled, (state, {payload}) => {

			return state.map(post => post.id === payload.id ? payload : post);
		});

		builder.addCase(removePost.fulfilled, (state, {payload}) => {

			return state.filter(post => post.id !== payload.id);
		});
	}
});

const { setPosts } = postSlice.actions;
export default postSlice.reducer;


export const fetchPosts = () => {

	return async dispatch => {

		const posts = await postService.getAll();

		dispatch(setPosts(posts));
	}
};