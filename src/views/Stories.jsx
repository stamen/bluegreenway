import * as React from 'react';

// import components from @stamen/panorama
// import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

import MapPageToggle from '../components/MapPageToggle';
import PageHeader from '../components/PageHeader';

// main app container
export default class Stories extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		this.props.actions.mapFocusChanged(false);

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
				<MapPageToggle mapLink="/stories/map" pageLink="/stories/page" active="page" />
				<div id='stories' className="grid-container">
					<PageHeader />
					<h1>STORIES</h1>
				</div>
			</div>
		);

	}

}
