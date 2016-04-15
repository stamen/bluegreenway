import * as React from 'react';

// import components from @stamen/panorama
// import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

import PageHeader from '../components/PageHeader';

// main app container
export default class Events extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		//

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
			<div id='events' className="grid-container">
				<PageHeader />
				<h1>EVENTS</h1>
			</div>
		);

	}

}
