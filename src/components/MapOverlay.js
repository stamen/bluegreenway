import * as React from 'react';

export default class MapOverlay extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	render () {
		return (
			<div className="map-overlay">
				{this.props.children}
			</div>
		);
	}

}
