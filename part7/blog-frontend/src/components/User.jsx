import { Card, Typography, Avatar, Stack, Box } from "@mui/joy";
import { Link } from "react-router-dom";


const User = ({ user }) => {

	return (
		<Card size="md">
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "nowrap" }}>
				<Avatar size="lg" alt={user.username} src={`/public/avatars/${user.username}.png`} />
				<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
					<Typography noWrap textOverflow="ellipsis" level="h4" lineHeight="1.25em">
						{user.name}
					</Typography>
					<Link to={user.id}>
						<Typography noWrap level="body-md" lineHeight="1.25em">
							@{user.username}
						</Typography>
					</Link>
				</Box>
			</Stack>
		</Card>
	);
};

export default User;