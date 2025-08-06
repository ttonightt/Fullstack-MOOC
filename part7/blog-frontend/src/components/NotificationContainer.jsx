import styled from "styled-components";

const Container = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	max-height: 100vh;
	max-width: 100vw;
	box-sizing: content-box;
	padding: 20px;
`

const NotificationContainer = ({ children, Template, useNotificationData }) => {

	const data = useNotificationData();

	return (
		<Container>
			{data.map(notificationData =>

				<Template key={notificationData.__notificationId.toString()} notificationData={notificationData} />
			)}
			{children}
		</Container>
	);
};

export default NotificationContainer;