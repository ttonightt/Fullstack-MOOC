import { useState } from "react";
import { JSONPrettifier } from "./JSONPrettifier";

export const useNotification = () => {

	const [message, setMessage] = useState(null);
	const [timerBuffer, setTimerBuffer] = useState(null);

	const trigger = ({timeout, type, messages: msgs}) => {

		if (!(timeout > 0)) return console.error("useNotification's trigger cannot be performed with such a timeout:", timeout, "\n");

		if (timerBuffer) 
			clearTimeout(timerBuffer);

		setMessage({
			message: msgs.reduce(
				(s, t) => 
					s + (
						typeof t === "object"
						?
						JSONPrettifier(JSON.stringify(t))
						:
						t.toString()
					) + " "
				, ""
			),
			type
		});

		setTimerBuffer(
			setTimeout(() => {

				setMessage(null);
				setTimerBuffer(null);

			}, timeout)
		);
	};

	return [
		message,
		trigger
	];
};