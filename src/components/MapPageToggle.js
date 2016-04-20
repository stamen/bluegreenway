import * as React from 'react';
import { Link } from 'react-router';

export default class MapPageToggle extends React.Component {

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
			<div className="map-page-toggle">
				<Link to={this.props.mapLink} className={"map-page-toggle-btn" + (this.props.active === 'map' ? ' active' : '')}>map view</Link>
				<Link to={this.props.pageLink} className={"map-page-toggle-btn" + (this.props.active === 'page' ? ' active' : '')}>page view</Link>
			</div>
		);
	}
}
