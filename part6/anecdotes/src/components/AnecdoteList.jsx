import { useDispatch, useSelector } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import { triggerNotification } from "../reducers/notificationReducer";

export const AnecdoteList = () => {

	const anecdotes = useSelector(
		({ anecdotes, filter }) => 
			anecdotes
				.filter(
					({content}) =>
						content.toLowerCase().includes(filter.toLowerCase())
				) // here filter creates a copy of the array, so we do not need to copy it again
				.sort((a, b) => 
					b.votes - a.votes
				)
	);

	const dispatch = useDispatch();

	const vote = ({id, content}) => {

		dispatch(voteForAnecdote(id));
		dispatch(triggerNotification(`You just voted for "${content}" anecdote`, 3));
	};

	return anecdotes.map(anecdote =>

		<div key={anecdote.id}>
			<div>
				{anecdote.content}
			</div>
			<div>
				has {anecdote.votes}
				<button onClick={() => vote(anecdote)}>vote</button>
			</div>
		</div>
	);
};