import { createSlice } from "@reduxjs/toolkit";

const anecdotesInit = [
	"If it hurts, do it more often",
	"Adding manpower to a late software project makes it later!",
	"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
	"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
	"Premature optimization is the root of all evil.",
	"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."
];

const getId = () => (100000 * Math.random()).toFixed(0);

const toObject = (anecdote) => {

	return {
		content: anecdote,
		id: getId(),
		votes: 0
	};
};

const initialState = anecdotesInit.map(toObject);

const anecdoteSlice = createSlice({
	
	name: "anecdotes",
	initialState,
	reducers: {

		createAnecdote (state, {payload}) {

			console.log("Create:", state);

			return state.concat(toObject(payload));
		},

		voteForAnecdote (state, {payload}) {

			return state.map((anecdote) => {

				if (anecdote.id === payload) {

					return {
						...anecdote,
						votes: anecdote.votes + 1
					};
				} else {

					return anecdote;
				}
			});
		}
	}
});

export const {createAnecdote, voteForAnecdote} = anecdoteSlice.actions;
export default anecdoteSlice.reducer;