import { Alert } from "@mui/joy";

import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const style = {
	marginTop: "1em"
};

const Notification = ({notificationData}) => {

	const {message, type} = notificationData;

	switch (type) {
		case "success":
			return (
				<Alert color="success" sx={style} startDecorator={ <CheckCircleIcon /> }>{message}</Alert>
			);
		case "error":
			return (
				<Alert color="danger" sx={style} startDecorator={ <ReportIcon /> }>{message}</Alert>
			);
		default:
			return (
				<Alert color="neutral" sx={style} startDecorator={ <InfoIcon /> }>{message}</Alert>
			);
	}
};

export default Notification;