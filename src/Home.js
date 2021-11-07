import React, { useState, useEffect } from "react";
import Slider from './components/slider';
import TableView from './components/table-view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
	Link
} from "react-router-dom";
const axios = require('axios');

function Home() {

	const d = new Date();
	const currentYear = d.getFullYear();
	const [champions, setChampions] = useState([]);
	const [year, setYear] = useState({ min: 2005, max: currentYear });

	useEffect(() => {
		fetchChapmions();
	}, [year]);

	const fetchChapmions = async () => {
		const response = await axios('https://ergast.com/api/f1/driverStandings/1.json?limit=100');
		setChampions(processResponse(response));
	};

	const processResponse = (data) => {
		let processedData = [];
		let StandingsLists = data?.data?.MRData?.StandingsTable?.StandingsLists || [];
		StandingsLists.forEach(element => {
			let obj = {
				season: element.season,
				givenName: element.DriverStandings[0].Driver.givenName,
				familyName: element.DriverStandings[0].Driver.familyName,
				nationality: element.DriverStandings[0].Driver.nationality,
				url: element.DriverStandings[0].Driver.url,
				points: element.DriverStandings[0].points,
				wins: element.DriverStandings[0].wins
			};
			processedData.push(obj);
		});

		return processedData;
	}

	const handleSliderChange = (value) => {
		let yearRange = {
			min: value[0],
			max: value[1]
		}
		setYear(yearRange);
	}

	const renderSlider = () => {
		let SliderConfig = {
			range: {
				min: 1950,
				max: currentYear
			},
			bars: {
				colors: ['#1E3857', '#FD2D10', '#1E3857']
			}
		}

		return <div style={{ width: '70%', margin: '0 auto' }}>
			<Slider
				key='CriteriaLackOfResponse'
				value={[2005, currentYear]}
				settings={SliderConfig}
				onDragEnd={handleSliderChange} />
		</div>
	}

	const renderCardHeader = () => {
		return <div className='f1-card-header'>
			Champions
		</div>
	}

	const renderTableView = () => {
		let headData = ['Season', { value: 'Name', class: 'text-left' }, { value: 'Nationality', class: 'text-left' }, 'Wins', 'Points', { value: '', class: 'text-right' }];
		let bodyData = [];
		champions.forEach(element => {
			if (element.season >= year.min && element.season <= year.max) {
				let name = <a href={element.url} target='_blank'>{element.givenName} {element.familyName}</a>;
				let button = <Link to={`/season/${element.season}`}>
					<button className='f1-button'>
						<FontAwesomeIcon icon={faEye} size='1x' /> View
					</button>
				</Link>

				bodyData.push([element.season, name, element.nationality, element.wins, element.points, button])
			}
		});

		let rangeText = (year.min == year.max) ? `Formula1 world champion of ${year.min}.` : `Formula1 world champions from ${year.min} to ${year.max}.`;
		return <div style={{ marginTop: '50px' }}>
			<p style={{ textAlign: 'left' }}>{rangeText}</p>
			<TableView
				headData={headData}
				bodyData={bodyData}
			/>
		</div>
	}


	return (
		<div className='f1-card'>
			{renderCardHeader()}
			{renderSlider()}
			{renderTableView()}
		</div>
	);
}

export default Home;