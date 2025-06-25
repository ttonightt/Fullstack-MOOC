"use strict"

import axios from "axios";

const baseUrl = "http://localhost:3001/contacts";

const get = () => 
	axios.get(baseUrl)
	.then(res => res.data);

const add = entry => 
	axios.post(baseUrl, entry)
	.then(res => res.data);

const update = (id, entry) => 
	axios.put(`${baseUrl}/${id}`, entry)
	.then(res => res.data);

const remove = id => 
	axios.delete(`${baseUrl}/${id}`)
	.then(res => res.data);

export default {
	get,
	add,
	update,
	remove
};