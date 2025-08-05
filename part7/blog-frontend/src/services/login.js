import axios from "axios";

const baseUrl = "/api/login";

const login = async credits => {

	const res = await axios.post(baseUrl, credits);

	return res.data;
};

const check = async token => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios.get(baseUrl, config);

	return res.data;
};

export default {login, check};