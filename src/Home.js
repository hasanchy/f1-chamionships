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

	const [champions, setChampions] = useState([]);
	const [year, setYear] = useState({ min: 2005, max: 2021 });

	useEffect(() => {
		fetchChapmions();
	}, [year]);

	const fetchChapmions = async () => {
		const response = await axios('http://ergast.com/api/f1/driverStandings/1.json?limit=100');
		setChampions(processResponse(response));
	};

	const processResponse = (data) => {
		let processedData = [];
		let StandingsLists = data?.data?.MRData?.StandingsTable?.StandingsLists || [];
		StandingsLists.forEach(element => {
			let obj = {
				year: element.season,
				givenName: element.DriverStandings[0].Driver.givenName,
				familyName: element.DriverStandings[0].Driver.familyName,
				nationality: element.DriverStandings[0].Driver.nationality
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
				max: 2021
			},
			bars: {
				colors: ['#1E3857', '#FD2D10', '#1E3857']
			}
		}

		return <div style={{ width: '70%', margin: '0 auto' }}>
			<Slider
				key='CriteriaLackOfResponse'
				value={[2005, 2021]}
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
		let headData = ['Year', 'Name', 'Nationality', ''];
		let bodyData = [];
		champions.forEach(element => {
			if (element.year >= year.min && element.year <= year.max) {
				let year = element.year;
				let name = `${element.givenName} ${element.familyName}`;
				let nationality = element.nationality;
				let button = <Link to={`/season/${year}`} className='float-right'>
					<button className='f1-button'>
						<FontAwesomeIcon icon={faEye} size='1x' /> View
					</button>
				</Link>

				bodyData.push([year, name, nationality, button])
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