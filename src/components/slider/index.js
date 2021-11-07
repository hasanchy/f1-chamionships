import React from 'react';
import SliderPips from './slider-pips';
import SliderHandles from './slider-handles';
import SliderBars from './slider-bars';
import './slider.css';

class Slider extends React.Component {
	state = {
		sliderWidth: 0,
		handlePosition: 0,
		value: 0,
		values: [],
		handleSettings: [],
		zIndex: [],
		barPositions: []
	};

	UNSAFE_componentWillMount() {
		let topHadleIndex = parseInt(this.props.topHadleIndex, 10);
		this.setState({
			values: JSON.parse(JSON.stringify(this.props.value)),
			handleSettings: this.getHandleSettings(this.props.value),
			zIndex: this.getzIndex(topHadleIndex)
		})
	}

	componentDidMount() {
		window.addEventListener('resize', this.setSliderWidth)

		this.setSliderWidth();
	}

	getHandleBoundery = (valueMin, valueMax) => {
		let min; let max;

		min = (this.props.settings.handles && this.props.settings.handles.min) ? parseInt(this.props.settings.handles.min, 10) : valueMin;
		max = (this.props.settings.handles && this.props.settings.handles.max) ? parseInt(this.props.settings.handles.max, 10) : valueMax;

		if (this.props.settings.range.margin) {
			let marginRange = parseInt(this.props.settings.range.margin, 10);
			min = min + marginRange;
			max = max - marginRange;
		} else if (this.props.settings.range.marginLeft || this.props.settings.range.marginRight) {
			if (this.props.settings.range.marginLeft) {
				let marginLeft = parseInt(this.props.settings.range.marginLeft, 10);
				min = min + marginLeft;
			} else {
				let marginRight = parseInt(this.props.settings.range.marginRight, 10);
				min = min - marginRight;
			}
		}
		return ({
			min: min,
			max: max
		})
	};

	getHandleSettings = (value) => {
		let handleSettings = []

		let valueMin = parseInt(this.props.settings.range.min, 10);
		let valueMax = parseInt(this.props.settings.range.max, 10);

		let handleBoundery = this.getHandleBoundery(valueMin, valueMax);

		let firstIndex = 0;
		let lastIndex = value.length - 1;

		let marginHandle = (this.props.settings.handles && this.props.settings.handles.margin) ? parseInt(this.props.settings.handles.margin, 10) : 0;

		for (let i = firstIndex; i <= lastIndex; i++) {
			let previousIndex = i - 1;
			let nextIndex = i + 1;

			let rangeMin = (i === firstIndex) ? handleBoundery.min : value[previousIndex] + marginHandle;
			let rangeMax = (i === lastIndex) ? handleBoundery.max : value[nextIndex] - marginHandle;
			let settingsObj = {
				value: value[i],
				valueMin: valueMin,
				valueMax: valueMax,
				rangeMin: rangeMin,
				rangeMax: rangeMax
			}

			handleSettings.push(settingsObj);
		}

		return handleSettings;
	};

	getzIndex = (currentIndex) => {
		let zIndex = this.state.zIndex;
		let minIndex = 0;
		let maxIndex = this.props.value.length - 1;

		if (!zIndex.length) {
			for (let j = minIndex; j <= maxIndex; j++) {
				zIndex.push(j);
			}
		}

		let replacedzIndex = maxIndex;
		for (let i in zIndex) {
			if (i == currentIndex) {
				replacedzIndex = zIndex[i];
				zIndex[i] = maxIndex;
				break;
			}
		}

		for (let i in zIndex) {
			if (i != currentIndex && zIndex[i] > replacedzIndex) {
				let nextIndex = zIndex[i] - 1;
				zIndex[i] = nextIndex;
			}
		}

		return zIndex;
	};

	setSliderWidth = () => {
		let element = document.getElementById('f1-slider');
		let sliderWidth = 0;
		if (element) {
			sliderWidth = element.clientWidth;
		}
		if (sliderWidth > 0) {
			this.setState({
				sliderWidth: sliderWidth
			})
		}
	};

	handleDrag = (index, value, position) => {
		let barPositions = this.state.barPositions;
		barPositions[index] = position;
		this.setState({
			barPositions: barPositions
		})
	};

	handleDragEnd = (index, value, position) => {
		let values = this.state.values;
		values[index] = value;

		let barPositions = this.state.barPositions;
		barPositions[index] = position;
		this.setState({
			handleSettings: this.getHandleSettings(values, index),
			barPositions: barPositions
		})
		this.props.onDragEnd(values)
	};

	handleDragStart = (index, value, position) => {
		this.setState({
			zIndex: this.getzIndex(parseInt(index, 10))
		})
	};

	handleOnLoad = (index, value, position) => {
		let barPositions = this.state.barPositions;
		barPositions[index] = position;
		this.setState({
			barPositions: barPositions
		})
	};

	handleValueClick = (value) => {
		this.setState({
			value: value
		})
	};

	renderBars = (SliderBars) => {
		return <SliderBars positions={this.state.barPositions} color={this.props.settings.bars.colors} />
	};

	renderHandles = (SliderHandles) => {
		let handles = [];
		for (let i in this.state.handleSettings) {

			handles.push(<SliderHandles key={this.state.sliderWidth + i}
				sliderWidth={this.state.sliderWidth}
				index={i}
				zIndex={this.state.zIndex[i]}
				value={this.state.handleSettings[i].value}
				valueMin={this.state.handleSettings[i].valueMin}
				valueMax={this.state.handleSettings[i].valueMax}
				rangeMin={this.state.handleSettings[i].rangeMin}
				rangeMax={this.state.handleSettings[i].rangeMax}
				onLoad={this.handleOnLoad}
				onDragStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onDragEnd={this.handleDragEnd} />)
		}

		return handles;
	};

	renderPips = (SliderPips) => {
		return (<SliderPips
			sliderWidth={this.state.sliderWidth}
			min={this.props.settings.range.min}
			max={this.props.settings.range.max}
			onClick={this.handleValueClick} />)
	};

	render() {
		let pips; let bars; let handles;

		if (this.state.sliderWidth > 0) {
			pips = this.renderPips(SliderPips);
			bars = this.renderBars(SliderBars);
			handles = this.renderHandles(SliderHandles);
		}

		return (
			<div className='f1-slider-container'>
				<div className='f1-slider-bar-wrapper' id='f1-slider'>
					{pips}
					{bars}
					{handles}
				</div>
			</div>
		)
	}
}

export default Slider;