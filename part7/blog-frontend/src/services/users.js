import axios from "axios";
const baseUrl = "/api/users";

const getAll = async () => {

	const res = await axios.get(baseUrl);
	return res.data;
};

const get = async id => {

	const res = await axios.get(`${baseUrl}/${id}`);
	return res.data;
};

const create = async ({ username, name, password }) => {

	const res = await axios.post(baseUrl, {username, name, password});

	return res.data;
};

export default {
	getAll,
	get,
	create
};