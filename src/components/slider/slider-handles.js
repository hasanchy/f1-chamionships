import React from 'react';

class SliderHandles extends React.Component {
	state = {
		drag: false,
		pageX: 0,
		handleId: 'handle' + Math.floor((Math.random() * 100000) + 1),
		value: 0,
		position: 0,
		positionMin: 0,
		positionMax: 0,
		zIndex: 0
	};

	UNSAFE_componentWillMount() {
		let value = parseInt(this.props.value, 10);
		let rangeMin = parseInt(this.props.rangeMin, 10);
		let rangeMax = parseInt(this.props.rangeMax, 10);

		let position = this.getPosition(value);
		let positionMin = this.getPosition(rangeMin);
		let positionMax = this.getPosition(rangeMax);
		this.setState({
			value: value,
			position: position,
			positionMin: positionMin,
			positionMax: positionMax,
			zIndex: this.props.zIndex
		})
	}

	componentDidMount() {
		let that = this;
		document.getElementById(this.state.handleId).addEventListener('mousedown', function (e) {
			e.preventDefault();
			that.handleDragStart(e);
		}, false);

		document.addEventListener('mousemove', function (e) {
			e.preventDefault();
			that.handleDragMove(e);
		}, false);

		document.addEventListener('mouseup', function (e) {
			e.preventDefault();
			that.handleDragEnd(e);
		}, false);


		document.getElementById(this.state.handleId).addEventListener('touchstart', function (e) {
			e.preventDefault();
			that.handleDragStart(e);
		}, false);

		document.getElementById(this.state.handleId).addEventListener('touchmove', function (e) {
			e.preventDefault();
			that.handleDragMove(e);
		}, false);

		document.getElementById(this.state.handleId).addEventListener('touchend', function (e) {
			e.preventDefault();
			that.handleDragEnd(e);
		}, false);

		this.props.onLoad(this.props.index, this.state.value, this.state.position)
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.rangeMin !== nextProps.rangeMin || this.props.rangeMax !== nextProps.rangeMax || this.props.zIndex !== nextProps.zIndex) {
			let rangeMin = parseInt(nextProps.rangeMin, 10);
			let rangeMax = parseInt(nextProps.rangeMax, 10);

			let positionMin = this.getPosition(rangeMin);
			let positionMax = this.getPosition(rangeMax);

			this.setState({
				positionMin: positionMin,
				positionMax: positionMax,
				zIndex: nextProps.zIndex
			})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (JSON.stringify(this.state) !== JSON.stringify(nextState)) ? true : false;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.drag) {
			this.props.onDrag(this.props.index, this.state.value, this.state.position)
		}
	}

	getPageX = (e) => {
		let pageX;

		if (e.touches) {
			pageX = e.touches[0].clientX;
		} else {
			pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
		}

		return pageX;
	}

	getPosition = (value) => {
		let min = parseInt(this.props.valueMin, 10);
		let max = parseInt(this.props.valueMax, 10);
		let sliderWidth = parseInt(this.props.sliderWidth, 10);
		return ((value - min) / (max - min)) * sliderWidth;
	}

	getValue = (postion) => {
		let min = parseInt(this.props.valueMin, 10);
		let max = parseInt(this.props.valueMax, 10);
		let sliderWidth = parseInt(this.props.sliderWidth, 10);
		let value = (Math.round((max - min) * (postion / sliderWidth)) + min);
		return value;
	}

	handleDragEnd = (e) => {
		if (this.state.drag) {
			let position = this.getPosition(this.state.value);
			this.setState({
				drag: false,
				position: position
			})
			this.props.onDragEnd(this.props.index, this.state.value, this.state.position);
		}
	}

	handleDragMove = (e) => {
		if (this.state.drag) {
			let pageX = this.getPageX(e);
			let newPosition = this.state.position + (pageX - this.state.pageX);

			if (newPosition <= this.state.positionMin) {
				pageX = pageX + (this.state.positionMin - newPosition);
				newPosition = this.state.positionMin;
			} else if (newPosition >= this.state.positionMax) {
				pageX = pageX - (newPosition - this.state.positionMax);
				newPosition = this.state.positionMax;
			}
			let newValue = this.getValue(newPosition);

			this.setState({
				pageX: pageX,
				value: newValue,
				position: newPosition
			});
		}
	}

	handleDragStart = (e) => {
		let pageX = this.getPageX(e);
		this.setState({
			drag: true,
			pageX: pageX
		});
		this.props.onDragStart(this.props.index, this.state.value, this.state.position)
	}

	renderCircle = () => {
		return (<div id={this.state.handleId} className='f1-slider-handle-outer-circle'>
			<div className='f1-slider-handle-inner-circle'></div>
		</div>)
	}

	renderHandles = () => {
		return (
			<div style={{ position: 'absolute', left: this.state.position, zIndex: this.state.zIndex }}>
				{this.renderCircle()}
				{this.renderMarker()}
				{this.renderValue()}
			</div>
		)
	}

	renderMarker = () => {
		return <div className='f1-slider-handle-marker'></div>
	}

	renderValue = () => {
		let value = []
		value.push(this.renderValueCenter());
		return value;
	}

	renderValueCenter = () => {
		let value = (this.state.value >= this.props.valueMin) ? this.state.value : '';
		let fontSize = (this.state.drag) ? 21 : 18;
		return (<div key={Math.random()} className='f1-slider-handle-container' style={{ fontSize: fontSize + 'px' }}>
			{value}
		</div>)
	}

	render() {
		return this.renderHandles();
	}
}

export default SliderHandles;