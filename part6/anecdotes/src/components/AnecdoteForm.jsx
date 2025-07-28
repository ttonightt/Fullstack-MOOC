import { useDispatch } from "react-redux";
import { createAnecdote, voteForAnecdote } from "../reducers/anecdoteReducer";

export const AnecdoteForm = () => {

	const dispatch = useDispatch();

	const handleSubmit = e => {

		e.preventDefault();

		const value = e.target[0].value;

		dispatch({type: "anecdotes/createAnecdote", payload: value});
		dispatch({type: "notification/setNotification", payload: `"${value}" was added!`});

		e.target[0].value = "";
	};

    return (<>
        <h2>create new</h2>
        <form onSubmit={handleSubmit}>
            <div>
				<input />
			</div>
            <button>create</button>
        </form>
    </>);
};