import React, { useState, useEffect } from "react";
import Slider from './components/slider';
import TableView from './components/table-view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';
import {
	Link, useParams
} from "react-router-dom";

const axios = require('axios');

function Season() {

	const d = new Date();
	const currentYear = d.getFullYear();
	const { year } = useParams();
	const [races, setRaces] = useState([]);
	const [raceSeason, setRaceSeason] = useState(year || currentYear);
	const [championId, setChampionId] = useState('');

	const fetchRaceData = async () => {
		const championResponse = await axios(`https://ergast.com/api/f1/${raceSeason}/driverStandings/1/drivers.json?limit=1`);
		const raceResponse = await axios(`https://ergast.com/api/f1/${raceSeason}/results/1.json`);
		setChampionId(processChampionData(championResponse));
		setRaces(processRaceData(raceResponse));
	};

	const processRaceData = (data) => {
		let champions = [];
		let raceData = data.data.MRData.RaceTable.Races;
		raceData.forEach(element => {
			let obj = {
				round: element.round,
				raceName: element.raceName,
				driverId: element.Results[0].Driver.driverId,
				givenName: element.Results[0].Driver.givenName,
				familyName: element.Results[0].Driver.familyName,
				nationality: element.Results[0].Driver.nationality
			};
			champions.push(obj);
		});
		return champions;
	}

	const processChampionData = (data) => {
		let driverId = data?.data?.MRData?.DriverTable?.Drivers[0]?.driverId || '';
		return driverId;
	}

	useEffect(() => {
		fetchRaceData();
	}, [raceSeason]);

	let SliderConfig = {
		range: {
			min: 1950,
			max: currentYear
		},
		bars: {
			colors: ['#1E3857', '#1E3857']
		}
	}

	let handleSliderChange = (value) => {
		setRaceSeason(value[0]);
	}

	let renderDetails = () => {
		let headData = ['Round', { value: 'Race Name', class: 'text-left' }, { value: 'Driver Name', class: 'text-left' }, { value: 'Nationality', class: 'text-left' }];
		let bodyData = [];
		let hasWinner = false;
		races.forEach(element => {
			let round = element.round;
			let raceName = element.raceName;
			let trophy = (element.driverId == championId) ? <FontAwesomeIcon icon={faTrophy} size='1x' color='#DFD072' style={{ marginLeft: '10px' }} /> : '';
			let driverName = <span>{element.givenName} {element.familyName} {trophy}</span>;
			let nationality = element.nationality;
			if (element.driverId == championId) {
				hasWinner = true
			}

			bodyData.push([round, raceName, driverName, nationality])
		});

		let raceText = (hasWinner) ? <p><FontAwesomeIcon icon={faTrophy} size='1x' color='#DFD072' style={{ marginRight: '3px' }} /> Indicates the champion of the season {raceSeason}.</p> : <p>No champion found for the season {raceSeason}.</p>;
		return <div style={{ marginTop: '50px' }}>
			<p style={{ textAlign: 'left' }}>{raceText}</p>
			<TableView
				headData={headData}
				bodyData={bodyData}
			/>
		</div>
	}

	const renderCardHeader = () => {
		return <div className='f1-card-header'>
			Season
		</div>
	}

	const renderSlider = () => {
		return <div style={{ width: '70%', margin: '0 auto' }}>
			<Slider
				key='CriteriaLackOfResponse'
				value={[raceSeason]}
				settings={SliderConfig}
				widgetId='criteria'
				onDragEnd={handleSliderChange} />
		</div>
	}


	return (
		<>
			<div style={{ display: 'inline-block', marginBottom: '10px' }}>
				<Link to={`/`}>
					<button className='f1-button'>
						<FontAwesomeIcon icon={faArrowLeft} size='1x' /> Back
					</button>
				</Link>
			</div>
			<div className='f1-card'>
				{renderCardHeader()}
				{renderSlider()}
				{renderDetails()}
			</div>
		</>
	);
}

export default Season;