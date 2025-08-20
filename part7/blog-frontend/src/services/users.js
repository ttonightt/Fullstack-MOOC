import axios from "axios";
const baseUrl = "/api/users";

export const getAll = async () => {

	const res = await axios.get(baseUrl);
	return res.data;
};

export const get = async id => {

	const res = await axios.get(`${baseUrl}/${id}`);
	return res.data;
};

export const create = async ({ username, name, password }) => {

	const res = await axios.post(baseUrl, {username, name, password});

	return res.data;
};