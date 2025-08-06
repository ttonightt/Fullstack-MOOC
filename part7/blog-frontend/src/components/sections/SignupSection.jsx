import { useState } from "react";

const SignupSection = () => {

	const handleSubmit = e => {
		e.preventDefault();

		console.log(e);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" name="name" placeholder="name" />
			<input type="text" name="username" placeholder="username" />
			<input type="text" name="password" placeholder="password" />
			<input type="text" name="repeatPassword" placeholder="repeatPassword" />
			<br/>
			<button formAction="submit">Sign Up</button>
		</form>
	);
};

export default SignupSection;