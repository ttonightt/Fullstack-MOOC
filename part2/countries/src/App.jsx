
import axios from "axios";
import { useEffect, useState } from "react";

const Filter = ({value, onChange}) => {

	return (<>
		<label htmlFor="">Find countries</label>
		<input type="text" onChange={onChange} value={value}/>
	</>);
};

const api_key = import.meta.env.VITE_WEATHERAPI_KEY;

const Country = ({info}) => {

	const [weather, setWeather] = useState(null);

	useEffect(() => {

		axios.get(`http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${info.capital[0]}`).then(({data}) => {

			setWeather(data.current);
			console.log(data.current);
		}).catch(err => {

			setWeather({});
			console.error(err);
		});
	}, []);

	return (<>
		<h1>
			{info.flag} {info.name.common}  |  <i>{info.name.official}</i>  |   <code>{info.cca3}</code>
		</h1>
		<img src={info.flags.svg} alt={"Flag of " + info.name.official} className="flag"/>
		<img src={info.coatOfArms.svg} alt={"Coat of arms of " + info.name.official} className="coat-of-arms ml-3"/>
		<h2>Languages</h2>
		<ul>
			{Object.values(info.languages).map(lang => <li key={lang}>{lang}</li>)}
		</ul>
		<h2>Weather</h2>
		{
			weather === null ? "Fetching data..." : (<>

				<img src={weather.condition.icon} alt={weather.condition.text} />   {weather.condition.text}
				<h3>{weather.temp_c}°C / {weather.temp_f}°F</h3>
				<p>
					Wind: {Math.round(weather.wind_kph / 3.6)} m/s  {weather.wind_dir}&nbsp;
					<b
						className="inline-block"
						style={{transform: `rotate(${weather.wind_degree - 90}deg)`}}
					>
						→
					</b>
				</p>
			</>)
		}
	</>);
};

const CountryList = ({query, toSetQuery}) => {

	const [clistFull, setCListFull] = useState(null);

	useEffect(() => {

		axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then(({data}) => {

			setCListFull(data);
			console.log(data[120]);
		});
	}, []);

	if (clistFull === null)
		return <p>Fetching data...</p>;

	if (query === "")
		return null;

	const targetCountry = clistFull.find(cntr => cntr.name.common.toLowerCase() === query.toLowerCase());

	const clist = targetCountry ? [targetCountry] : clistFull.filter(cntr => cntr.name.common.toLowerCase().includes(query.toLowerCase()));

	if (clist.length > 10)
		return <p>Too much countries match the query to show them all...</p>;

	if (clist.length === 1)
		return <Country info={clist[0]}/>;

	return clist.map(cntr => (
		<p key={cntr.cca3}>
			{cntr.flag} {cntr.name.common}
			<button onClick={() => toSetQuery(cntr.name.common)}>Show</button>
		</p>
	));
};

export const App = () => {

	const [query, setQuery] = useState("");

	const handleChange = e => {

		setQuery(e.target.value);
	};

	return (<>
		<Filter value={query} onChange={handleChange}/>
		<CountryList query={query} toSetQuery={value => setQuery(value)}/>
	</>);
};