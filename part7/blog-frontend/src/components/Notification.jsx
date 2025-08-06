import { styled } from "styled-components"


const DefaultNotification = styled.div`
	background-color: #e6e6e6;
	border-radius: 0.3em;
	font-family: monospace;
	font-size: 1rem;
	font-weight: 500;
	padding: 1em;
	color: black;
`

const InfoNotification = styled.div`
	background-color: #caf3dc;
	border-radius: 0.3em;
	font-family: monospace;
	font-size: 1rem;
	font-weight: 500;
	padding: 1em;
	color: green;
`

const ErrorNotification = styled.div`
	background-color: #f3cada;
	border-radius: 0.3em;
	font-family: monospace;
	font-size: 1rem;
	font-weight: 500;
	padding: 1em;
	color: red;
`

const Notification = ({notificationData}) => {

	const {message, type} = notificationData;

	switch (type) {
		case "info":
			return (
				<InfoNotification>
					{message}
				</InfoNotification>
			);
		case "error":
			return (
				<ErrorNotification>
					{message}
				</ErrorNotification>
			);
		default:
			return (
				<DefaultNotification>
					{message}
				</DefaultNotification>
			);
	}
};

export default Notification;