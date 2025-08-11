import axios from "axios";
const baseUrl = "/api/posts";

export const getAll = async () => {

	const res = await axios.get(baseUrl);
	return res.data;
};

export const get = async id => {

	const res = await axios.get(`${baseUrl}/${id}`);
	return res.data;
};

export const create = async ({title, author, content}, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.post(baseUrl, {title, author, content}, config);

	return res.data;
};

export const modify = async (id, {title, author, url, likes}, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.put(`${baseUrl}/${id}`, {title, author, url, likes}, config);

	return res.data;
};

export const remove = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.delete(`${baseUrl}/${id}`, config);

	return res.data;
};

export const like = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.post(`${baseUrl}/${id}/like`, {}, config);

	return res.data;
};

export const dislike = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.delete(`${baseUrl}/${id}/like`, config);

	return res.data;
};

export const comment = async (id, { comment }, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.post(`${baseUrl}/${id}/comments`, { comment }, config);

	return res.data;
};

export const resetComments = async (id, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.delete(`${baseUrl}/${id}/comments`, config);

	return res.data;
};