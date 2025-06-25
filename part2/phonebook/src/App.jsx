
import { useState, useEffect } from "react";
import axios from "axios";
import contactService from "../services/contacts";
import { useNotification } from "./hooks";
import { Filter, NewItemForm, Content } from "./Phonebook";

export const App = () => {

	const [filter, setFilter] = useState("");

	const [contacts, setContacts] = useState([]);

	const [notification, notify] = useNotification();

	const nlog = (...messages) => {

		notify({
			type: "log",
			timeout: 5000,
			messages
		});

		console.log(...messages);
	};

	const nerr = (...messages) => {

		notify({
			type: "error",
			timeout: 5000,
			messages
		});

		console.error(...messages);
	};

	useEffect(() => {

		contactService.get().then(cnts => setContacts(cnts));

	}, []);

	const addContact = async (name, number) => {

		const contacts_ = await contactService.get();

		if (contacts_.some(cnt => cnt.name === name)) {

			if (!confirm(`Modify existing '${name}' entry with following phone number: ${number}?`)) return;

			nlog(name, "modifing with phone number", number, "is pending...");

			contactService.update(name, {name, number})
			.then(() => {

				nlog(name, "with phone number was modified with folowing values:", {number});

				contactService.get()
				.then(cnts => 
					setContacts(Array.from(cnts))
				);
			})
			// .catch(err => {

			// 	if (err.response.status === 404) {

			// 		nerr(`Entry of '${name}' was already removed from contacts`);
			// 	} else
			// 		console.error(err);
			// });
		} else {

			const cnt = {
				id: name,
				name,
				number
			};

			nlog(name, "with phone number", number, "is pending...");

			contactService.add(cnt).then(cnt$ => {

				setContacts(contacts_.concat(cnt$));

				nlog(cnt$.name, "with phone number", cnt$.number, "was added!");
			});
		}
	};

	const handleDelete = name => {

		if (!confirm(`Delete '${name}' ?`)) return;

		nlog(name, "removing is pending...");

		contactService.remove(name)
		.then(() => 
			contactService.get()
			.then(cnts => {

				nlog(name, "was removed");

				setContacts(Array.from(cnts))
			})
		)
		.catch(err => {

			if (err.response.status === 404) {

				nerr(`There is no such an entry at contacts/: '${name}'`);
			}
			console.error(err);
		});
	}

	const visibleItems = contacts.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));

	return (
		<div>
			{
				notification === null
				?
				null
				:
				<div className={"notification " + notification.type}>{notification.message}</div>
			}

			<h1>Filter</h1>
			<Filter value={filter} onChange={e => setFilter(e.target.value)}/>

			<h1>Add new contact</h1>
			<NewItemForm onSubmit={addContact}/>

			<h1>Contact List</h1>
			<Content list={visibleItems} onDelete={handleDelete}/>
		</div>
	);
};