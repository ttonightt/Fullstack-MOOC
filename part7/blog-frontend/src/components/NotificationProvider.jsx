import { createContext, useState } from "react";

export const NotificationContext = createContext(null);

let index = 0;

const NotificationProvider = ({ children }) => {

	const [notifications, setNotifications] = useState([]);

	const triggerNotification = (message, { timeout, type, confirmation }) => {

		const id = index++;

		const notification = { message, type, confirmation };

		Object.defineProperty(notification, "__notificationId", {

			value: id,
			writable: false,
			configurable: false,
			enumerable: false
		});

		if (timeout > 0) {

			const timeoutId = setTimeout(() => {

				setNotifications(notifications.filter(item => item.__notificationId !== notification.__notificationId));
			}, timeout);

			Object.defineProperty(notification, "__timeoutId", {

				value: timeoutId,
				writable: false,
				configurable: false,
				enumerable: false
			});
		}

		setNotifications(_notifications => _notifications.concat(notification));
	};

	const closeNotification = notification => {

		if (notification.__timeoutId)
			clearTimeout(notification.__timeoutId);

		setNotifications(notifications.filter(item => item.__notificationId !== notification.__notificationId));
	};

	return (
		<NotificationContext.Provider value={{ notifications, triggerNotification, closeNotification }}>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationProvider;