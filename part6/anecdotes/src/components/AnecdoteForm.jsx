import { useDispatch } from "react-redux";
import { createAnecdote, voteForAnecdote } from "../reducers/anecdoteReducer";

export const AnecdoteForm = () => {

	const dispatch = useDispatch();

	const handleSubmit = e => {

		e.preventDefault();

		dispatch(createAnecdote(e.target[0].value));

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