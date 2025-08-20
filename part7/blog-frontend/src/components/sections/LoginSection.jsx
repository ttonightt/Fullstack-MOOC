import { useMemo, useState } from "react";
import { useErrorHandler, useNotify, useSession } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "@mui/joy";

const LoginSection = () => {

	const [ session, { login }] = useSession();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const handleSubmit = () => {

		login(username, password);
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