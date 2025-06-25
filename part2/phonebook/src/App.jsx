
import { useState, useEffect } from "react";
import axios from "axios";
import contactService from "../services/contacts";
import { Filter, NewItemForm, Content } from "./Phonebook";

export const App = () => {

	const [filter, setFilter] = useState("");

	const [contacts, setContacts] = useState([]);

	useEffect(() => {

		contactService.get().then(cnts => setContacts(cnts));

	}, []);

	const addContact = (name, number) => {

		if (contacts.some(cnt => cnt.name === name)) {

			if (!confirm(`Modify existing '${name}' entry with following phone number: ${number}?`)) return;

			console.log(name, "modifing with phone number", number, "is pending...");

			contactService.update(name, {name, number})
			.then(() => {

				console.log(name, "with phone number was modified with folowing values:", {number});

				contactService.get()
				.then(cnts => 
					setContacts(Array.from(cnts))
				);
			});
		} else {

			const cnt = {
				id: name,
				name,
				number
			};

			console.log(name, "with phone number", number, "is pending...");

			contactService.add(cnt).then(cnt$ => {

				setContacts(contacts.concat(cnt$));

				console.log(cnt$.name, "with phone number", cnt$.number, "was added!");
			});
		}
	};

	const handleDelete = name => {

		if (!confirm(`Delete '${name}' ?`)) return;

		console.log(name, "removing is pending...");

		contactService.remove(name)
		.then(() => 
			contactService.get()
			.then(cnts => {

				console.log(name, "was removed");

				setContacts(Array.from(cnts))
			})
		)
		.catch(err => {

			if (err.response.status === 404) {

				console.error(`There is no such an entry at contacts/: '${name}'`, err);
			} else
				console.error(err);
		});
	}

	const visibleItems = contacts.filter(item => item.name.toLowerCase().includes(filter));

	return (
		<div>
			<h1>Filter</h1>
			<Filter value={filter} onChange={e => setFilter(e.target.value)}/>

			<h1>Add new contact</h1>
			<NewItemForm onSubmit={addContact}/>

			<h1>Contact List</h1>
			<Content list={visibleItems} onDelete={handleDelete}/>
		</div>
	);
};