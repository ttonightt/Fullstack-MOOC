import { Box, LinearProgress, Typography } from "@mui/joy";
import User from "../User";
import { useUsers } from "../../hooks";


const UserListSection = () => {

	const users = useUsers();

	if (!users)
		return (
			<LinearProgress color="primary" size="sm" value={25} variant="soft" />
		);

	if (users.length === 0)
		return (
			<Typography ml="1.25rem" sx={{ opacity: 0.35 }} level="h2">No users yet...</Typography>
		);

	return (
		<Box sx={{ display: "grid", gridTemplateColumns: "33% 33% 33%", gap: "1rem" }}>
			{
				users.map(user => 
					<Box key={user.id}>
						<User user={user} />
					</Box>
				)
			}
		</Box>
	);
};

export default UserListSection;