import { useMemo, useState } from "react";
import { loginUser } from "../../reducers/seshReducer";
import { useDispatch } from "react-redux";
import { useNotify } from "../../hooks";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSection = () => {

	const dispatch = useDispatch();
	const notify = useNotify();
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const handleSubmit = (username, password) => {

		dispatch(loginUser({username, password}))
			.unwrap()
			.then(() => {

				notify.log("You logged in successfully!");
			})
			.catch(e => {

				if (e.status === 401)
					notify.error("Wrong credentials!");
			});

		navigate("/posts");
	};

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
		<button onClick={() => handleSubmit(username, password)}>Login</button>
		<input
			type="checkbox"
			id="passwordVisibility"
			onChange={e => setPasswordVisibility(e.target.checked)}
		/>
		<label htmlFor="passwordVisibility">show password</label>
	</>);
};

export default LoginSection;