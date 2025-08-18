import { Alert, Button } from "@mui/joy";

import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch } from "react-redux";
import { closeNotification } from "../reducers/notificationReducer";

const style = {
	marginTop: "1em",
	maxWidth: "40vw"
};

const Notification = ({notificationData}) => {

	const {message, type, confirmation} = notificationData;

	const dispatch = useDispatch();

	const alertProps = {};

	switch (type) {
		case "success":
			Object.assign(alertProps, { color: "success", startDecorator: <CheckCircleIcon /> });
			break;
		case "error":
			Object.assign(alertProps, { color: "danger", startDecorator: <ReportIcon /> });
			break;
		default:
			Object.assign(alertProps, { color: "neutral", startDecorator: <InfoIcon /> });
	}

	if (confirmation)
		Object.assign(alertProps, {
			endDecorator:
				<Button
					sx={{ borderRadius: "sm", px: "0.5em", py: "0.4em", lineHeight: "1em", minHeight: 0 }}
					color={alertProps.color}
					onClick={() => dispatch(closeNotification(notificationData))}
				>Ok</Button>
		});

	return (
		<Alert sx={style} variant="soft" {...alertProps}>{message}</Alert>
	);
};

export default Notification;