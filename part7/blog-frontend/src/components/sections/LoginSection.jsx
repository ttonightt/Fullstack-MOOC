import { useMemo, useState } from "react";
import { loginUser } from "../../reducers/seshReducer";
import { useDispatch } from "react-redux";
import { useNotify } from "../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
		<TextField
			value={username}
			onChange={e => setUsername(e.target.value)}
			label="Username"
			variant="standard"
		/>
		<FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
			<InputLabel>Password</InputLabel>
			<OutlinedInput
				type={passwordVisibility ? "text" : "password"}
				value={password}
				onChange={e => setPassword(e.target.value)}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							onClick={() => setPasswordVisibility(!passwordVisibility)}
							edge="end"
						>
							{passwordVisibility ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
				label="Password"
			/>
		</FormControl>
		<br/>
		<Button onClick={() => handleSubmit(username, password)}>Login</Button>
	</>);
};

export default LoginSection;