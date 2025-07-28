import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { triggerNotification } from "../reducers/notificationReducer";

export const AnecdoteForm = () => {

	const dispatch = useDispatch();

	const handleSubmit = async e => {

		e.preventDefault();

		dispatch(createAnecdote(e.target[0].value));
		dispatch(triggerNotification(`"${e.target[0].value}" was added!`, 3));

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