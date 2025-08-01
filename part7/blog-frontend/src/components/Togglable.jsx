import { forwardRef, useImperativeHandle, useState } from "react";

export const Togglable = forwardRef((props, refs) => {

	const [visibility, setVisibility] = useState(false);

	const toggleVisibility = () => setVisibility(!visibility);

	useImperativeHandle(refs, () => {

		return {toggleVisibility};
	});

	if (visibility) {

		return (<>

			<div>
				{props.children}
			</div>
			<button onClick={toggleVisibility}>Cancel</button>
		</>);
	} else {

		return (<>

			<div style={{display: "none"}}>
				{props.children}
			</div>
			<button onClick={toggleVisibility}>{props.buttonLabel}</button>
		</>);
	}
});

Togglable.displayName = "Togglable";