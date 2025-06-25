import { useState } from "react";

const JSONPrettifier = str => {

	let str_ = "";

	for (const c of str) {

		switch (c) {
			case ",":
				str_ += ", ";
				break;
			case ":":
				str_ += ": ";
				break;
			case "\"":
				break;
			default:
				str_ += c;
		}
	}

	return str_;
};

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