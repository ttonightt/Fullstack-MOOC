import { Alert } from "@mui/material";

const style = {
	marginBottom: "1vw"
};

const Notification = ({notificationData}) => {

	const {message, type} = notificationData;

	switch (type) {
		case "info":
			return (
				<Alert severity="success" style={style}>{message}</Alert>
			);
		case "error":
			return (
				<Alert severity="error" style={style}>{message}</Alert>
			);
		default:
			return (
				<Alert style={style}>{message}</Alert>
			);
	}
};

export default Notification;