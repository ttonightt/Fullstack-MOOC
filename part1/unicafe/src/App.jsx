import { useState } from "react"

const Button = ({onClick, text}) => {

	return <button onClick={onClick}>{text}</button>
};

const StatisticLine = ({text, value}) => {

	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	);
};

const Statistics = ({good, neutral, bad}) => {

	const allQ = good + neutral + bad;
	const average = (good - bad) / allQ;
	const positive = good * 100 / allQ;

	if (allQ === 0) {

		return <p>No feedback given</p>
	} else {

		return (
			<table>
				<tbody>
					<StatisticLine text="good" value={good} />
					<StatisticLine text="neutral" value={neutral} />
					<StatisticLine text="bad" value={bad} />
					<StatisticLine text="all" value={allQ} />
					<StatisticLine text="average" value={average} />
					<StatisticLine text="positive" value={positive} />
				</tbody>
			</table>
		);
	}
};

export const App = () => {

	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h1>give feedback</h1>

			<Button text="good" onClick={() => setGood(good + 1)} />
			<Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
			<Button text="bad" onClick={() => setBad(bad + 1)} />

			<h1>statistics</h1>

			<Statistics good={good} neutral={neutral} bad={bad}/>
		</div>
	);
}