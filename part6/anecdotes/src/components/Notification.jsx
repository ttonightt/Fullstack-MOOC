import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

let timeoutBuffer = null;

const Notification = () => {

	const notification = useSelector(state => state.notification);
	const dispatch = useDispatch();

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1
	};

	useEffect(() => {

		if (notification === null) return;

		clearTimeout(timeoutBuffer);

		timeoutBuffer = setTimeout(() => {

			dispatch({type: "notification/setNotification", payload: null});
		}, 5000);

	}, [notification]);

	if (notification !== null)
		return (
			<div style={style}>
				{notification}
			</div>
		);
};

export default Notification;