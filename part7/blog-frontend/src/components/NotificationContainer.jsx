import { Box } from "@mui/material";


const NotificationContainer = ({ children, Template, useNotificationData }) => {

	const data = useNotificationData();

	return (
		<Box sx={{ position: "absolute", top: "1vw", right: "1vw", zIndex: 100 }}>
			{data.map((notificationData, i) =>

				<Template key={i} notificationData={notificationData} />
			)}
			{children}
		</Box>
	);
};

export default NotificationContainer;