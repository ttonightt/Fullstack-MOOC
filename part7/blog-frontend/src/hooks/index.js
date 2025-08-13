import { useDispatch, useSelector } from "react-redux";
import { triggerNotification, appendNotification } from "../reducers/notificationReducer";

export const useNotify = () => {

	const notifications = useSelector(state => state.notification);
	const dispatch = useDispatch();

	return {
		confirm: {

			success (message) {

				console.log(message);

				if (!notifications.some(item => item.message === message))
					dispatch(triggerNotification(message.toString(), { type: "success", confirmation: true }));
			},
			error (message) {

				console.error(message);

				if (!notifications.some(item => item.message === message))
					dispatch(triggerNotification(message.toString(), { type: "error", confirmation: true }));
			}
		},
		success (message) {

			console.log(message);
			dispatch(triggerNotification(message.toString(), { timeout: 5000, type: "success" }));
		},
		log (message) {

			console.log(message);
			dispatch(triggerNotification(message.toString(), { timeout: 5000, type: "info" }));
		},
		error (message) {

			console.error(message);
			dispatch(triggerNotification(message.toString(), { timeout: 5000, type: "error" }));
		}
	};
};