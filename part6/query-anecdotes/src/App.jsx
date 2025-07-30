import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { AnecdoteList } from "./components/AnecdoteList";

import { useQuery } from "@tanstack/react-query";
import anecdoteService from "./services/anecdoteService";

const App = () => {

	const anecdotesQuery = useQuery({

		queryKey: ["anecdotes"],
		queryFn: async () =>
			await anecdoteService.getAll(),
		refetchOnWindowFocus: false,
		retry: 0
	});

	if (anecdotesQuery.isError) {

		return <b>Can't connect to the server</b>;
	}

	if (anecdotesQuery.isLoading) {

		return <i>Anecdotes are loading</i>;
	}

	const anecdotes = anecdotesQuery.data;

	// Although we try to get rid of classic prop passing to components in this course module,
	// I've decided to separate getting and voting, so getting is handled here and voting
	// in the AnecdoteList. In this way neigher of components isn't overloaded with code.
	// Thus, I think the "anecdotes" prop here is a appropriate idea.
	// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

	return (
		<div>
			<h3>Anecdote app</h3>
		
			<Notification />
			<AnecdoteForm />
			<AnecdoteList anecdotes={anecdotes} />
		</div>
	);
}

export default App;
