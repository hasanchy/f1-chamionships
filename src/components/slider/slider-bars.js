import React from 'react';

class SliderBars extends React.Component {
	renderBars = () => {
		return (
			<div className='f1-slider-bar-container'>
				{this.renderDefaultBar()}
				{this.renderInnerBars()}
			</div>
		)
	};

	renderDefaultBar = () => {
		return <div className='f1-slider-default-bar' style={{ backgroundColor: this.props.color[0] }}></div>
	};

	renderInnerBars = () => {
		let innerBars = [];
		for (let i in this.props.positions) {
			let colorIndex = parseInt(i, 10) + 1;
			innerBars.push(<div key={Math.random()} className='f1-slider-inner-bar' style={{ left: this.props.positions[i], backgroundColor: this.props.color[colorIndex] }}></div>);
		}
		return innerBars;
	};

	render() {
		return this.renderBars();
	}
}

export default SliderBars;