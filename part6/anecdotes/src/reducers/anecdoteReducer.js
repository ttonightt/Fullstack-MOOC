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

export const createAnecdote = (anecdote) => {

	return {
		type: "CREATE",
		payload: toObject(anecdote)
	};
};

export const voteForAnecdote = (id) => {

	return {
		type: "VOTE",
		payload: {id}
	};
};

const initialState = anecdotesInit.map(toObject);

export const reducer = (state = initialState, action) => {

	const {type, payload} = action;

	switch (type) {
		case "CREATE":
			return state.concat(payload);
		case "VOTE":
			// Here I prevent mutation of not only state itself but also its separate items
			// i dont know whether it is neccessary here, it seems to me overwhelming though
			const i = state.findIndex(anecdote => anecdote.id === payload.id);
			const anecdote_ = {...state[i]};
			anecdote_.votes++;
			const state_ = [...state];
			state_.splice(i, 1, anecdote_);
			return state_;
		default:
			return state;
	}
};