import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrorHandler } from "./hooks";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";

import { logoutUser, checkUser } from "./reducers/seshReducer";

import { Button, ButtonGroup, Sheet, Stack, Typography, Avatar, Box, LinearProgress } from "@mui/joy";


const tabs = [
	{title: "Posts", url: "/posts"},
	{title: "Users", url: "/users"}
];

const App = () => {

	const session = useSelector(state => state.session);
	const dispatch = useDispatch();

	const errorHandler = useErrorHandler();
	const navigate = useNavigate();
	const location = useLocation();

	//console.log("App");

	useEffect(() => {

		if (session.status === "stored")
			dispatch(checkUser())
				.unwrap()
				.catch(errorHandler);
	}, []);

	const handleLogout = () => {

		dispatch(logoutUser());
		navigate("/login");
	};

	return (
		<Stack direction="column" sx={{ minHeight: "60vh", "& a": { color: "inherit", textUnderlineOffset: "0.15em", textDecorationThickness: "1px" } }}>
			<Sheet sx={{ p: "1em" }}>
				<Stack direction="row" sx={{ height: "3em", justifyContent: "space-between", alignItems: "center" }}>
					<Typography level="h4" fontWeight="xl">Catcity Blog</Typography>
					<ButtonGroup>
					{
						tabs.map((item) =>
							<Link key={item.title} to={item.url}>
								<Button size="md" variant="soft"
									color={location.pathname.startsWith(item.url) ? "primary" : "neutral"}
								>{item.title}</Button>
							</Link>
						)
					}
					</ButtonGroup>
					<Box>
						{session.status === "fetching" &&

							<LinearProgress sx={{ width: "100px" }} color="primary" size="sm" value={25} variant="soft" />
						}
						{session.status === "empty" &&

							<Link to="/login">
								<Button data-testid="session-login">Log In</Button>
							</Link>
						}
						{session.status === "stored" &&

							<Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
								<Avatar alt={session.data.user.username} src={`/public/avatars/${session.data.user.username}.png`} />
								<Box>
									<Typography lineHeight="1.25em" level="body-sm" fontWeight="lg">
										{session.data.user.name}
									</Typography>
									<Typography lineHeight="1.25em" level="body-sm" data-testid="session-username">
										@{session.data.user.username}
									</Typography>
								</Box>
								<Button onClick={handleLogout} data-testid="session-logout">Log Out</Button>
							</Stack>
						}
					</Box>
				</Stack>
			</Sheet>
			<Stack sx={{ py: "2em", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
				<Outlet />
			</Stack>
		</Stack>
	);
};

export default App;