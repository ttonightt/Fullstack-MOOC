import { useMutation, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "../services/anecdoteService";
import { useNotify } from "./NotificationContext";

const AnecdoteForm = () => {

	const clientQuery = useQueryClient();

	const notify = useNotify();

	const createMutation = useMutation({

		mutationFn: anecdoteService.create,
		onSuccess (anecdote_) {

			const anecdotes = clientQuery.getQueryData(["anecdotes"]);

			clientQuery.setQueryData(["anecdotes"], anecdotes.concat(anecdote_));

			notify(
				`Anecdote ${anecdote_.content} was successfully created!`,
				{
					color: "green",
					borderColor: "green"
				}
			);
		},
		onError (error) {
			if (error.status === 400) {

				notify(
					"Such a short anecdote can't exist!",
					{
						color: "red",
						borderColor: "red"
					}
				);
			}
		}
	});

	const onCreate = (e) => {

		e.preventDefault();

		createMutation.mutate(e.target.anecdote.value);

		e.target.anecdote.value = "";
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;