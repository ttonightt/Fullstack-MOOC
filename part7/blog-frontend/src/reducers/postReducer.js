import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import * as postService from "../services/posts";


export const fetchPosts = createAsyncThunk(
	"user/fetchStatus",
	async (action, thunk) => {

		try {
			return await postService.getAll();

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

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

export const commentPost = createAsyncThunk(
	"user/commentStatus",
	async ({ id, comment, token }, thunk) => {

		try {
			return await postService.comment(id, { comment }, token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

export const resetPostComments = createAsyncThunk(
	"user/resetCommentsStatus",
	async ({ id, token }, thunk) => {

		try {
			return await postService.resetComments(id, token);

		} catch ({ status, response }) {

			return thunk.rejectWithValue({
				status,
				data: response.data
			});
		}
	}
);

const replaceWithPayload = (state, payload) => {

	return state.map(post => post.id === payload.id ? payload : post);
};

const postSlice = createSlice({

	name: "posts",
	initialState: null,
	extraReducers (builder) {

		builder
			.addCase(fetchPosts.fulfilled, (state, {payload}) => {

				return payload;
			})
			.addCase(createPost.fulfilled, (state, {payload}) => {

				return state.concat(payload);
			})
			.addCase(likePost.fulfilled, (state, {payload}) => replaceWithPayload(state, payload))

			.addCase(dislikePost.fulfilled, (state, {payload}) => replaceWithPayload(state, payload))

			.addCase(commentPost.fulfilled, (state, {payload}) => replaceWithPayload(state, payload))

			.addCase(resetPostComments.fulfilled, (state, {payload}) => replaceWithPayload(state, payload))

			.addCase(removePost.fulfilled, (state, {payload}) => {

				return state.filter(post => post.id !== payload.id);
			});
	}
});

export default postSlice.reducer;