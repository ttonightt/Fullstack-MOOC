import axios from "axios";

const baseUrl = "/api/login";

export const login = async credits => {

	const res = await axios.post(baseUrl, credits);

	return res.data;
};

export const check = async token => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.get(baseUrl, config);

	return res.data;
};