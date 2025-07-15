import axios from "axios";
const baseUrl = "/api/posts";

const getAll = async () => {

	const request = axios.get(baseUrl);
	const response = await request;
	return response.data;
};

const create = async ({title, author, url}, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.post(baseUrl, {title, author, url}, config);

	return res.data;
};

const modify = async (id, {title, author, url, likes}, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.put(`${baseUrl}/${id}`, {title, author, url, likes}, config);

	return res.data;
};

const remove = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.delete(`${baseUrl}/${id}`, config);

	return res.data;
};

export default {
	getAll,
	create,
	remove,
	modify
};