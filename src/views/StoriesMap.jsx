import * as React from 'react';

import MapPageToggle from '../components/MapPageToggle';
import PageHeader from '../components/PageHeader';

export default class StoriesMap extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		this.props.actions.mapFocusChanged(true);

	}

	componentDidMount () {

		//

	}

	componentWillUnmount () {

		//

	}

	componentDidUpdate () {

		//

	}

	render () {

		return (
			<div>
				<MapPageToggle mapLink="/stories/map" pageLink="/stories/page" active="map" />
			</div>
		);

	}

}
