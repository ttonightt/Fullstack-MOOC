import { createContext, useContext, useReducer } from "react";


export const NotificationContext = createContext();

let timeoutBuffer = null;

export const NotificationContextProvider = props => {

	const [message, triggerMessage] = useReducer((state, action) => {

		clearTimeout(timeoutBuffer);

		if (action !== null) {

			timeoutBuffer = setTimeout(() => {

				triggerMessage(null);
			}, 3000);
		}

		return action;

	}, null);

	return (
		<NotificationContext.Provider value={[message, triggerMessage]}>
			{props.children}
		</NotificationContext.Provider>
	);
};

export const useNotify = () => {

	const [message, triggerMessage] = useContext(NotificationContext);

	return (content, style) => triggerMessage(content === null ? null : { content, style });
};

export const useNotificationMessage = () => useContext(NotificationContext)[0]?.content ?? null;

export const useNotificationStyle = () => useContext(NotificationContext)[0]?.style;