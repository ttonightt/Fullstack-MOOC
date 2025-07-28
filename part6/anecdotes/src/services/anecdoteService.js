import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {

	const res = await axios.get(baseUrl);

	return res.data;
}

const get = async id => {

	const res = await axios.get(`${baseUrl}/${id}`);

	return res.data;
}

const create = async (content) => {

	const anecdote = {
		content,
		votes: 0
	};

	const res = await axios.post(baseUrl, anecdote);

	return res.data;
};

const modify = async (id, anecdote_) => {

	const res = await axios.put(`${baseUrl}/${id}`, {id, ...anecdote_});

	return res.data;
};

export default {
	getAll,
	get,
	create,
	modify
}