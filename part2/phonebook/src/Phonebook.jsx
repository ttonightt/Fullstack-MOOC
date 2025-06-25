
export const Filter = ({value, onChange}) => {

	return (
		<input type="text" value={value} onChange={onChange} />
	);
};

export const NewItemForm = ({onSubmit}) => {

	const handleSubmit = e => {

		e.preventDefault();

		const [name, number] = e.target.elements;
		onSubmit(name.value, number.value);
	};

	return (
		<form onSubmit={handleSubmit}>
			Name: 
			<input type="text" name="name" />
			Number:
			<input type="text" name="number" />
			<button type="submit">Add</button>
		</form>
	);
};

export const Content = ({list, onDelete}) => {

	return (
		<table>
			<tbody>
				{list.map(({name, number}) => (

					<tr key={name}>
						<td>{name}</td>
						<td>{number}</td>
						<td>
							<button onClick={() => onDelete(name)}>Delete</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};