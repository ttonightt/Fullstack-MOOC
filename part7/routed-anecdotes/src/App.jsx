import { useState } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";

import CreateNew from "./pages/CreateNew";
import About from "./pages/About";
import AnecdoteList from "./pages/AnecdoteList";
import AnecdotePage from "./pages/AnecdotePage";

import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Notification, { useNotification } from "./components/Notification";


const initAnecdotes = [
	{
		content: "If it hurts, do it more often",
		author: "Jez Humble",
		info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
		votes: 0,
		id: 1
	},
	{
		content: "Premature optimization is the root of all evil",
		author: "Donald Knuth",
		info: "http://wiki.c2.com/?PrematureOptimization",
		votes: 0,
		id: 2
	}
];

const App = () => {

	const [anecdotes, setAnecdotes] = useState(initAnecdotes);

	const [notification, setNotification] = useNotification("");

	const addNew = (anecdote) => {
		anecdote.id = Math.round(Math.random() * 10000)
		setAnecdotes(anecdotes.concat(anecdote))
	};

	const anecdoteById = (id) =>
		anecdotes.find(a => a.id === id);

	const handleVote = (id) => {
		const anecdote = anecdoteById(id);

		const voted = {
			...anecdote,
			votes: anecdote.votes + 1
		};

		setNotification("Hello");

		setAnecdotes(anecdotes.map(a => a.id === id ? voted : a));
	};

	const match = useMatch("/anecdotes/:id");

	const anecdote = match ? anecdotes.find(anc => anc.id == match.params.id) : null;

	return (
		<div>
			<Notification message={notification} />

			<h1>Software anecdotes</h1>
			<Menu />

			<Routes>
				<Route path="/create" element={<CreateNew addNew={addNew} />} />
				<Route path="/anecdotes/:id" element={<AnecdotePage anecdote={anecdote} onVote={handleVote} />} />
				<Route path="/anecdotes" element={<AnecdoteList anecdotes={anecdotes} />} />
				<Route path="/about" element={<About />} />
			</Routes>

			<Footer />
		</div>
	);
}

export default App;