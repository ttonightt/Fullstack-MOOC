import { useEffect, useState } from "react";

import axios from "axios";

export const useField = (type) => {

	const [value, setValue] = useState("");

	const onChange = (event) => {
		setValue(event.target.value);
	};

	return {
		type,
		value,
		onChange
	};
}

export const useResource = baseUrl => {

	const [data, setData] = useState([]);

	useEffect(() => {

		axios
			.get(baseUrl)
			.then(res => {

				setData(res.data);
			});
	}, []);

	const create = async item => {

		const res = await axios.post(baseUrl, item);

		setData(data.concat(res.data));
	};

	return [data, { create }];
};