
import { useState } from "react";
import { Filter, NewItemForm, Content } from "./Phonebook";

export const App = () => {

	const [filter, setFilter] = useState("");

	const [contacts, setContacts] = useState([
		{
			name: "Nepp József",
			number: "042-872199",
			id: 0
		},
		{
			name: "Kunz Román",
			number: "028-42260",
			id: 1
		},
		{
			name: "Romhányi József",
			number: "016-429940",
			id: 2
		},
		{
			name: "Halász Judit",
			number: "079-1358",
			id: 3
		},
		{
			name: "Béres Ilona",
			number: "022-79371",
			id: 4
		},
		{
			name: "Kállai Ferenc",
			number: "081-982114",
			id: 5
		},
		{
			name: "Körmendi János",
			number: "056-395864",
			id: 6
		}
	]);

	const addContact = (name, number) => {

		if (contacts.some(cnt => cnt.name === name)) return alert(`${name} is already in the contact list!`);

		const contacts_ = contacts.concat({
			name,
			number,
			id: contacts.length
		});

		console.log(name, "with phone number", number, "was added!");

		setContacts(contacts_);
	};

	const visibleItems = contacts.filter(item => item.name.includes(filter));

	return (
		<div>
			<h1>Filter</h1>
			<Filter value={filter} onChange={e => setFilter(e.target.value)}/>

			<h1>Add new contact</h1>
			<NewItemForm onSubmit={addContact}/>

			<h1>Contact List</h1>
			<Content list={visibleItems} />
		</div>
	);
};