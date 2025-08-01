import axios from "axios";

const baseUrl = "/api/login";

const login = async credits => {

	const res = await axios.post(baseUrl, credits);

	return res.data;
};

export default {login};