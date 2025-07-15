import { useState } from "react";

export const PostForm = ({onSubmit}) => {

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	return (<>
		Title:
		<input type="text" value={title} onChange={e => setTitle(e.target.value)}/><br/>
		Author:
		<input type="text" value={author} onChange={e => setAuthor(e.target.value)}/><br/>
		URL:
		<input type="text" value={url} onChange={e => setUrl(e.target.value)}/><br/>
		<button onClick={() => onSubmit({title, author, url})}>Save</button>
	</>);
};