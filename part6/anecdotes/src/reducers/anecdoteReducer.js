import { createSlice, current } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

const getId = () => (100000 * Math.random()).toFixed(0);

const toObject = (anecdote) => {

	return {
		content: anecdote,
		id: getId(),
		votes: 0
	};
};

const initialState = [];

const anecdoteSlice = createSlice({
	
	name: "anecdotes",
	initialState,
	reducers: {

		appendAnecdote (state, {payload}) {

			state.push(payload);
		},

		setAnecdotes (state, {payload}) {

			return payload;
		},

		modifyAnecdote (state, {payload}) {

			return state.map(anecdote => 
				anecdote.id === payload.id ? payload.anecdote : anecdote
			);
		}
	}
});

export const {appendAnecdote, setAnecdotes, modifyAnecdote} = anecdoteSlice.actions;
export default anecdoteSlice.reducer;

export const createAnecdote = content => {

	return async dispatch => {

		const anecdote = await anecdoteService.create(content);

		dispatch(appendAnecdote(anecdote));
	};
};

export const fetchAnecdotes = () => {

	return async dispatch => {

		const anecdotes = await anecdoteService.getAll();
					
		dispatch(setAnecdotes(anecdotes));
	};
};

export const voteForAnecdote = id => {

	return async dispatch => {

		const anecdote = await anecdoteService.get(id);

		const anecdote_ = await anecdoteService.modify(id, {...anecdote, votes: anecdote.votes + 1});

		dispatch(modifyAnecdote({
			id,
			anecdote: anecdote_
		}));
	};
};