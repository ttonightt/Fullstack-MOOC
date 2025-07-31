import { useCountry, useField } from "./hooks";
import { useState } from "react";
import Country from "./components/Country";

const App = () => {

	const nameInput = useField("text");
	const [name, setName] = useState("");
	const country = useCountry(name);

	const handleSubmit = e => {

		e.preventDefault();

		setName(nameInput.value);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input {...nameInput} />
				<button>find</button>
			</form>

			<Country country={country} />
		</div>
	);
}

export default App;