import { useNotificationMessage, useNotificationStyle } from "./NotificationContext";

const Notification = () => {

	const message = useNotificationMessage();
	const colors = useNotificationStyle();

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 5
	};

	if (message !== null)
		return (
			<div style={{...style, ...colors}}>
				{message}
			</div>
		);
};

export default Notification;