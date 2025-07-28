import { useDispatch, useSelector } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";

export const AnecdoteList = () => {

    const anecdotes = useSelector(state => state.sort((a, b) => b.votes - a.votes));
    const dispatch = useDispatch();

    const vote = (id) => {
        console.log("vote", id);

        dispatch(voteForAnecdote(id));
    };

    return anecdotes.map(anecdote =>

        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </div>
    );
};