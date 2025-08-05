import axios from "axios";
const baseUrl = "/api/posts";

const getAll = async () => {

	const res = await axios.get(baseUrl);
	return res.data;
};

const get = async id => {

	const res = await axios.get(`${baseUrl}/${id}`);
	return res.data;
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

const like = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.post(`${baseUrl}/${id}/like`, {}, config);

	return res.data;
};

const dislike = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.post(`${baseUrl}/${id}/dislike`, {}, config);

	return res.data;
};

export default {
	getAll,
	get,
	create,
	remove,
	modify,
	like,
	dislike
};