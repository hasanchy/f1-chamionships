import React from 'react';

class SliderPips extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.sliderWidth !== this.props.sliderWidth) ? true : false;
	}

	getPipPosition = (value) => {
		let min = parseInt(this.props.min, 10);
		let max = parseInt(this.props.max, 10);
		let sliderWidth = parseInt(this.props.sliderWidth, 10);
		return ((value - min) / (max - min)) * sliderWidth;
	};

	handleValueClick = (value, e) => {
		// console.log(e.target.value);
		// this.props.onClick(value)
	};

	renderPips = () => {
		let pipValue = []
		pipValue.push(parseInt(this.props.min, 10));
		pipValue.push(parseInt(this.props.max, 10));

		let pips = [];

		for (let i in pipValue) {
			let position = this.getPipPosition(pipValue[i]);
			pips.push(<div style={{ left: position + 'px' }} className='f1-slider-pips' key={Math.random()} onClick={this.handleValueClick(pipValue[i])}>{pipValue[i]}</div>);
		}
		return pips;
	};

	render() {
		return (
			<div className='f1-slider-pips-container'>
				{this.renderPips()}
			</div>
		)
	}
}

export default SliderPips;