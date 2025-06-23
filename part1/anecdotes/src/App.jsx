import { useState } from "react"

const anecdotes = [
	"If it hurts, do it more often.",
	"Adding manpower to a late software project makes it later!",
	"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
	"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
	"Premature optimization is the root of all evil.",
	"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
	"Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
	"The only way to go fast, is to go well."
];

const findMax = arr => {

	const maxValue = Math.max(...arr);

	return [arr.indexOf(maxValue), maxValue];
};

export const App = () => {

	const [selected, setSelected] = useState(0);
	const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

	const selectRandom = () => {

		const selected_ = Math.round(Math.random() * (anecdotes.length - 1));

		console.log(selected_);
		setSelected(selected_);
	};

	const voteForCurrent = () => {

		const votes_ = Array.from(votes);

		votes_[selected] += 1;

		setVotes(votes_);
	};

	const [maxVotesIndex, maxVotesValue] = findMax(votes);

	return (
		<div>
			<h1>Anecdote of the day</h1>

			<p>{anecdotes[selected]}</p>

			<button onClick={selectRandom}>next anecdote</button>
			<button onClick={voteForCurrent}>vote</button>

			<h1>Anecdote with the most votes</h1>

			{
				maxVotesValue > 0 ? (<>

					<p>{anecdotes[maxVotesIndex]}</p>
					<p>has {votes[maxVotesIndex]} votes</p>
				</>) : (
					<p>No one hasn't voted yet</p>
				)
			}

		</div>
	);
}