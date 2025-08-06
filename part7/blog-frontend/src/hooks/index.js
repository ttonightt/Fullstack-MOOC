import { useDispatch } from "react-redux";
import { triggerNotification, appendNotification } from "../reducers/notificationReducer";

export const useNotify = () => {

	const dispatch = useDispatch();

	return {
		log (message) {

			console.log(message);
			dispatch(triggerNotification(message.toString(), 5000, "info"));
		},
		error (message) {

			console.error(message);
			dispatch(triggerNotification(message.toString(), 5000, "error"));
		}
	};
};