import { useReducer } from "react";


let timeoutBuffer = null;

export const useNotification = () => {

    const [message, trigger] = useReducer((state, action) => {

		clearTimeout(timeoutBuffer);

		if (action !== null) {

			timeoutBuffer = setTimeout(() => {

				trigger(null);
			}, 5000);
		}

		return action;

	}, null);

    return [message, trigger];
};

const Notification = ({ message }) => {

    const style = {
        borderRadius: "6px",
        border: "2px solid #a1a1a1",
        backgroundColor: "#d1d1d1",
        padding: "1em",
        position: "fixed",
        top: "10%",
        right: "10%",
        zIndex: 100
    };

    if (message)
        return (
            <div style={style}>
                {message}
            </div>
        );
};

export default Notification;