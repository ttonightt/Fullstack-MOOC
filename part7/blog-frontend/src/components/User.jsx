import { Avatar, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";


const User = ({ user }) => {

	return (
		<Grid container size={12}>
			<Grid size="grow">
				<Paper>
					<h3>{user.name}</h3>
					<Link to={user.id}>
						<h4>{user.username}</h4>
					</Link>
					<Avatar key={user.id} alt={user.username} src={`/public/avatars/${user.id}.png`} />
				</Paper>
			</Grid>
		</Grid>
	);
};

export default User;