import { useState, useEffect } from "react";

import service from "../services/coutriesService";


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
};

export const useCountry = name => {

	const [country, setCountry] = useState(null);

	useEffect(() => {

        service
            .getByName(name)
            .then(country => {

                setCountry({
                    data: {
                        name: country.name.common,
                        flag: country.flags.svg,
                        capital: country.capital[0],
                        population: country.population
                    }
                });
            })
            .catch(err => {

                if (err.status === 404)
                    setCountry({
                        error: {
                            message: "Not found...",
                            status: 404
                        }
                    });
            });
    }, [name]);

	return country;
};