
const Header = ({text}) => {

	return (
		<h1>{text}</h1>
	);
};

const Part = ({name, exercises}) => {

	return (
		<p>{name} {exercises}</p>
	);
};

const Content = ({parts}) => {

	return parts.map((part, i) => {

		return (
			<Part key={part.name} name={part.name} exercises={part.exercises}/>
		);
	});
};

export const Course = ({course}) => {

	return (<>
		<Header text={course.name}/>
		<Content parts={course.parts}/>
		<b>total of {course.parts.reduce((s, v) => s + v.exercises, 0)} exercises</b>
	</>);
};