import { useState } from "react";

const LoginSection = () => {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	return (<>
		<input
			type="text"
			value={username}
			onChange={e => setUsername(e.target.value)}
			placeholder="username"
		/>
		<input
			type={passwordVisibility ? "text" : "password"}
			value={password}
			onChange={e => setPassword(e.target.value)}
			placeholder="password"
		/>
		<br/>
		<button onClick={() => onSubmit(username, password)}>Login</button>
		<input
			type="checkbox"
			id="passwordVisibility"
			onChange={e => setPasswordVisibility(e.target.checked)}
		/>
		<label htmlFor="passwordVisibility">show password</label>
	</>);
};

export default LoginSection;