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

	const handleSubmit = () => {

		dispatch(loginUser({username, password}))
			.unwrap()
			.then(() => {

				notify.success("You logged in successfully!");

				navigate("/posts");
			})
			.catch(e => {

				if (e.status === 401)
					notify.error("Wrong credentials!");
			});
	};

	return (<>
		<Card sx={{ width: "300px" }}>
			<Input data-testid="login-username" variant="soft" placeholder="username" value={username} onChange={e => setUsername(e.target.value)}/>
			<Input data-testid="login-password" variant="soft" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}
				type={passwordVisibility ? "text" : "password"}
				endDecorator={
					<Button onClick={() => setPasswordVisibility(!passwordVisibility)}>
						{passwordVisibility ? "Hide" : "Show"}
					</Button>
				}
			/>
			<Button data-testid="login-submit" size="sm" variant="soft" onClick={handleSubmit}>Login</Button>
		</Card>
	</>);
};

export default LoginSection;