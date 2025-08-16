import { Box, LinearProgress } from "@mui/joy";
import User from "../User";
import { useUsers } from "../../hooks";


const UserListSection = () => {

	const users = useUsers();

	if (users.length) {

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
	} else {
		return (
			<LinearProgress color="primary" size="sm" value={25} variant="soft" />
		);
	}
};

export default UserListSection;