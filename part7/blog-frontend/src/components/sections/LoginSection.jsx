import { useMemo, useState } from "react";
import { loginUser } from "../../reducers/seshReducer";
import { useDispatch } from "react-redux";
import { useNotify } from "../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Card, Input } from "@mui/joy";

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

				navigate("/posts");
			})
			.catch(e => {

				if (e.status === 401)
					notify.error("Wrong credentials!");
			});
	};

	return (<>
		<Card sx={{ width: "300px" }}>
			<Input variant="soft" placeholder="username" value={username} onChange={e => setUsername(e.target.value)}/>
			<Input variant="soft" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}
				type={passwordVisibility ? "text" : "password"}
				endDecorator={
					<Button onClick={() => setPasswordVisibility(!passwordVisibility)}>
						{passwordVisibility ? "Hide" : "Show"}
					</Button>
				}
			/>
			<Button size="sm" variant="soft" onClick={() => handleSubmit(username, password)}>Login</Button>
		</Card>
	</>);
};

export default LoginSection;