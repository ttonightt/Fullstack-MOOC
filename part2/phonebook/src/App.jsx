
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

	const handleAdd = (name, number) => {

		const target = contacts.find(cnt => cnt.name === name);

		if (target) {

			if (!confirm(`Modify existing '${name}' entry with following phone number: ${number}?`)) return;

			nlog(name, "modifing with phone number", number, "is pending...");

			const id = target.id;

			contactService
				.update(id, {name, number})
				.then(_cnt => {

					nlog(name, "with phone number was modified with folowing values:", {number}, "from", _cnt);

					contactService.get()
						.then(cnts => 
							setContacts(Array.from(cnts))
						);
				})
				.catch(err => {

					if (err.response.status === 404) {

						nerr(`Entry of '${name}' was already removed from contacts`);
					} else
						console.error(err);
				});
		} else {

			const contact_ = {
				name,
				number
			};

			nlog(name, "with phone number", number, "is pending...");

			contactService
				.add(contact_)
				.then(cnt => {

					setContacts(contacts.concat(cnt));

					nlog(cnt.name, "with phone number", cnt.number, "was added!");
				});
		}
	};

	const handleDelete = id => {

		const {name} = contacts.find(cnt => cnt.id === id);

		if (!confirm(`Delete '${name}' ?`)) return;

		nlog(name, "removing is pending...");

		contactService
			.remove(id)
			.then(() => 
				contactService
					.get()
					.then(contacts_ => {

						nlog(name, "was removed");

						setContacts(contacts_)
					})
			)
			.catch(err => {

				if (err.response.status === 404)
					nerr(`There is no such an entry at contacts/: '${name}'`);

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
			<NewItemForm onSubmit={handleAdd}/>

			<h1>Contact List</h1>
			<Content list={visibleItems} onDelete={handleDelete}/>
		</div>
	);
};