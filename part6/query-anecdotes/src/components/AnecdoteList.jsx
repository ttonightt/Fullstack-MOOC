import { useMutation, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "../services/anecdoteService";
import { useNotify } from "./NotificationContext";


export const AnecdoteList = ({anecdotes}) => {

	const clientQuery = useQueryClient();

    const notify = useNotify();

	const modifyMutation = useMutation({

		mutationFn: async anecdote_ => await anecdoteService.modify(anecdote_.id, anecdote_),
		onSuccess (anecdote_) {

			const anecdotes = clientQuery.getQueryData(["anecdotes"]);

			clientQuery.setQueryData(["anecdotes"], anecdotes.map(anc => 
				anc.id === anecdote_.id ? anecdote_ : anc
			));

			notify(
				`Anecdote ${anecdote_.content} was voted!`,
				{
					color: "green",
					borderColor: "green"
				}
			);
		}
	});

	const handleVote = anecdote => {

		const anecdote_ = {...anecdote, votes: anecdote.votes + 1};

		modifyMutation.mutate(anecdote_);
	};

    return anecdotes.map(anecdote =>

        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
        </div>
    );
};