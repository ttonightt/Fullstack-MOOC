import { useMemo, useState } from "react";
import { loginUser } from "../../reducers/seshReducer";
import { useDispatch } from "react-redux";
import { useErrorHandler, useNotify } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "@mui/joy";

const LoginSection = () => {

	const dispatch = useDispatch();
	const notify = useNotify();
	const navigate = useNavigate();

	const errorHandler = useErrorHandler();

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
			.catch(errorHandler);
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