export const NotificationBody = ({ofNotification}, ) => {

	return (
		ofNotification === null
		?
		null
		:
		<div className={"notification " + ofNotification.type}>{ofNotification.message}</div>
	);
};