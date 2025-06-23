
const Header = props => {

	const {course} = props;

	return (
		<h1>{course}</h1>
	);
};

const Part = props => {

	const {name, exercises} = props;

	return (
		<p>{name} {exercises}</p>
	);
};

const Content = props => {

	const {parts} = props;

	return parts.map((part, i) => {

		return (
			<Part key={i} name={part.name} exercises={part.exercises}/>
		);
	});
};

const Total = props => {

	const {parts} = props;

	let total = 0;

	for (const part of parts) total += part.exercises;

	return (
		<p>Number of exercises {total}</p>
	);
};

export const App = () => {

	const course = {
		name: "Half Stack application development",
		parts: [
			{
				name: "Fundamentals of React",
				exercises: 10
			},
			{
				name: "Using props to pass data",
				exercises: 7
			},
			{
				name: "State of a component",
				exercises: 14
			}
		]	
	};

	return (
		<div>
			<Header course={course.name}/>
			<Content parts={course.parts}/>
			<Total parts={course.parts}/>
		</div>
	)
};