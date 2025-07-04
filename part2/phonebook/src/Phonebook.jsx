import { useMemo } from "react";
import rand from "./rand";

const getRandomValidNumber = () => {

	return (
		rand(0, 99, 1).toString().padStart(2, "0") +
		(rand() > 0.5 ? rand(0, 9, 1).toString() + "-" : "-" + rand(0, 9, 1).toString()) +
		rand(0, 99999, 1).toString().padStart(5, "0") +
		(rand() > 0.5 ? rand(0, 99, 1).toString() : "")
	);
};

export const Filter = ({value, onChange}) => {

	return (
		<input type="text" value={value} onChange={onChange} />
	);
};

export const NewItemForm = ({onSubmit}) => {

	const numberPlaceholder = useMemo(getRandomValidNumber, [onSubmit]);

	const handleSubmit = e => {

		e.preventDefault();

		const [name, number] = e.target.elements;
		onSubmit(name.value, number.value === "" ? numberPlaceholder : number.value);
	};

	return (
		<form onSubmit={handleSubmit}>
			Name: 
			<input 
				type="text"
				name="name"
				minLength={3}
				required
			/>
			Number:
			<input
				type="text"
				name="number"
				pattern="[0-9]{2,3}-[0-9]+"
				minLength={8}
				placeholder={numberPlaceholder}
			/>
			<button type="submit">Add</button>
		</form>
	);
};

export const Content = ({list, onDelete}) => {

	return (
		<table>
			<tbody>
				{list.map(({id, name, number}) => (

					<tr key={id}>
						<td>{name}</td>
						<td>{number}</td>
						<td>
							<button onClick={() => onDelete(id)}>Delete</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};